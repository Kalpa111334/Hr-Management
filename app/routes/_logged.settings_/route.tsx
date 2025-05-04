import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { ErrorBoundary } from '@/designSystem/core'
import { useDesignSystem } from '@/designSystem/provider'
import { Navigate, useLocation, useNavigate } from '@remix-run/react'
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
const { Title, Text } = Typography

export default function SettingsPage() {
  const { checkRole, checkPageAccess } = useUserContext()
  const { isMobile } = useDesignSystem()
  const { pathname } = useLocation()

  if (!checkPageAccess(pathname)) {
    return <Navigate to="/home" replace />
  }
  const [activeTab, setActiveTab] = useState<'locations' | 'shifts' | 'users'>(
    'locations',
  )
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const hasAccess = checkRole('ADMIN') || checkRole('USER')
        setIsAuthorized(hasAccess)
        if (!hasAccess) {
          navigate('/home')
        }
      } catch (error) {
        console.error('Authorization check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthorization()
  }, [checkRole, navigate])

  const { data: locations, refetch: refetchLocations } =
    Api.officeLocation.findMany.useQuery(undefined, {
      enabled: isAuthorized,
    })
  const { mutateAsync: createLocation } =
    Api.officeLocation.create.useMutation()
  const { mutateAsync: deleteLocation } =
    Api.officeLocation.delete.useMutation()
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)

  const { data: shifts, refetch: refetchShifts } =
    Api.workShift.findMany.useQuery(undefined, {
      enabled: isAuthorized,
    })
  const { mutateAsync: createShift } = Api.workShift.create.useMutation()
  const { mutateAsync: deleteShift } = Api.workShift.delete.useMutation()
  const [isShiftModalVisible, setIsShiftModalVisible] = useState(false)

  const { data: users, refetch: refetchUsers } = Api.user.findMany.useQuery(
    undefined,
    {
      enabled: isAuthorized,
    },
  )
  const { mutateAsync: updateUser } = Api.user.update.useMutation()
  const { mutateAsync: createUser } = Api.user.create.useMutation()
  const { mutateAsync: deleteUser } = Api.user.delete.useMutation()
  const [isUserModalVisible, setIsUserModalVisible] = useState(false)

  if (isLoading) {
    return (
      <PageLayout layout="full-width">
        <Row justify="center" className="p-4 md:p-8">
          <Col>
            <Text>Loading...</Text>
          </Col>
        </Row>
      </PageLayout>
    )
  }

  if (!isAuthorized) {
    return (
      <PageLayout layout="full-width">
        <Row justify="center" className="p-4 md:p-8">
          <Col>
            <Alert
              message="Access Denied"
              description="You do not have permission to access this page."
              type="error"
              showIcon
            />
          </Col>
        </Row>
      </PageLayout>
    )
  }

  const handleLocationSubmit = async (values: any) => {
    await createLocation({
      data: {
        name: values.name,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        radius: values.radius,
      },
    })
    setIsLocationModalVisible(false)
    refetchLocations()
  }

  const handleShiftSubmit = async (values: any) => {
    await createShift({
      data: {
        name: values.name,
        startTime: values.startTime,
        endTime: values.endTime,
        breakDuration: values.breakDuration,
        overtimeThreshold: values.overtimeThreshold,
      },
    })
    setIsShiftModalVisible(false)
    refetchShifts()
  }

  const handleDeleteLocation = async (id: string) => {
    await deleteLocation({ where: { id } })
    await refetchLocations()
  }

  const handleDeleteShift = async (id: string) => {
    await deleteShift({ where: { id } })
    await refetchShifts()
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUser({
      where: { id: userId },
      data: { globalRole: newRole },
    })
    refetchUsers()
  }

  const handleDeleteUser = async (id: string) => {
    await deleteUser({ where: { id } })
    refetchUsers()
  }

  const handleUserSubmit = async (values: any) => {
    await createUser({
      data: {
        name: values.name,
        email: values.email,
        password: values.password,
        globalRole: values.globalRole,
      },
    })
    setIsUserModalVisible(false)
    refetchUsers()
  }

  const locationColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: '30%' },
    { title: 'Address', dataIndex: 'address', key: 'address', width: '50%' },
    {
      title: 'Radius (meters)',
      dataIndex: 'radius',
      key: 'radius',
      width: '20%',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button danger onClick={() => handleDeleteLocation(record.id)}>
          <i className="las la-trash"></i>
        </Button>
      ),
    },
  ]

  const shiftColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: '25%' },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: '25%',
    },
    { title: 'End Time', dataIndex: 'endTime', key: 'endTime', width: '25%' },
    {
      title: 'Break (hrs)',
      dataIndex: 'breakDuration',
      key: 'breakDuration',
      width: '25%',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button danger onClick={() => handleDeleteShift(record.id)}>
          <i className="las la-trash"></i>
        </Button>
      ),
    },
  ]

  const userColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: '30%' },
    { title: 'Email', dataIndex: 'email', key: 'email', width: '40%' },
    {
      title: 'Role',
      key: 'role',
      render: (record: any) => (
        <Select
          defaultValue={record.globalRole}
          style={{ width: 120 }}
          onChange={value => handleRoleChange(record.id, value)}
          options={[
            { value: 'ADMIN', label: 'Admin' },
            { value: 'USER', label: 'User' },
          ]}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button danger onClick={() => handleDeleteUser(record.id)}>
          <i className="las la-trash"></i>
        </Button>
      ),
    },
  ]

  return (
    <ErrorBoundary>
      <PageLayout layout="full-width">
        <Row justify="center" className="p-4 md:p-8">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={2}>
              <i className="las la-cog"></i> System Settings
            </Title>
            <Text>
              Manage your organization's settings, locations, and user roles.
            </Text>

            <Row gutter={[16, 16]} style={{ marginTop: '2rem' }}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col xs={8} sm={8} md={8}>
                    <Button
                      className="w-full"
                      type={activeTab === 'locations' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('locations')}
                    >
                      <i className="las la-map-marker"></i> Locations
                    </Button>
                  </Col>
                  <Col xs={8} sm={8} md={8}>
                    <Button
                      className="w-full"
                      type={activeTab === 'shifts' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('shifts')}
                    >
                      <i className="las la-clock"></i> Work Shifts
                    </Button>
                  </Col>
                  <Col xs={8} sm={8} md={8}>
                    <Button
                      className="w-full"
                      type={activeTab === 'users' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('users')}
                    >
                      <i className="las la-users"></i> Users
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                {activeTab === 'locations' && (
                  <Card
                    title="Office Locations"
                    extra={
                      <Button
                        type="primary"
                        onClick={() => setIsLocationModalVisible(true)}
                      >
                        <i className="las la-plus"></i> Add Location
                      </Button>
                    }
                  >
                    <Table
                      columns={locationColumns}
                      dataSource={locations}
                      rowKey="id"
                      scroll={{ x: 'max-content' }}
                      className="overflow-x-auto"
                    />
                  </Card>
                )}

                {activeTab === 'shifts' && (
                  <Card
                    title="Work Shifts"
                    extra={
                      <Button
                        type="primary"
                        onClick={() => setIsShiftModalVisible(true)}
                      >
                        <i className="las la-plus"></i> Add Shift
                      </Button>
                    }
                  >
                    <Table
                      columns={shiftColumns}
                      dataSource={shifts}
                      rowKey="id"
                      scroll={{ x: true }}
                      className="overflow-x-auto"
                    />
                  </Card>
                )}

                {activeTab === 'users' && (
                  <Card
                    title="User Management"
                    extra={
                      <Button
                        type="primary"
                        onClick={() => setIsUserModalVisible(true)}
                      >
                        <i className="las la-plus"></i> Add Employee
                      </Button>
                    }
                  >
                    <Table
                      columns={userColumns}
                      dataSource={users}
                      rowKey="id"
                      scroll={{ x: true }}
                      className="overflow-x-auto"
                    />
                  </Card>
                )}
              </Col>
            </Row>

            <Modal
              title="Add New Location"
              open={isLocationModalVisible}
              onCancel={() => setIsLocationModalVisible(false)}
              footer={null}
              width={isMobile ? '100%' : '520px'}
              centered
            >
              <Form onFinish={handleLocationSubmit} layout="vertical">
                <Form.Item
                  name="name"
                  label="Location Name"
                  rules={[{ required: true }]}
                >
                  <Input className="w-full" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="latitude"
                  label="Latitude"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="longitude"
                  label="Longitude"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="radius"
                  label="Radius (meters)"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="w-full">
                    Create Location
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Add New Shift"
              open={isShiftModalVisible}
              onCancel={() => setIsShiftModalVisible(false)}
              footer={null}
              width={isMobile ? '100%' : '520px'}
              centered
            >
              <Form onFinish={handleShiftSubmit} layout="vertical">
                <Form.Item
                  name="name"
                  label="Shift Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="endTime"
                  label="End Time"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="breakDuration"
                  label="Break Duration (hours)"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="overtimeThreshold"
                  label="Overtime Threshold (hours)"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Create Shift
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Add New Employee"
              open={isUserModalVisible}
              onCancel={() => setIsUserModalVisible(false)}
              footer={null}
              width={isMobile ? '100%' : '520px'}
              centered
            >
              <Form onFinish={handleUserSubmit} layout="vertical">
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="globalRole"
                  label="Role"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'ADMIN', label: 'Admin' },
                      { value: 'USER', label: 'User' },
                    ]}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Create Employee
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Col>
        </Row>
      </PageLayout>
    </ErrorBoundary>
  )
}
