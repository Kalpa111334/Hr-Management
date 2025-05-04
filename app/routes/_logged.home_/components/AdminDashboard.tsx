import { Card, Col, Row, Skeleton, Statistic, Typography } from 'antd'
import dayjs from 'dayjs'
import { useTeamData } from '../hooks/useTeamData'

const { Title } = Typography

type Props = {
  teamMembers?: {
    id: string
    user: {
      id: string
      name?: string | null
      attendances: {
        id: string
        status: string
        createdAt: Date
      }[]
      leaveRequests: {
        id: string
        status: string
        startDate: string
        endDate: string
      }[]
    }
  }[]
  allTeams?: {
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
}

export const AdminDashboard: React.FC<Props> = ({ teamMembers, allTeams }) => {
  const {
    presentEmployees,
    presentTeams,
    onLeave,
    totalRegistered,
    isLoading,
    error,
  } = useTeamData()

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card>
          <Skeleton active />
        </Card>
      ) : (
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Total Registered"
                value={totalRegistered}
                prefix={<i className="las la-users" />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Present Today" 
                value={presentEmployees}
                prefix={<i className="las la-user-check" />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Total Teams Present"
                value={presentTeams}
                prefix={<i className="las la-layer-group" />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="On Leave"
                value={onLeave}
                prefix={<i className="las la-user-minus" />}
              />
            </Col>
          </Row>
        </Card>
      )}

      {teamMembers && teamMembers.length > 0 && (
        <Card>
          <Title level={4}>
            <i className="las la-users" /> Team Overview
          </Title>
          <Row gutter={[16, 16]}>
            {teamMembers.map(member => (
              <Col key={member.id} xs={24} sm={12} md={8}>
                <Card size="small">
                  <Statistic
                    title={member.user.name}
                    value={
                      member.user.attendances.filter(
                        a =>
                          dayjs(a.createdAt).format('YYYY-MM-DD') ===
                          dayjs().format('YYYY-MM-DD'),
                      ).length > 0
                        ? 'Present'
                        : 'Absent'
                    }
                    valueStyle={{
                      color:
                        member.user.attendances.filter(
                          a =>
                            dayjs(a.createdAt).format('YYYY-MM-DD') ===
                            dayjs().format('YYYY-MM-DD'),
                        ).length > 0
                          ? '#52c41a'
                          : '#ff4d4f',
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  )
}
