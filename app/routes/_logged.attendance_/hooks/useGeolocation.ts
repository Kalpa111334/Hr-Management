import { Utility } from '@/core/helpers/utility'
import { useCallback, useEffect, useState } from 'react'
import type {
  GeofenceEvent,
  GeolocationError,
  GeolocationPosition,
} from '../types'

interface GeofenceOptions {
  latitude: number
  longitude: number
  radius: number
  interval?: number
  autoCheckInThreshold?: number // Minutes to wait before auto check-in (default: 2)
  autoCheckOutThreshold?: number // Minutes to wait before auto check-out (default: 5)
  onEntry?: () => void
  onExit?: () => void
  onAutoCheckIn?: () => void // Callback when auto check-in threshold is met
  onAutoCheckOut?: () => void // Callback when auto check-out threshold is met
  enableAutoAttendance?: () => void
  disableAutoAttendance?: () => void
  isEmergencyMode?: boolean // Flag to indicate emergency mode
  emergencyLocation?: {
    latitude: number
    longitude: number
    radius: number
  }
}

export const useGeolocation = (
  options: PositionOptions = { enableHighAccuracy: true },
  geofenceOptions?: GeofenceOptions,
) => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [isWithinGeofence, setIsWithinGeofence] = useState(false)
  const [lastGeofenceState, setLastGeofenceState] = useState(false)
  const [positionHistory, setPositionHistory] = useState<GeolocationPosition[]>(
    [],
  )
  const [emergencyLocationHistory, setEmergencyLocationHistory] = useState<
    Array<{ position: GeolocationPosition; timestamp: string }>
  >([])
  const [consecutiveChecks, setConsecutiveChecks] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const [lastSpeed, setLastSpeed] = useState<number | null>(null)
  const [lastHeading, setLastHeading] = useState<number | null>(null)
  const [movementPatterns, setMovementPatterns] = useState<
    Array<{ speed: number; heading: number; timestamp: string }>
  >([])
  const [locationReached, setLocationReached] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [timeInsideGeofence, setTimeInsideGeofence] = useState(0)
  const [timeOutsideGeofence, setTimeOutsideGeofence] = useState(0)
  const [lastCheckTime, setLastCheckTime] = useState(Date.now())

  const debouncedSetPosition = useCallback(
    Utility.debounce((pos: GeolocationPosition) => {
      setPosition(pos)
    }, 1000),
    [],
  )

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const checkGeofence = (pos: GeolocationPosition) => {
    if (!geofenceOptions) return

    const distance = calculateDistance(
      pos.coords.latitude,
      pos.coords.longitude,
      geofenceOptions.latitude,
      geofenceOptions.longitude,
    )

    const BUFFER_ZONE = 2 // 2 meters buffer zone
    const effectiveRadius = geofenceOptions.isEmergencyMode
      ? 500
      : geofenceOptions.radius
    const withinGeofence = distance <= effectiveRadius + BUFFER_ZONE

    // Validate timestamp
    const posTimestamp = new Date(pos.timestamp).getTime()
    const now = new Date().getTime()
    if (now - posTimestamp > 30000) {
      // 30 seconds
      return
    }

    const timeDiff = now - lastCheckTime
    setLastCheckTime(now)

    if (withinGeofence) {
      setConsecutiveChecks(prev => prev + 1)
      setTimeInsideGeofence(prev => prev + timeDiff)
      setTimeOutsideGeofence(0)
    } else {
      setConsecutiveChecks(0)
      setTimeOutsideGeofence(prev => prev + timeDiff)
      setTimeInsideGeofence(0)
    }

    setIsWithinGeofence(withinGeofence)

    const autoCheckInThreshold =
      (geofenceOptions.autoCheckInThreshold || 2) * 60 * 1000 // Convert minutes to ms
    const autoCheckOutThreshold =
      (geofenceOptions.autoCheckOutThreshold || 5) * 60 * 1000 // Convert minutes to ms

    // Check for auto check-in/out thresholds
    if (
      withinGeofence &&
      timeInsideGeofence >= autoCheckInThreshold &&
      !locationReached
    ) {
      setLocationReached(true)
      geofenceOptions.onAutoCheckIn?.()
      geofenceOptions.enableAutoAttendance?.()
    } else if (
      !withinGeofence &&
      timeOutsideGeofence >= autoCheckOutThreshold &&
      locationReached &&
      !geofenceOptions.isEmergencyMode
    ) {
      setLocationReached(false)
      geofenceOptions.onAutoCheckOut?.()
      geofenceOptions.disableAutoAttendance?.()
    }

    // Handle immediate entry/exit events
    if (withinGeofence !== lastGeofenceState && consecutiveChecks >= 2) {
      const event: GeofenceEvent = {
        type: withinGeofence ? 'entry' : 'exit',
        location: `${geofenceOptions.latitude},${geofenceOptions.longitude}`,
        timestamp: new Date().toISOString(),
      }
      setLastGeofenceState(withinGeofence)

      if (withinGeofence) {
        geofenceOptions.onEntry?.()
      } else {
        geofenceOptions.onExit?.()
      }
    }
  }

  const handleSuccess = (pos: GeolocationPosition) => {
    // Assign browser's native timestamp
    const position = {
      coords: pos.coords,
      timestamp: new Date().getTime(),
    }

    // Only process positions with accuracy <= 20 meters
    if (position.coords.accuracy > 20) {
      return
    }

    // Only calculate distance when tracking is active
    if (!isTracking || !geofenceOptions) {
      return
    }

    // Add to position history and keep last 5 readings
    const newHistory = [...positionHistory, position].slice(-5)
    setPositionHistory(newHistory)

    // Calculate speed and heading if we have at least 2 positions
    if (newHistory.length >= 2) {
      const prev = newHistory[newHistory.length - 2]
      const curr = newHistory[newHistory.length - 1]
      const timeDiff = (curr.timestamp - prev.timestamp) / 1000 // seconds
      const dist = calculateDistance(
        prev.coords.latitude,
        prev.coords.longitude,
        curr.coords.latitude,
        curr.coords.longitude,
      )
      const speed = dist / timeDiff // meters per second
      const heading =
        (Math.atan2(
          curr.coords.longitude - prev.coords.longitude,
          curr.coords.latitude - prev.coords.latitude,
        ) *
          180) /
        Math.PI

      // Track movement patterns in emergency mode
      if (geofenceOptions?.isEmergencyMode) {
        const pattern = { speed, heading, timestamp: new Date().toISOString() }
        setMovementPatterns(prev => [...prev.slice(-20), pattern])

        // Detect unusual patterns
        if (lastSpeed !== null && lastHeading !== null) {
          const speedDiff = Math.abs(speed - lastSpeed)
          const headingDiff = Math.abs(heading - lastHeading)
          if (speedDiff > 10 || headingDiff > 90) {
            // Log unusual movement pattern
            console.warn('Unusual movement detected:', {
              speedDiff,
              headingDiff,
              pattern,
            })
          }
        }
      }

      setLastSpeed(speed)
      setLastHeading(heading)
    }

    // Calculate average position if we have enough readings
    if (newHistory.length === 5) {
      const avgPosition: GeolocationPosition = {
        coords: {
          latitude:
            newHistory.reduce((sum, p) => sum + p.coords.latitude, 0) / 5,
          longitude:
            newHistory.reduce((sum, p) => sum + p.coords.longitude, 0) / 5,
          accuracy:
            newHistory.reduce((sum, p) => sum + p.coords.accuracy, 0) / 5,
        },
        timestamp: position.timestamp,
      }
      debouncedSetPosition(avgPosition)
      setError(null)
      checkGeofence(avgPosition)
    } else {
      debouncedSetPosition(position)
      setError(null)
      checkGeofence(position)
    }

    // Reset retry count on success
    setRetryCount(0)
  }

  const handleError = (err: GeolocationError) => {
    const error = {
      code: err.code,
      message:
        err.code === 1
          ? 'Location access denied. Please enable location services in your browser settings.'
          : err.message,
    }
    setError(error)
    setPosition(null)

    // Implement exponential backoff retry
    const maxRetries = 5
    if (retryCount < maxRetries) {
      const backoffTime = Math.pow(2, retryCount) * 1000 // Exponential backoff in milliseconds
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        getPosition()
      }, backoffTime)
    }
  }

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options,
    )
  }, [options])

  useEffect(() => {
    let watcher: number | null = null
    let intervalId: NodeJS.Timeout | null = null

    if (navigator.geolocation && geofenceOptions) {
      setIsTracking(true)
      watcher = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options,
      )

      // Set interval based on emergency mode
      const intervalTime = geofenceOptions.isEmergencyMode
        ? 30000
        : geofenceOptions?.interval || 60000
      intervalId = setInterval(() => {
        getPosition()
        if (geofenceOptions.isEmergencyMode && position?.coords) {
          setEmergencyLocationHistory(prev => [
            ...prev,
            {
              position: {
                coords: position.coords,
                timestamp: position.timestamp,
              },
              timestamp: new Date().toISOString(),
            },
          ])
        }
      }, intervalTime)
    }

    return () => {
      if (watcher) navigator.geolocation.clearWatch(watcher)
      if (intervalId) clearInterval(intervalId)
    }
  }, [options, geofenceOptions])

  return {
    position,
    error,
    getPosition,
    isWithinGeofence,
    coordinates: position?.coords,
    distance:
      position && geofenceOptions && isTracking
        ? calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            geofenceOptions.latitude,
            geofenceOptions.longitude,
          )
        : undefined,
    accuracy: position?.coords.accuracy,
    locationReached,
    isTracking,
    timeInsideGeofence,
    timeOutsideGeofence,
    emergencyLocation:
      geofenceOptions?.isEmergencyMode && position?.coords
        ? {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          }
        : undefined,
    emergencyLocationHistory,
    movementPatterns,
  }
}
