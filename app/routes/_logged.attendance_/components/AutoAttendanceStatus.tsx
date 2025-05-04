import { useState, useEffect } from 'react'
import { Map } from '@/components/Map'
import {
  Alert,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import type {
  AutoAttendanceStatus as AutoAttendanceStatusType,
  GeofenceEvent,
  GeolocationError,
} from '../types'

const { Text } = Typography

type Props = Omit<
  AutoAttendanceStatusType,
  'isWithinGeofence' | 'distanceFromOffice'
> & {
  isWithinGeofence?: boolean
  distanceFromOffice?: number
  locationError?: GeolocationError
  accuracy?: number
  geofenceEvents?: GeofenceEvent[]
  isEmergencyMode?: boolean
  emergencyLocation?: {
    latitude: number
    longitude: number
    timestamp: string
  }
  emergencyStartTime?: string
  emergencyLocationHistory?: Array<{
    position: {
      coords: {
        latitude: number
        longitude: number
      }
      timestamp: number
    }
    timestamp: string
  }>
  emergencyContacts?: Array<{
    name: string
    phone: string
  }>
}

export function AutoAttendanceStatus({
  enabled: isAutoEnabled,
  autoStatus,
  lastCheckIn,
  lastCheckOut,
  isWithinGeofence,
  distanceFromOffice,
  locationError,
  accuracy,
  geofenceEvents,
  isEmergencyMode,
  emergencyLocation,
  emergencyStartTime,
  emergencyLocationHistory,
  emergencyContacts,
}: Props) {
  const [remainingTime, setRemainingTime] = useState<string>('')

  useEffect(() => {
    if (emergencyStartTime && isEmergencyMode) {
      const timer = setInterval(() => {
        const end = dayjs(emergencyStartTime).add(4, 'hours')
        const remaining = end.diff(dayjs(), 'minute')
        if (remaining <= 0) {
          setRemainingTime('Expired')
        } else {
          const hours = Math.floor(remaining / 60)
          const minutes = remaining % 60
          setRemainingTime(`${hours}h ${minutes}m remaining`)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [emergencyStartTime, isEmergencyMode])
  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'gray'
    if (accuracy <= 10) return '#52c41a'
    if (accuracy <= 20) return '#faad14'
    return '#f5222d'
  }
  return (
    <Card
      title={
        <Text strong style={{ fontSize: '18px' }}>
          Auto-Attendance Status
        </Text>
      }
      className="w-full"
    >
      {locationError && (
        <Alert
          message={locationError.message}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      {autoStatus && !locationError && (
        <Alert
          message={`Auto attendance ${autoStatus.toLowerCase()} successfully`}
          type="success"
          showIcon
          className="mb-4"
        />
      )}

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card size="small">
            <Text strong>Status: </Text>
            <Tooltip
              title={
                isAutoEnabled
                  ? 'Auto attendance is active'
                  : 'Auto attendance is inactive'
              }
            >
              <Tag color={isAutoEnabled ? 'green' : 'red'}>
                {isAutoEnabled ? 'Enabled' : 'Disabled'}
              </Tag>
            </Tooltip>
            {autoStatus && (
              <Tooltip title={`Currently ${autoStatus.toLowerCase()}`}>
                <Tag
                  color={autoStatus === 'CHECKED_IN' ? 'green' : 'blue'}
                  className="ml-2"
                >
                  {autoStatus}
                </Tag>
              </Tooltip>
            )}
            {typeof isWithinGeofence !== 'undefined' && (
              <Tooltip
                title={`You are ${
                  isWithinGeofence ? 'inside' : 'outside'
                } the office geofence`}
              >
                <Tag
                  color={isWithinGeofence ? 'green' : 'orange'}
                  className="ml-2"
                >
                  {isWithinGeofence ? 'Inside Office' : 'Outside Office'}
                </Tag>
              </Tooltip>
            )}
            {typeof distanceFromOffice !== 'undefined' && (
              <Text className="ml-2" strong>
                Distance:{' '}
                <Text type={distanceFromOffice > 100 ? 'danger' : 'success'}>
                  {Math.round(distanceFromOffice)}m
                </Text>
              </Text>
            )}
            {isEmergencyMode && (
              <Tooltip title="Emergency Protocol Active">
                <Tag
                  color="red"
                  icon={<i className="las la-exclamation-triangle" />}
                  className="ml-2 animate-pulse"
                >
                  EMERGENCY MODE {remainingTime && `(${remainingTime})`}
                </Tag>
              </Tooltip>
            )}
            {accuracy && (
              <>
                <br />
                <Text className="mt-2" strong>
                  GPS Accuracy:{' '}
                </Text>
                <Tooltip
                  title={
                    accuracy > 20
                      ? 'Poor GPS accuracy may affect location tracking'
                      : 'GPS accuracy is good'
                  }
                >
                  <Progress
                    percent={Math.min(100, accuracy / 0.2)}
                    steps={5}
                    size="small"
                    strokeColor={getAccuracyColor(accuracy)}
                    format={() => `${Math.round(accuracy)}m`}
                    className="ml-2 inline-block w-24"
                  />
                </Tooltip>
                {accuracy > 20 && (
                  <Alert
                    message="Poor GPS Signal"
                    description="Please move to an open area for better accuracy"
                    type="warning"
                    showIcon
                    className="mt-2"
                  />
                )}
              </>
            )}
          </Card>
        </Col>

        {geofenceEvents && geofenceEvents.length > 0 && (
          <Col span={24}>
            <Card
              size="small"
              title={<Text strong>Recent Geofence Events</Text>}
            >
              {geofenceEvents.slice(-3).map((event, index) => (
                <div key={index} className="mb-2">
                  <Tag color={event.type === 'entry' ? 'green' : 'orange'}>
                    {event.type === 'entry' ? 'Entered' : 'Exited'}
                  </Tag>
                  <Text className="ml-2">
                    {dayjs(event.timestamp).format('HH:mm, DD MMM')}
                  </Text>
                </div>
              ))}
            </Card>
          </Col>
        )}

        {lastCheckIn && (
          <Col span={12}>
            <Card size="small" title={<Text strong>Last Auto Check-in</Text>}>
              <Text type="secondary">Time: </Text>
              <Text className="text-green-500">
                {dayjs(lastCheckIn.time).format('HH:mm, DD MMM YYYY')}
              </Text>
              <br />
              <Text type="secondary">Location: </Text>
              <Text>{lastCheckIn.location}</Text>
            </Card>
          </Col>
        )}

        {lastCheckOut && (
          <Col span={12}>
            <Card size="small" title={<Text strong>Last Auto Check-out</Text>}>
              <Text type="secondary">Time: </Text>
              <Text className="text-blue-500">
                {dayjs(lastCheckOut.time).format('HH:mm, DD MMM YYYY')}
              </Text>
              <br />
              <Text type="secondary">Location: </Text>
              <Text>{lastCheckOut.location}</Text>
            </Card>
          </Col>
        )}
        {isEmergencyMode && (
          <>
            <Col span={24}>
              <Card
                size="small"
                title={
                  <Text strong type="danger">
                    Emergency Status
                  </Text>
                }
              >
                <Alert
                  message="Emergency Protocol Active"
                  description={
                    <>
                      <Space direction="vertical" className="w-full">
                        <Text>Protocol Instructions:</Text>
                        <ol className="ml-4">
                          <li>Stay calm and assess the situation</li>
                          <li>Contact emergency services if needed</li>
                          <li>Follow building evacuation procedures</li>
                          <li>Report to designated assembly point</li>
                          <li>Wait for further instructions</li>
                        </ol>
                        {emergencyStartTime && (
                          <Text>
                            Activated:{' '}
                            {dayjs(emergencyStartTime).format(
                              'HH:mm, DD MMM YYYY',
                            )}
                            {remainingTime && ` (${remainingTime})`}
                          </Text>
                        )}
                      </Space>
                    </>
                  }
                  type="error"
                  showIcon
                />
              </Card>
            </Col>

            {emergencyContacts && (
              <Col span={24}>
                <Card
                  size="small"
                  title={
                    <Text strong type="danger">
                      Emergency Contacts
                    </Text>
                  }
                >
                  <Space wrap>
                    {emergencyContacts.map((contact, index) => (
                      <Button
                        key={index}
                        type="primary"
                        danger
                        icon={<i className="las la-phone" />}
                        onClick={() =>
                          (window.location.href = `tel:${contact.phone}`)
                        }
                      >
                        {contact.name}
                      </Button>
                    ))}
                  </Space>
                </Card>
              </Col>
            )}

            {emergencyLocation && (
              <Col span={24}>
                <Card
                  size="small"
                  title={
                    <Text strong type="danger">
                      Current Emergency Location
                    </Text>
                  }
                >
                  <Map
                    center={[
                      emergencyLocation.latitude,
                      emergencyLocation.longitude,
                    ]}
                    markers={[
                      {
                        position: [
                          emergencyLocation.latitude,
                          emergencyLocation.longitude,
                        ],
                        title: 'Current Location',
                      },
                    ]}
                    zoom={15}
                  />
                  <Text className="mt-2 block">
                    Last Updated:{' '}
                    {dayjs(emergencyLocation.timestamp).format(
                      'HH:mm, DD MMM YYYY',
                    )}
                  </Text>
                </Card>
              </Col>
            )}

            {emergencyLocationHistory &&
              emergencyLocationHistory.length > 0 && (
                <Col span={24}>
                  <Card
                    size="small"
                    title={
                      <Text strong type="danger">
                        Location History
                      </Text>
                    }
                  >
                    <Map
                      center={[
                        emergencyLocationHistory[0].position.coords.latitude,
                        emergencyLocationHistory[0].position.coords.longitude,
                      ]}
                      markers={emergencyLocationHistory.map(loc => ({
                        position: [
                          loc.position.coords.latitude,
                          loc.position.coords.longitude,
                        ],
                        title: dayjs(loc.timestamp).format('HH:mm, DD MMM'),
                      }))}
                      zoom={15}
                      showPath
                    />
                  </Card>
                </Col>
              )}
          </>
        )}
      </Row>
    </Card>
  )
}
