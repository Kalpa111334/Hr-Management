import { Card, Col, Row, Statistic, Skeleton, Alert } from 'antd'
import React from 'react'

type MetricsDisplayProps = {
  weeklyAttendanceRate: number
  monthlyLeaves: number 
  overtimeHours: number
  lateArrivals: number
  isLoading?: boolean
  error?: string | null
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  weeklyAttendanceRate,
  monthlyLeaves,
  overtimeHours,
  lateArrivals,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    )
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    )
  }

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Statistic
            title="Attendance Rate"
            value={weeklyAttendanceRate}
            suffix="%"
            precision={1}
            prefix={<i className="las la-chart-line" />}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Monthly Leaves"
            value={monthlyLeaves}
            prefix={<i className="las la-calendar-minus" />}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Overtime Hours"
            value={overtimeHours}
            precision={1}
            prefix={<i className="las la-clock" />}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Late Arrivals"
            value={lateArrivals}
            prefix={<i className="las la-user-clock" />}
          />
        </Col>
      </Row>
    </Card>
  )
}
