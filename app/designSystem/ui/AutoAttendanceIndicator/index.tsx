import { Badge, Progress, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'

export interface AutoAttendanceIndicatorProps {
  isAutoEnabled: boolean
  autoStatus: 'CHECKED_IN' | 'CHECKED_OUT' | 'ENTERING' | 'EXITING' | null
  showLabel?: boolean
  distance?: number
  accuracy?: number
  checkInTime?: string
  boundaryThreshold?: number
  autoCheckOutEnabled?: boolean
  isTracking?: boolean
  autoCheckInProgress?: number
  autoCheckOutProgress?: number
}

export const AutoAttendanceIndicator: React.FC<
  AutoAttendanceIndicatorProps
> = ({
  isAutoEnabled,
  autoStatus,
  showLabel = true,
  distance,
  accuracy,
  checkInTime,
  boundaryThreshold = 10,
  autoCheckOutEnabled,
  isTracking,
  autoCheckInProgress,
  autoCheckOutProgress,
}) => {
  const [timeSpent, setTimeSpent] = useState<string>('0:00')
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (checkInTime && autoStatus === 'CHECKED_IN') {
      interval = setInterval(() => {
        const start = new Date(checkInTime).getTime()
        const now = new Date().getTime()
        const diff = Math.floor((now - start) / 1000)
        const minutes = Math.floor(diff / 60)
        const seconds = diff % 60
        setTimeSpent(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [checkInTime, autoStatus])

  useEffect(() => {
    if (distance && boundaryThreshold && distance > boundaryThreshold) {
      setCountdown(Math.max(0, Math.round(boundaryThreshold - distance)))
    }
  }, [distance, boundaryThreshold])

  const getStatusColor = () => {
    if (!isAutoEnabled) return 'default'
    if (autoStatus === 'CHECKED_IN') return 'success'
    if (autoStatus === 'CHECKED_OUT') return 'warning'
    if (autoStatus === 'ENTERING') return 'processing'
    if (autoStatus === 'EXITING') return 'error'
    return 'processing'
  }

  const getDistanceColor = (distance?: number) => {
    if (!distance) return 'default'
    if (distance <= 50) return 'success'
    if (distance <= 100) return 'warning'
    return 'error'
  }

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'default'
    if (accuracy <= 10) return 'success'
    if (accuracy <= 20) return 'warning'
    return 'error'
  }

  const getTooltipText = () => {
    let text = ''
    if (!isAutoEnabled) text = 'Auto attendance is disabled'
    else if (autoStatus === 'CHECKED_IN')
      text = `✅ Auto checked in\nTime spent: ${timeSpent}`
    else if (autoStatus === 'CHECKED_OUT') text = '🔴 Auto checked out'
    else if (autoStatus === 'ENTERING')
      text = `🟡 Validating check-in...\nAuto check-in in ${Math.round(
        (1 - (autoCheckInProgress || 0)) * boundaryThreshold,
      )}s`
    else if (autoStatus === 'EXITING')
      text = `🟡 Validating check-out...\nAuto check-out in ${Math.round(
        (1 - (autoCheckOutProgress || 0)) * boundaryThreshold,
      )}s`
    else
      text = isTracking ? '🔄 Tracking location...' : 'Auto attendance enabled'

    if (distance && isTracking)
      text += `\n📍 Distance from office: ${Math.round(distance)}m`
    if (accuracy) text += `\n📡 GPS Accuracy: ±${Math.round(accuracy)}m`

    return text
  }

  return (
    <Tooltip title={getTooltipText()}>
      <span className="inline-flex items-center gap-2">
        <Badge
          status={getStatusColor()}
          className={`${isAutoEnabled ? 'animate-pulse' : ''} ${
            isTracking ? 'animate-ping' : ''
          }`}
        />
        {showLabel && (
          <>
            <Tag color={getStatusColor()} className="min-w-[100px] text-center">
              {autoStatus || (isAutoEnabled ? 'Auto Enabled' : 'Auto Disabled')}
              {timeSpent && autoStatus === 'CHECKED_IN' && ` (${timeSpent})`}
            </Tag>
            {distance && isTracking && (
              <Tag
                color={getDistanceColor(distance)}
                icon={<i className="las la-map-marker" />}
              >
                {Math.round(distance)}m
              </Tag>
            )}
            {accuracy && (
              <div className="inline-flex items-center gap-1">
                <Progress
                  type="circle"
                  percent={Math.min(100, (20 - accuracy) * 5)}
                  width={24}
                  format={() => ''}
                  status={getAccuracyColor(accuracy) as 'success' | 'exception'}
                />
                <span className="text-xs">±{Math.round(accuracy)}m</span>
              </div>
            )}
            {autoStatus === 'ENTERING' && autoCheckInProgress !== undefined && (
              <Progress
                type="circle"
                percent={Math.round(autoCheckInProgress * 100)}
                width={24}
                format={() => ''}
                status="active"
              />
            )}
            {autoStatus === 'EXITING' && autoCheckOutProgress !== undefined && (
              <Progress
                type="circle"
                percent={Math.round(autoCheckOutProgress * 100)}
                width={24}
                format={() => ''}
                status="active"
              />
            )}
          </>
        )}
      </span>
    </Tooltip>
  )
}
