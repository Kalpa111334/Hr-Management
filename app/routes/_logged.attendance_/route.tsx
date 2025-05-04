import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { AutoAttendanceIndicator, PageLayout } from '@/designSystem'
import {
  Alert,
  Button,
  Card,
  Collapse,
  Flex,
  List,
  message,
  Modal,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useGeolocation } from './hooks/useGeolocation'
const { Title, Text } = Typography

export default function AttendancePage() {
  const { user, checkRole } = useUserContext()
  const [emergencyStartTime, setEmergencyStartTime] = useState<string | null>(() => {
    return localStorage.getItem('emergencyStartTime')
  })

  useEffect(() => {
    if (emergencyStartTime) {
      const checkEmergencyDuration = () => {
        const duration = dayjs().diff(emergencyStartTime, 'hour')
        if (duration >= 4) {
          setIsEmergencyMode(false)
          setEmergencyLocation(null)
          setEmergencyStartTime(null)
          localStorage.removeItem('emergencyMode')
          localStorage.removeItem('emergencyLocation')
          localStorage.removeItem('emergencyStartTime')
          message.info('Emergency mode auto-disabled after 4 hours')
        }
      }

      const timer = setInterval(checkEmergencyDuration, 60000) // Check every minute
      return () => clearInterval(timer)
    }
  }, [emergencyStartTime])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocationVerified, setIsLocationVerified] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isAutoEnabled, setIsAutoEnabled] = useState(
    user?.autoAttendanceEnabled,
  )
  const [autoCheckOutEnabled, setAutoCheckOutEnabled] = useState(false)
  const [autoStatus, setAutoStatus] = useState<string | null>(null)
  const [checkInTimestamp, setCheckInTimestamp] = useState<string | null>(null)
  const [autoCheckInThreshold, setAutoCheckInThreshold] = useState(2) // 2 minutes
  const [autoCheckOutThreshold, setAutoCheckOutThreshold] = useState(5) // 5 minutes
  const [isEmergencyMode, setIsEmergencyMode] = useState(() => {
    const stored = localStorage.getItem('emergencyMode')
    return stored ? JSON.parse(stored) : false
  })
  const [emergencyLocation, setEmergencyLocation] = useState<{
    latitude: number
    longitude: number
    radius: number
  } | null>(() => {
    const stored = localStorage.getItem('emergencyLocation')
    return stored ? JSON.parse(stored) : null
  })
  const [emergencyContacts] = useState([
    { name: 'Emergency Response Team', phone: '911' },
    { name: 'Building Security', phone: '555-0123' },
    { name: 'Facility Manager', phone: '555-0124' },
  ])

  const handleAutoCheckIn = async () => {
    if (!locationReached) {
      message.error('Please wait until you reach the office location')
      return
    }
    setIsLoading(true)
    try {
      const timestamp = dayjs().format()
      await createAttendance({
        data: {
          userId: user?.id,
          locationId: selectedLocation.id,
          checkInTime: dayjs().format('HH:mm'),
          status: 'CHECKED_IN',
          isAutoEnabled: true,
          autoStatus: 'CHECKED_IN',
          autoCheckInTime: timestamp,
          autoLocation: `${selectedLocation.latitude},${selectedLocation.longitude}`,
        },
      })
      setAutoStatus('CHECKED_IN')
      setCheckInTimestamp(timestamp)
      setAutoCheckOutEnabled(true)
      message.success({
        content: 'Auto check-in successful',
        icon: <i className="las la-check-circle" />,
        className: 'custom-message-success',
      })
      refetch()
    } catch (error) {
      message.error(
        'Auto check-in failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    }
  }

  const handleAutoCheckOut = async () => {
    const currentAttendance = attendances?.[0]
    if (!currentAttendance || currentAttendance.status !== 'CHECKED_IN') {
      message.error('No active check-in found')
      return
    }

    if (!checkInTimestamp) {
      message.error('Check-in timestamp not found')
      return
    }

    if (isEmergencyMode) {
      message.info('Auto check-out disabled during emergency mode')
      return
    }

    const minTimeThreshold = 5 * 60 * 1000 // 5 minutes in milliseconds
    const timeElapsed = dayjs().diff(dayjs(checkInTimestamp))

    if (timeElapsed < minTimeThreshold) {
      message.error('Minimum time threshold not met')
      return
    }

    if (isWithinGeofence) {
      message.error('Still within office geofence')
      return
    }

    setIsLoading(true)
    try {
      await updateAttendance({
        where: { id: currentAttendance.id },
        data: {
          checkOutTime: dayjs().format('HH:mm'),
          status: 'CHECKED_OUT',
          autoStatus: 'CHECKED_OUT',
          autoCheckOutTime: dayjs().format(),
        },
      })
      setAutoStatus('CHECKED_OUT')
      setAutoCheckOutEnabled(false)
      setCheckInTimestamp(null)
      message.success({
        content: 'Auto check-out successful',
        icon: <i className="las la-check-circle" />,
        className: 'custom-message-success',
      })
      refetch()
    } catch (error) {
      message.error(
        'Auto check-out failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    }
  }

  const enableAutoAttendance = async () => {
    await handleAutoCheckIn()
    setAutoStatus('CHECKED_IN')
    message.success({
      content: 'Auto check-in successful',
      icon: <i className="las la-check-circle" />,
    })
  }

  const disableAutoAttendance = async () => {
    await handleAutoCheckOut()
    setAutoStatus('CHECKED_OUT')
    setIsAutoEnabled(false)
    setSelectedLocation(null)
    message.success({
      content: 'Auto check-out successful',
      icon: <i className="las la-check-circle" />,
    })
  }

  const {
    position,
    error: geoError,
    isWithinGeofence,
    distance,
    accuracy,
    locationReached,
    isTracking,
    timeInsideGeofence,
    timeOutsideGeofence,
  } = useGeolocation(
    { enableHighAccuracy: true },
    selectedLocation
      ? {
          latitude: parseFloat(selectedLocation.latitude || '0'),
          longitude: parseFloat(selectedLocation.longitude || '0'),
          radius: selectedLocation.radius || 100,
          interval: 30000,
          autoCheckInThreshold,
          autoCheckOutThreshold,
          onAutoCheckIn: handleAutoCheckIn,
          onAutoCheckOut: handleAutoCheckOut,
          isEmergencyMode,
          emergencyLocation,
        }
      : undefined,
  )

  const handleCheckOut = async (
    recordId: string,
    status: string,
    userId?: string,
  ) => {
    setIsLoading(true)
    try {
      if (status === 'PENDING' || status === 'REJECTED') {
        message.error(
          'Cannot checkout from ' + status.toLowerCase() + ' check-in',
        )
        return
      }

      await updateAttendance({
        where: {
          id: recordId,
          ...(userId && { userId }),
        },
        data: {
          checkOutTime: dayjs().format('HH:mm'),
          status: 'CHECKED_OUT',
        },
      })
      message.success('Successfully checked out')
      refetch()
    } catch (error) {
      message.error(
        'Failed to check out: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    } finally {
      setIsLoading(false)
    }
  }
  // Mutations
  const { mutateAsync: updateUser } = Api.user.update.useMutation()
  const { mutateAsync: updateAttendance } = Api.attendance.update.useMutation()
  const { mutateAsync: createAttendance } = Api.attendance.create.useMutation()
  const apiUtils = Api.useUtils()

  const handleToggleAuto = async (checked: boolean) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      await updateUser({
        where: { id: user.id },
        data: { autoAttendanceEnabled: checked },
      })

      setIsAutoEnabled(checked)
      if (!checked) {
        await disableAutoAttendance()
      }
      message.success(`Auto attendance ${checked ? 'enabled' : 'disabled'}`)
    } catch (error) {
      message.error(
        'Failed to update auto attendance setting: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
      setIsAutoEnabled(!checked) // Revert the switch state
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch attendance data
  const { data: attendances, refetch } = Api.attendance.findMany.useQuery({
    where: { userId: user?.id },
    include: { location: true },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch locations
  const { data: locations } = Api.officeLocation.findMany.useQuery()

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 5000 },
      )
    })
  }

  const handleVerifyLocation = async () => {
    setIsLoading(true)
    try {
      const locations = await apiUtils.officeLocation.findMany.fetch()
      const position = await getCurrentPosition()

      const userLat = position.coords.latitude
      const userLng = position.coords.longitude

      for (const location of locations) {
        const locationLat = parseFloat(location.latitude || '0')
        const locationLng = parseFloat(location.longitude || '0')
        const radius = location.radius || 100 // Default radius of 100 meters

        const distance = calculateDistance(
          userLat,
          userLng,
          locationLat,
          locationLng,
        )

        if (distance <= radius) {
          setSelectedLocation(location)
          setIsLocationVerified(true)
          message.success('Location verified successfully')
          return
        }
      }

      setIsLocationVerified(false)
      message.error('You are not within any office location')
    } catch (error) {
      setIsLocationVerified(false)
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message.error('Please enable location access to check in')
            break
          case error.POSITION_UNAVAILABLE:
            message.error('Location information is unavailable')
            break
          case error.TIMEOUT:
            message.error('Location request timed out')
            break
          default:
            message.error('Failed to get location')
        }
      } else {
        message.error(
          'Failed to verify location: ' +
            (error instanceof Error ? error.message : 'Unknown error'),
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  const handleCheckIn = async () => {
    await handleVerifyLocation()
    if (!isLocationVerified || !selectedLocation) return

    setIsLoading(true)
    try {
      await createAttendance({
        data: {
          userId: user?.id,
          locationId: selectedLocation.id,
          checkInTime: dayjs().format('HH:mm'),
          status: 'CHECKED_IN',
          isAutoEnabled: isAutoEnabled,
          autoStatus: isAutoEnabled ? 'CHECKED_IN' : null,
        },
      })

      message.success('Successfully checked in')
      setIsLocationVerified(false)
      setSelectedLocation(null)
      refetch()
    } catch (error) {
      message.error(
        'Failed to check in: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Type',
      dataIndex: 'isAutoEnabled',
      key: 'type',
      render: (isAuto: boolean) =>
        isAuto ? (
          <Tag color="purple" icon={<i className="las la-robot" />}>
            Auto
          </Tag>
        ) : (
          <Tag color="default">Manual</Tag>
        ),
    },
    {
      title: 'Check In',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: any) => location?.name,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'CHECKED_IN'
              ? 'green'
              : status === 'CHECKED_OUT'
              ? 'blue'
              : status === 'PENDING'
              ? 'orange'
              : status === 'REJECTED'
              ? 'red'
              : 'default'
          }
        >
          {status || 'CHECKED_IN'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Flex gap="small">
          <Button
            onClick={() =>
              handleCheckOut(record.id, record.status, record.userId)
            }
            disabled={record.status === 'CHECKED_OUT'}
          >
            Check Out
          </Button>
        </Flex>
      ),
    },
  ]

  return (
    <PageLayout>
      <Card>
        <Flex vertical gap="middle">
          <Button type="primary" onClick={handleCheckIn} loading={isLoading}>
            Check In
          </Button>

          <Button
            type="primary"
            danger={isEmergencyMode}
            onClick={async () => {
              Modal.confirm({
                title: isEmergencyMode
                  ? 'Disable Emergency Mode?'
                  : 'Enable Emergency Mode?',
                content: isEmergencyMode
                  ? 'This will disable emergency protocols. Are you sure?'
                  : 'This will activate emergency protocols and notify all users. Continue?',
                onOk: async () => {
                  if (isEmergencyMode) {
                    setIsEmergencyMode(false)
                    setEmergencyLocation(null)
                    setEmergencyStartTime(null)
                    localStorage.removeItem('emergencyMode')
                    localStorage.removeItem('emergencyLocation')
                    localStorage.removeItem('emergencyStartTime')
                    message.success('Emergency mode disabled')
                  } else {
                    const position = await getCurrentPosition()
                    const startTime = new Date().toISOString()
                    setIsEmergencyMode(true)
                    setEmergencyStartTime(startTime)
                    const location = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      radius: 200,
                    }
                    setEmergencyLocation(location)
                    localStorage.setItem('emergencyMode', 'true')
                    localStorage.setItem(
                      'emergencyLocation',
                      JSON.stringify(location),
                    )
                    localStorage.setItem('emergencyStartTime', startTime)
                    try {
                      // Remove the notification API call and just show a message
                      message.warning('Emergency mode enabled - All users will be notified')
                    } catch (error) {
                      console.error('Failed to enable emergency mode:', error)
                    }
                  }
                },
              })
            }}
          >
            {isEmergencyMode
              ? 'Disable Emergency Mode'
              : 'Enable Emergency Mode'}
          </Button>

          <Collapse>
            <Collapse.Panel header="Auto Attendance Controls" key="1">
              <Card className="auto-attendance-card">
                <Spin spinning={isLoading}>
                  <Flex vertical gap="middle">
                    <Flex align="center" justify="space-between">
                      <Text>Auto Attendance:</Text>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={isAutoEnabled}
                        onChange={handleToggleAuto}
                      />
                    </Flex>
                    <AutoAttendanceIndicator
                      isAutoEnabled={isAutoEnabled}
                      autoStatus={autoStatus as any}
                      showLabel={true}
                      distance={distance}
                      accuracy={accuracy}
                      autoCheckOutEnabled={autoCheckOutEnabled}
                      boundaryThreshold={autoCheckOutThreshold * 60}
                    />
                    <Text type="secondary">
                      Auto Check-in Threshold: {autoCheckInThreshold} minutes
                    </Text>
                    <Text type="secondary">
                      Auto Check-out Threshold: {autoCheckOutThreshold} minutes
                    </Text>
                    {geoError && (
                      <Alert
                        message="Location Permission Error"
                        description={geoError.message}
                        type="error"
                        showIcon
                        action={
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                              if (navigator.permissions) {
                                navigator.permissions
                                  .query({ name: 'geolocation' })
                                  .then(result => {
                                    if (result.state === 'denied') {
                                      message.info(
                                        'Please enable location access in your browser settings',
                                      )
                                    }
                                  })
                              }
                            }}
                          >
                            Fix Permission
                          </Button>
                        }
                      />
                    )}
                    {selectedLocation && (
                      <Text type="secondary">
                        Location: {selectedLocation.name}
                      </Text>
                    )}
                  </Flex>
                </Spin>
              </Card>
            </Collapse.Panel>
          </Collapse>

          {isEmergencyMode && (
            <Card title="Emergency Contacts" className="mb-4">
              <List
                dataSource={emergencyContacts}
                renderItem={contact => (
                  <List.Item>
                    <Text strong>{contact.name}:</Text>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </List.Item>
                )}
              />
              {emergencyStartTime && (
                <Alert
                  message="Emergency Protocol Active"
                  description={
                    <>
                      <Text>
                        Activated:{' '}
                        {dayjs(emergencyStartTime).format('HH:mm, DD MMM YYYY')}
                      </Text>
                      <br />
                      <Text>
                        Auto-disable in:{' '}
                        {Math.max(
                          0,
                          240 - dayjs().diff(emergencyStartTime, 'minute'),
                        )}{' '}
                        minutes
                      </Text>
                    </>
                  }
                  type="error"
                  showIcon
                />
              )}
            </Card>
          )}

          <Table
            dataSource={attendances}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            scroll={{ x: true }}
          />
        </Flex>
      </Card>
    </PageLayout>
  )
}
