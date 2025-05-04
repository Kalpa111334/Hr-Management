import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import type { Team, User, WorkShift } from '@prisma/client'
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useLocation, Navigate } from '@remix-run/react'
const { Title, Text } = Typography

export default function TeamManagementPage() {
  const { user, checkRole, checkPageAccess } = useUserContext()
  const { pathname } = useLocation()
  const isAdmin = checkRole('ADMIN')
  const [teamModal, setTeamModal] = useState(false)
  const [shiftModal, setShiftModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  if (!checkPageAccess(pathname)) {
    return <Navigate to="/home" replace />
  }

  // Queries
  const { data: teams, refetch: refetchTeams } = Api.team.findMany.useQuery({
    include: {
      manager: true,
      shift: true,
      teamMembers: {
        include: {
          user: true,
        },
      },
    },
  })

  const { data: users } = Api.user.findMany.useQuery({})
  const { data: shifts } = Api.workShift.findMany.useQuery({})

  // Mutations
  const { mutateAsync: createTeam } = Api.team.create.useMutation()
  const { mutateAsync: updateTeam } = Api.team.update.useMutation()
  const { mutateAsync: createShift } = Api.workShift.create.useMutation()
  const { mutateAsync: createTeamMember } = Api.teamMember.create.useMutation()
  const { mutateAsync: deleteTeam } = Api.team.delete.useMutation()

  const handleCreateTeam = async (values: any) => {
    await createTeam({
      data: {
        departmentName: values.departmentName,
        managerId: values.managerId,
        shiftId: values.shiftId,
      },
    })
    setTeamModal(false)
    refetchTeams()
  }

  const handleCreateShift = async (values: any) => {
    await createShift({
      data: {
        name: values.name,
        startTime: values.startTime,
        endTime: values.endTime,
        breakDuration: parseFloat(values.breakDuration),
        overtimeThreshold: parseFloat(values.overtimeThreshold),
      },
    })
    setShiftModal(false)
    refetchTeams()
  }

  const handleAssignEmployee = async (teamId: string, userId: string) => {
    await createTeamMember({
      data: {
        teamId,
        userId,
      },
    })
    refetchTeams()
  }

  const handleDeleteTeam = async (teamId: string) => {
    await deleteTeam({ where: { id: teamId } })
    refetchTeams()
  }

  const columns = [
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager: User) => manager?.name || 'Not Assigned',
    },
    {
      title: 'Work Shift',
      dataIndex: 'shift',
      key: 'shift',
      render: (shift: WorkShift) => shift?.name || 'Not Assigned',
    },
    {
      title: 'Team Members',
      dataIndex: 'teamMembers',
      key: 'teamMembers',
      render: (teamMembers: any[]) => teamMembers?.length || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Team) => (
        <Flex gap="small">
          <Button
            type="primary"
            onClick={() => setSelectedTeam(record.id)}
            icon={<i className="las la-user-plus" />}
          >
            Manage Members
          </Button>
          <Button
            danger
            onClick={() => handleDeleteTeam(record.id)}
            icon={<i className="las la-trash" />}
          >
            Remove Team
          </Button>
        </Flex>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <Row justify="center" className="p-4 sm:p-6">
        <Col xs={24} xl={20}>
          <Card>
            <div style={{ marginBottom: '24px' }}>
              <Title level={2}>
                <i className="las la-users" /> Team Management
              </Title>
              <Text>
                Manage your organization's teams, work shifts, and member
                assignments
              </Text>
            </div>

            <Flex gap="small" style={{ marginBottom: '16px' }}>
              {isAdmin && (
                <>
                  <Button
                    type="primary"
                    onClick={() => setTeamModal(true)}
                    icon={<i className="las la-plus" />}
                  >
                    Create Team
                  </Button>
                  <Button
                    onClick={() => setShiftModal(true)}
                    icon={<i className="las la-clock" />}
                  >
                    Manage Shifts
                  </Button>
                </>
              )}
            </Flex>

            <Table
              dataSource={teams}
              columns={columns}
              rowKey="id"
              className="overflow-x-auto"
              scroll={{ x: true }}
            />

            {/* Create Team Modal */}
            <Modal
              title="Create New Team"
              open={teamModal}
              onCancel={() => setTeamModal(false)}
              footer={null}
            >
              <Form onFinish={handleCreateTeam}>
                <Form.Item
                  name="departmentName"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Input
                    placeholder="Department Name"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item name="managerId" className="w-full">
                  <Select
                    placeholder="Select Manager"
                    style={{ width: '100%' }}
                  >
                    {users?.map(user => (
                      <Select.Option key={user.id} value={user.id}>
                        {user.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="shiftId" className="w-full">
                  <Select
                    placeholder="Select Work Shift"
                    style={{ width: '100%' }}
                  >
                    {shifts?.map(shift => (
                      <Select.Option key={shift.id} value={shift.id}>
                        {shift.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Flex justify="end">
                  <Button type="primary" htmlType="submit">
                    Create Team
                  </Button>
                </Flex>
              </Form>
            </Modal>

            {/* Create Shift Modal */}
            <Modal
              title="Create Work Shift"
              open={shiftModal}
              onCancel={() => setShiftModal(false)}
              footer={null}
            >
              <Form onFinish={handleCreateShift}>
                <Form.Item
                  name="name"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Input placeholder="Shift Name" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="startTime"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Input
                    placeholder="Start Time (HH:MM)"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="endTime"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Input
                    placeholder="End Time (HH:MM)"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="breakDuration"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Input
                    placeholder="Break Duration (hours)"
                    type="number"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="overtimeThreshold"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Input
                    placeholder="Overtime Threshold (hours)"
                    type="number"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Flex justify="end">
                  <Button type="primary" htmlType="submit">
                    Create Shift
                  </Button>
                </Flex>
              </Form>
            </Modal>

            {/* Manage Team Members Modal */}
            <Modal
              title="Manage Team Members"
              open={!!selectedTeam}
              onCancel={() => setSelectedTeam(null)}
              footer={null}
            >
              <Form
                onFinish={values =>
                  handleAssignEmployee(selectedTeam!, values.userId)
                }
              >
                <Form.Item
                  name="userId"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Select
                    placeholder="Select Employee"
                    style={{ width: '100%' }}
                  >
                    {users?.map(user => (
                      <Select.Option key={user.id} value={user.id}>
                        {user.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Flex justify="end">
                  <Button type="primary" htmlType="submit">
                    Add Member
                  </Button>
                </Flex>
              </Form>

              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Current Team Members</Title>
                {teams
                  ?.find(t => t.id === selectedTeam)
                  ?.teamMembers.map(member => (
                    <div key={member.id}>
                      <Text>{member.user?.name}</Text>
                    </div>
                  ))}
              </div>
            </Modal>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
