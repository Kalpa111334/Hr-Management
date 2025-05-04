import { Card, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { MetricsDisplay } from './MetricsDisplay'
const { Title } = Typography

type Props = {
  userAttendance?: {
    id: string
    checkInTime?: string | null
    checkOutTime?: string | null
    status?: string | null
    location?: {
      name?: string | null
    } | null
    createdAt: Date
  }[]
  leaveRequests?: {
    id: string
    startDate?: string | null
    endDate?: string | null
    status?: string | null
    leaveType?: {
      name?: string | null
    } | null
  }[]
  weeklyAttendanceRate: number
  monthlyLeaves: number
  overtimeHours: number
  lateArrivals: number
  teamMembers?: {
    user: {
      attendances: any[]
      leaveRequests: any[]
    }
  }[]
}

export const EmployeeDashboard: React.FC<Props> = ({
  userAttendance,
  leaveRequests,
  weeklyAttendanceRate,
  monthlyLeaves,
  overtimeHours,
  lateArrivals,
  teamMembers,
}) => {
  const attendanceColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: Date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Check In',
      dataIndex: 'checkInTime',
      key: 'checkIn',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOutTime',
      key: 'checkOut',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: { name?: string | null }) => location?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  const leaveColumns = [
    {
      title: 'Type',
      dataIndex: 'leaveType',
      key: 'type',
      render: (leaveType: { name?: string | null }) => leaveType?.name || '-',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  return (
    <div className="space-y-6">
      <MetricsDisplay
        weeklyAttendanceRate={weeklyAttendanceRate}
        monthlyLeaves={monthlyLeaves}
        overtimeHours={overtimeHours}
        lateArrivals={lateArrivals}
      />

      <Card>
        <Title level={4}>
          <i className="las la-history" /> Recent Attendance
        </Title>
        <Table
          dataSource={userAttendance}
          columns={attendanceColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>

      <Card>
        <Title level={4}>
          <i className="las la-calendar-check" /> Upcoming Leaves
        </Title>
        <Table
          dataSource={leaveRequests?.filter(
            lr =>
              lr.status === 'APPROVED' &&
              dayjs(lr.startDate).isAfter(dayjs(), 'day'),
          )}
          columns={leaveColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  )
}
