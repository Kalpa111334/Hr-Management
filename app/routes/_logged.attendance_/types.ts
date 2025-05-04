export interface EmergencyProtocol {
  isActive: boolean
  activatedAt: string
  activatedBy: string
  location: {
    latitude: number
    longitude: number
    radius: number
  }
}

export interface GeolocationPosition {
  coords: {
    latitude: number
    longitude: number
    accuracy: number
  }
  timestamp: number
}

export interface GeolocationError {
  code: number
  message: string
}

export interface LocationVerification {
  locationId: string
  verified: boolean
}

export interface LocationVerificationResponse {
  verified: boolean
  message?: string
}

export interface AutoAttendanceStatus {
  enabled: boolean
  autoStatus?: 'CHECKED_IN' | 'CHECKED_OUT'
  lastCheckIn?: {
    time: string
    location: string
  }
  lastCheckOut?: {
    time: string
    location: string
  }
  isWithinGeofence?: boolean
  distanceFromOffice?: number
  emergencyProtocol?: EmergencyProtocol
}

export interface GeofenceEvent {
  type: 'entry' | 'exit'
  location: string
  timestamp: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  locationId: string
  status: 'CHECKED_IN' | 'CHECKED_OUT'
  autoAttendance?: AutoAttendanceStatus
  geofenceEvents?: GeofenceEvent[]
}
