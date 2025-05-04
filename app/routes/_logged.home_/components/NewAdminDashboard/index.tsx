import { Api } from '@/core/trpc'
import { notificationService } from '@/services/NotificationService'
import {
    Button,
    Card,
    Col,
    Flex,
    Row,
    Statistic,
    Table,
    Tag,
    Typography,
    message,
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title, Text } = Typography

type Props = {
  allTeams: {
    id: string
    departmentName?: string | null
    teamMembers: {
      id: string
      user: {
        id: string
        name?: string | null
      }
    }[]
  }[]
  teamMembers: any[]
  attendance: any[]
  leaves: any[]
  metrics: {
    weeklyRate: number
  }
}

export const NewAdminDashboard: React.FC<Props> = ({
  allTeams,
  teamMembers,
  attendance,
  leaves,
  metrics,
}) => {
  // Team performance columns
  const columns = [
    {
      title: 'Team',
      dataIndex: 'departmentName',
      key: 'team',
      sorter: (a, b) =>
        (a.departmentName || '').localeCompare(b.departmentName || ''),
    },
    {
      title: 'Members',
      dataIndex: 'teamMembers',
      key: 'members',
      render: members => members?.length || 0,
      sorter: (a, b) =>
        (a.teamMembers?.length || 0) - (b.teamMembers?.length || 0),
    },
    {
      title: 'Attendance Rate',
      key: 'attendance',
      render: (_, record) => {
        const present =
          record.teamMembers?.filter(member =>
            member.user?.attendances?.some(
              a =>
                dayjs(a.createdAt).format('YYYY-MM-DD') ===
                dayjs().format('YYYY-MM-DD'),
            ),
          ).length || 0
        const rate = (
          (present / (record.teamMembers?.length || 1)) *
          100
        ).toFixed(1)
        return `${rate}%`
      },
      sorter: (a, b) => {
        const rateA =
          a.teamMembers?.filter(m => m.user?.attendances?.length > 0).length ||
          0
        const rateB =
          b.teamMembers?.filter(m => m.user?.attendances?.length > 0).length ||
          0
        return rateA - rateB
      },
    },
  ]

  // Handle leave request actions
  const { mutateAsync: updateLeaveRequest } =
    Api.leaveRequest.update.useMutation()

  const handleLeaveAction = async (
    id: string,
    status: 'APPROVED' | 'REJECTED',
    employeeId: string,
    employeeName: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      await updateLeaveRequest({
        where: { id },
        data: { status },
      })

      // Send notification to employee about leave request status
      await notificationService.sendLeaveRequestNotification(
        employeeId,
        employeeName,
        status === 'APPROVED' ? 'Leave Approved' : 'Leave Rejected',
        startDate,
        endDate
      )

      message.success(`Leave request ${status.toLowerCase()} successfully`)
    } catch (error) {
      console.error('Failed to update leave request:', error)
      message.error('Failed to update leave request')
    }
  }

  // Schedule attendance reminders for all employees
  const scheduleAttendanceReminders = async () => {
    const workStartTime = '09:00' // Configure this based on your needs
    
    teamMembers.forEach(member => {
      if (member.user && !member.user.autoAttendanceEnabled) {
        const today = dayjs()
        const reminderTime = today.hour(8).minute(30) // 30 minutes before work starts
        
        if (reminderTime.isAfter(today)) {
          notificationService.scheduleAttendanceReminder(
            member.user.id,
            member.user.name || 'Employee',
            reminderTime.toDate()
          )
        }
      }
    })
  }

  // Call this when component mounts
  React.useEffect(() => {
    scheduleAttendanceReminders()
  }, [teamMembers])

  return (
    <div className="space-y-6">
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title="Total Registered Employees"
              value={teamMembers.length}
              prefix={<i className="las la-users" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title="Accepted Leaves"
              value={leaves.filter(l => l.status === 'APPROVED').length}
              prefix={<i className="las la-calendar-check" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title="Rejected Leaves"
              value={leaves.filter(l => l.status === 'REJECTED').length}
              prefix={<i className="las la-calendar-times" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title="Overall Attendance Rate"
              value={metrics.weeklyRate}
              suffix="%"
              precision={1}
              prefix={<i className="las la-chart-line" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Two Column Layout */}
      <Row gutter={[16, 16]}>
        {/* Left Column - Team Overview */}
        <Col xs={24} lg={12}>
          <Card title="Team Overview" className="h-full">
            <Table
              columns={columns}
              dataSource={allTeams}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              size="small"
            />
          </Card>
        </Col>

        {/* Right Column - Recent Activities */}
        <Col xs={24} lg={12}>
          <Card title="Recent Activities" className="h-full">
            <div className="space-y-4">
              {[...(attendance || []), ...(leaves || [])]
                .sort(
                  (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix(),
                )
                .slice(0, 5)
                .map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <Text strong>{activity.user?.name}</Text>
                      <Text type="secondary" className="ml-2">
                        {'checkInTime' in activity
                          ? `Checked in at ${activity.checkInTime}`
                          : `Requested leave from ${activity.startDate} to ${activity.endDate}`}
                      </Text>
                    </div>
                    <Tag color={'checkInTime' in activity ? 'green' : 'blue'}>
                      {'checkInTime' in activity ? 'Attendance' : 'Leave'}
                    </Tag>
                  </div>
                ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Add a section for pending leave requests with action buttons */}
      <Card title="Pending Leave Requests" className="mt-4">
        <Table
          dataSource={leaves.filter(l => l.status === 'PENDING')}
          columns={[
            {
              title: 'Employee',
              dataIndex: ['user', 'name'],
              key: 'employee',
            },
            {
              title: 'Start Date',
              dataIndex: 'startDate',
              key: 'startDate',
              render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
            },
            {
              title: 'End Date',
              dataIndex: 'endDate',
              key: 'endDate',
              render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Flex gap="small">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() =>
                      handleLeaveAction(
                        record.id,
                        'APPROVED',
                        record.user.id,
                        record.user.name,
                        record.startDate,
                        record.endDate
                      )
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    size="small"
                    onClick={() =>
                      handleLeaveAction(
                        record.id,
                        'REJECTED',
                        record.user.id,
                        record.user.name,
                        record.startDate,
                        record.endDate
                      )
                    }
                  >
                    Reject
                  </Button>
                </Flex>
              ),
            },
          ]}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  )
}
