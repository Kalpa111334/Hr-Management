import { useDesignSystem } from '@/designSystem/provider'
import { Line } from '@ant-design/plots'
import { Card, Col, Row, Statistic, Table, Timeline, Typography } from 'antd'
import dayjs from 'dayjs'
import { useAttendanceData } from '../../hooks/useAttendanceData'
import { useTeamData } from '../../hooks/useTeamData'

const { Title } = Typography

export const AdminDashboard = () => {
  const { isMobile } = useDesignSystem()
  const { attendance, leaves, metrics } = useAttendanceData()
  const { teams, members } = useTeamData()

  const totalEmployees = members?.length || 0
  const attendanceRate = metrics?.weeklyRate || 0
  const pendingLeaves = leaves?.filter(l => l.status === 'PENDING').length || 0
  const overtimeHours =
    attendance?.reduce((acc, curr) => {
      const hours = dayjs(curr.checkOutTime).diff(
        dayjs(curr.checkInTime),
        'hour',
      )
      return acc + (hours > 8 ? hours - 8 : 0)
    }, 0) || 0

  // Calculate today's attendance by department
  const todayAttendanceByDepartment = teams?.reduce((acc, team) => {
    const departmentName = team.departmentName || 'Uncategorized'
    const totalInDepartment = team.teamMembers.length
    const presentToday = team.teamMembers.filter(member => 
      member.user?.attendances?.some(a => 
        dayjs(a.createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') &&
        a.status === 'PRESENT'
      )
    ).length

    acc[departmentName] = {
      total: totalInDepartment,
      present: presentToday
    }
    return acc
  }, {} as Record<string, { total: number; present: number }>)

  const departmentAttendanceColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Present Today',
      dataIndex: 'present',
      key: 'present',
    },
    {
      title: 'Total Officers',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Attendance Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `${rate.toFixed(1)}%`
    },
  ]

  const departmentAttendanceData = Object.entries(todayAttendanceByDepartment || {}).map(
    ([department, stats]) => ({
      department,
      present: stats.present,
      total: stats.total,
      rate: (stats.present / stats.total) * 100
    })
  )

  const recentActivities = [...(attendance || []), ...(leaves || [])]
    .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
    .slice(0, 5)
    .map(activity => ({
      dot:
        activity.status === 'CHECKED_IN' ? (
          <i className="las la-sign-in-alt" />
        ) : (
          <i className="las la-calendar" />
        ),
      children: (
        <p>
          {activity.user?.name} {activity.status?.toLowerCase()} at{' '}
          {dayjs(activity.createdAt).format('HH:mm')}
        </p>
      ),
    }))

  const attendanceColumns = [
    { title: 'Employee', dataIndex: ['user', 'name'], key: 'name' },
    { title: 'Check In', dataIndex: 'checkInTime', key: 'checkIn' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Location', dataIndex: ['location', 'name'], key: 'location' },
  ]

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Employees"
              value={totalEmployees}
              prefix={<i className="las la-users" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Attendance Rate"
              value={attendanceRate}
              precision={1}
              suffix="%"
              prefix={<i className="las la-chart-line" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Pending Leaves"
              value={pendingLeaves}
              prefix={<i className="las la-calendar-check" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Overtime Hours"
              value={overtimeHours}
              suffix="hrs"
              prefix={<i className="las la-clock" />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mb-6">
        <Title level={4}>
          <i className="las la-building" /> Today's Attendance by Department
        </Title>
        <Table
          columns={departmentAttendanceColumns}
          dataSource={departmentAttendanceData}
          pagination={false}
          scroll={{ x: isMobile ? 500 : undefined }}
        />
      </Card>

      <Card className="mb-6">
        <Title level={4}>
          <i className="las la-clipboard-list" /> Today's Attendance
        </Title>
        <Table
          columns={attendanceColumns}
          dataSource={attendance?.filter(
            a =>
              dayjs(a.createdAt).format('YYYY-MM-DD') ===
              dayjs().format('YYYY-MM-DD'),
          )}
          pagination={{ pageSize: 5 }}
          scroll={{ x: isMobile ? 500 : undefined }}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>
              <i className="las la-chart-bar" /> Department Performance
            </Title>
            <Line
              data={
                teams?.map(team => ({
                  department: team.departmentName,
                  rate:
                    (team.teamMembers.filter(
                      member =>
                        member.user?.attendances?.filter(
                          a =>
                            a &&
                            dayjs(a.createdAt).format('YYYY-MM-DD') ===
                              dayjs().format('YYYY-MM-DD'),
                        )?.length > 0,
                    ).length /
                      (team.teamMembers?.length || 1)) *
                    100,
                })) || []
              }
              xField="department"
              yField="rate"
              point={{
                size: 5,
                shape: 'diamond',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>
              <i className="las la-history" /> Recent Activities
            </Title>
            <Timeline items={recentActivities} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
