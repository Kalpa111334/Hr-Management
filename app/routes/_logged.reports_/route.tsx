import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { useLocation, Navigate } from '@remix-run/react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  message,
  Row,
  Select,
  Statistic,
  Table,
  Tabs,
  Typography,
} from 'antd'
import { ColumnType } from 'antd/es/table'
import { ReportColumn } from './types'
import dayjs from 'dayjs'
import type { jsPDF as jsPDFType } from 'jspdf'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Papa from 'papaparse'
import { useState } from 'react'
import { useAttendanceData } from '../_logged.home_/hooks/useAttendanceData'
import { ReportDescription } from './components/ReportDescription'
import type { ReportData } from './types'
const { Title, Text } = Typography
const { RangePicker } = DatePicker

export default function ReportsPage() {
  const { user, checkRole, checkPageAccess } = useUserContext()
  const { pathname } = useLocation()

  if (!checkPageAccess(pathname)) {
    return <Navigate to='/home' replace />
  }
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  )
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [reportType, setReportType] = useState<
    'employee' | 'department' | 'monthly'
  >('employee')
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv')
  const [activeTab, setActiveTab] = useState('daily')
  const [showDetailedView, setShowDetailedView] = useState(false)

  const { data: teams } = Api.team.findMany.useQuery({
    include: {
      manager: true,
      teamMembers: {
        include: {
          user: {
            include: {
              attendances: true,
              leaveRequests: true,
            },
          },
        },
      },
    },
  })

  const { data: users } = Api.user.findMany.useQuery()

  const [isLoading, setIsLoading] = useState(false)
  const { calculateOvertimeHours } = useAttendanceData()

  const { data: attendances } = Api.attendance.findMany.useQuery({
    include: {
      user: true,
      location: true,
    },
    where: selectedEmployee
      ? { userId: selectedEmployee }
      : selectedTeam
      ? {
          user: { teamMembers: { some: { teamId: selectedTeam } } },
        }
      : undefined,
  })

  const { data: leaveRequests } = Api.leaveRequest.findMany.useQuery({
    where: { userId: selectedEmployee || user?.id },
    orderBy: { startDate: 'desc' },
  })

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.name,
    },
    {
      title: 'Check In',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      render: (time: string) => time || '-',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
      render: (time: string) => time || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: any) => location?.name || '-',
    },
  ]

  const totalAttendances = attendances?.length || 0
  const onTimeAttendances =
    attendances?.filter(a => a.status === 'ON_TIME')?.length || 0
  const lateAttendances =
    attendances?.filter(a => a.status === 'LATE')?.length || 0

  const handleExport = () => {
    try {
      let formattedData: { type: string; data: any[] } = { type: '', data: [] }
      let fileName = ''

      // Filter data based on date range
      let filteredData = attendances || []
      if (dateRange) {
        const [startDate, endDate] = dateRange
        filteredData = filteredData.filter(attendance => {
          const checkInDate = dayjs(attendance.checkInTime)
          return checkInDate.isAfter(startDate) && checkInDate.isBefore(endDate)
        })
      }

      switch (reportType) {
        case 'employee':
          formattedData = {
            type: 'employee',
            data: filteredData
              .filter(a => a.user?.id === selectedEmployee)
              .map(attendance => ({
                type: 'employee' as const,
                Employee: attendance.user?.name || '-',
                Date: dayjs(attendance.createdAt).format('YYYY-MM-DD'),
                'Check In': attendance.checkInTime || '-',
                'Check Out': attendance.checkOutTime || '-',
                'Overtime Hours': calculateOvertimeHours(),
                Status: attendance.status || '-',
              })),
          } as ReportData
          fileName = `employee_report_${dayjs().format('YYYY-MM-DD')}`
          break

        case 'department':
          const teamData = teams?.find(t => t.id === selectedTeam)
          formattedData = {
            type: 'department',
            data:
              teamData?.teamMembers.map(member => ({
                type: 'department' as const,
                Employee: member.user?.name || '-',
                'Attendance Rate':
                  (
                    ((member.user?.attendances?.length || 0) / 20) *
                    100
                  ).toFixed(1) + '%',
                'Late Arrivals':
                  member.user?.attendances?.filter(a => a.status === 'LATE')
                    .length || 0,
                'Leave Days':
                  member.user?.leaveRequests?.reduce(
                    (total, lr) =>
                      total +
                      (dayjs(lr.endDate).diff(dayjs(lr.startDate), 'day') + 1),
                    0,
                  ) || 0,
              })) || [],
          } as ReportData
          fileName = `department_report_${dayjs().format('YYYY-MM-DD')}`
          break

        case 'monthly':
          formattedData = {
            type: 'monthly',
            data: [
              {
                type: 'monthly' as const,
                Employee:
                  users?.find(u => u.id === selectedEmployee)?.name || '-',
                'Total Employees':
                  teams?.reduce(
                    (sum, team) => sum + (team.teamMembers?.length || 0),
                    0,
                  ) || 0,
                'Average Attendance Rate':
                  ((totalAttendances / 20) * 100).toFixed(1) + '%',
                'Total Late Arrivals': lateAttendances,
                'Total Overtime Hours':
                  attendances?.reduce((total, a) => {
                    if (a.checkInTime && a.checkOutTime) {
                      return (
                        total +
                        Math.max(
                          0,
                          dayjs(a.checkOutTime).diff(
                            dayjs(a.checkInTime),
                            'hour',
                          ) - 8,
                        )
                      )
                    }
                    return total
                  }, 0) || 0,
              },
            ],
          } as ReportData
          fileName = `monthly_summary_${dayjs().format('YYYY-MM-DD')}`
          break
      }

      if (exportFormat === 'csv') {
        const csv = Papa.unparse(formattedData)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${fileName}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else if (exportFormat === 'pdf') {
        const doc = new jsPDF() as jsPDFType & { autoTable: Function }
        doc.autoTable({
          head: [Object.keys(formattedData.data[0] || {})],
          body: formattedData.data.map(item => Object.values(item)),
          styles: { fontSize: 8, cellPadding: 2 },
          margin: { top: 20 },
        })
        doc.text(`${reportType.toUpperCase()} REPORT`, 14, 15)
        doc.save(`${fileName}.pdf`)
      }
    } catch (error) {
      console.error('Export failed:', error)
      message.error('Failed to export data')
    }
  }

  const handleFormatChange = (value: string) => {
    setExportFormat(value as 'csv' | 'pdf')
  }

  return (
    <PageLayout layout="full-width">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6">
        <Title level={2}>
          <i className="las la-chart-bar" style={{ marginRight: '8px' }}></i>
          Attendance Reports
        </Title>
        <Text type="secondary">
          Generate and analyze attendance reports for your team or company-wide
        </Text>

        <Card className="p-4 sm:p-6" style={{ marginTop: '24px' }}>
          <Flex vertical gap="small" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <Select
                  className="w-full"
                  placeholder="Report Type"
                  value={reportType}
                  onChange={value => setReportType(value)}
                >
                  <Select.Option value="employee">
                    Employee Report
                  </Select.Option>
                  <Select.Option value="department">
                    Department Report
                  </Select.Option>
                  <Select.Option value="monthly">Monthly Summary</Select.Option>
                </Select>
                <ReportDescription reportType={reportType} />
              </Col>
              <Col xs={24} md={6}>
                {reportType === 'employee' ? (
                  <Select
                    className="w-full"
                    placeholder="Select Employee"
                    onChange={setSelectedEmployee}
                    allowClear
                  >
                    {users?.map(user => (
                      <Select.Option key={user.id} value={user.id}>
                        {user.name}
                      </Select.Option>
                    ))}
                  </Select>
                ) : reportType === 'department' ? (
                  <Select
                    className="w-full"
                    placeholder="Select Team"
                    onChange={setSelectedTeam}
                    allowClear
                  >
                    {teams?.map(team => (
                      <Select.Option key={team.id} value={team.id}>
                        {team.departmentName}
                      </Select.Option>
                    ))}
                  </Select>
                ) : null}
              </Col>
              <Col xs={24} md={8}>
                <RangePicker
                  className="w-full"
                  onChange={dates =>
                    setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
                  }
                />
              </Col>
              <Col xs={24} md={8}>
                <Flex gap="small">
                  <Select
                    defaultValue="csv"
                    style={{ width: 120 }}
                    onChange={handleFormatChange}
                  >
                    <Select.Option value="csv">CSV</Select.Option>
                    <Select.Option value="pdf">PDF</Select.Option>
                  </Select>
                  <Button
                    type="primary"
                    icon={<i className="las la-eye"></i>}
                    onClick={() => setShowDetailedView(!showDetailedView)}
                  >
                    View Details
                  </Button>
                  <Button
                    type="primary"
                    icon={<i className="las la-download"></i>}
                    onClick={handleExport}
                  >
                    Download Report
                  </Button>
                </Flex>
              </Col>
            </Row>

            {checkRole('ADMIN') && (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Total Attendances"
                    value={totalAttendances}
                    prefix={<i className="las la-users"></i>}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="On Time"
                    value={onTimeAttendances}
                    prefix={<i className="las la-clock"></i>}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Late"
                    value={lateAttendances}
                    prefix={<i className="las la-exclamation-circle"></i>}
                  />
                </Col>
              </Row>
            )}

            <Table
              className="overflow-x-auto"
              scroll={{ x: true }}
              columns={columns}
              dataSource={attendances}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Flex>
        </Card>

        {showDetailedView && (
          <Card className="mt-6">
            <Flex vertical gap="small">
              <Title level={4}>Detailed View</Title>
              <Table
                className="overflow-x-auto"
                scroll={{ x: true }}
                columns={
                  reportType === 'employee'
                    ? [
                        { title: 'Date', dataIndex: 'Date', key: 'date' },
                        { title: 'Check In', dataIndex: 'Check In', key: 'checkIn' },
                        { title: 'Check Out', dataIndex: 'Check Out', key: 'checkOut' },
                        {
                          title: 'Extra Hours',
                          dataIndex: 'Overtime Hours',
                          key: 'overtime',
                        },
                        { title: 'Status', dataIndex: 'Status', key: 'status' },
                      ] as ReportColumn[]
                    : reportType === 'department'
                    ? [
                        { title: 'Employee', dataIndex: 'Employee', key: 'employee' },
                        { title: 'Present %', dataIndex: 'Attendance Rate', key: 'rate' },
                        { title: 'Times Late', dataIndex: 'Late Arrivals', key: 'late' },
                        { title: 'Leave Days', dataIndex: 'Leave Days', key: 'leave' },
                      ] as ReportColumn[]
                    : [
                        { title: 'Metric', key: 'metric', dataIndex: 'metric' },
                        { title: 'Value', key: 'value', dataIndex: 'value' },
                      ] as ReportColumn[]
                }
                dataSource={(() => {
                  let filteredData = attendances || []
                  if (dateRange) {
                    const [startDate, endDate] = dateRange
                    filteredData = filteredData.filter(attendance => {
                      const checkInDate = dayjs(attendance.checkInTime)
                      return (
                        checkInDate.isAfter(startDate) &&
                        checkInDate.isBefore(endDate)
                      )
                    })
                  }

                  switch (reportType) {
                    case 'employee':
                      return filteredData
                        .filter(a => a.user?.id === selectedEmployee)
                        .map(attendance => ({
                          type: 'employee' as const,
                          Date: dayjs(attendance.createdAt).format(
                            'YYYY-MM-DD',
                          ),
                          'Check In': attendance.checkInTime || '-',
                          'Check Out': attendance.checkOutTime || '-',
                          'Overtime Hours':
                            attendance.checkInTime && attendance.checkOutTime
                              ? Math.max(
                                  0,
                                  dayjs(attendance.checkOutTime).diff(
                                    dayjs(attendance.checkInTime),
                                    'hour',
                                  ) - 8,
                                )
                              : 0,
                          Status: attendance.status || '-',
                        })) as ReportData['data']
                    case 'department':
                      const teamData = teams?.find(t => t.id === selectedTeam)
                      return (teamData?.teamMembers.map(member => ({
                        type: 'department' as const,
                        Employee: member.user?.name || '-',
                        'Attendance Rate':
                          (
                            ((member.user?.attendances?.length || 0) / 20) *
                            100
                          ).toFixed(1) + '%',
                        'Late Arrivals':
                          member.user?.attendances?.filter(
                            a => a.status === 'LATE',
                          ).length || 0,
                        'Leave Days':
                          member.user?.leaveRequests?.reduce(
                            (total, lr) =>
                              total +
                              (dayjs(lr.endDate).diff(
                                dayjs(lr.startDate),
                                'day',
                              ) +
                                1),
                            0,
                          ) || 0,
                      })) || []) as ReportData['data']
                    case 'monthly':
                      return [
                        {
                          type: 'monthly' as const,
                          Employee:
                            users?.find(u => u.id === selectedEmployee)?.name ||
                            '-',
                          'Total Employees':
                            teams?.reduce(
                              (sum, team) =>
                                sum + (team.teamMembers?.length || 0),
                              0,
                            ) || 0,
                          'Average Attendance Rate':
                            ((totalAttendances / 20) * 100).toFixed(1) + '%',
                          'Total Late Arrivals': lateAttendances,
                          'Total Overtime Hours':
                            attendances?.reduce((total, a) => {
                              if (a.checkInTime && a.checkOutTime) {
                                return (
                                  total +
                                  Math.max(
                                    0,
                                    dayjs(a.checkOutTime).diff(
                                      dayjs(a.checkInTime),
                                      'hour',
                                    ) - 8,
                                  )
                                )
                              }
                              return total
                            }, 0) || 0,
                        },
                      ] as ReportData['data']
                    default:
                      return []
                  }
                })()}
                pagination={{ pageSize: 10 }}
              />
              <Button
                type="primary"
                icon={<i className="las la-download"></i>}
                onClick={handleExport}
              >
                Download
              </Button>
            </Flex>
          </Card>
        )}

        <Card
          className="mt-6"
          title={
            <>
              <i className="las la-chart-line"></i>
              {selectedEmployee
                ? `${
                    users?.find(u => u.id === selectedEmployee)?.name
                  }'s Analytics`
                : 'Personal Analytics'}
            </>
          }
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'daily',
                label: 'Daily View',
                children: (
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card title="Today's Attendance Pattern">
                        <Statistic
                          title="Check-in Time"
                          value={attendances?.[0]?.checkInTime || 'N/A'}
                          prefix={<i className="las la-clock"></i>}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Today's Performance">
                        <Statistic
                          title="Status"
                          value={attendances?.[0]?.status || 'N/A'}
                          prefix={<i className="las la-check-circle"></i>}
                        />
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'weekly',
                label: 'Weekly View',
                children: (
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card title="Weekly Attendance">
                        <Statistic
                          title="Present Days"
                          value={
                            attendances?.filter(a => a.status === 'PRESENT')
                              .length || 0
                          }
                          prefix={<i className="las la-calendar-check"></i>}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="Overtime Hours">
                        <Statistic
                          title="Total Hours"
                          value={
                            attendances?.reduce((total, a) => {
                              if (a.checkInTime && a.checkOutTime) {
                                const duration = dayjs(a.checkOutTime).diff(
                                  dayjs(a.checkInTime),
                                  'hour',
                                )
                                return total + Math.max(0, duration - 8)
                              }
                              return total
                            }, 0) || 0
                          }
                          prefix={<i className="las la-hourglass-half"></i>}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="Punctuality">
                        <Statistic
                          title="On-time Ratio"
                          value={(
                            (onTimeAttendances / totalAttendances) *
                            100
                          ).toFixed(1)}
                          suffix="%"
                          prefix={<i className="las la-running"></i>}
                        />
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'monthly',
                label: 'Monthly View',
                children: (
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card title="Leave Utilization">
                        <Table
                          dataSource={leaveRequests}
                          pagination={false}
                          columns={[
                            {
                              title: 'Status',
                              render: (_, record) => record.status,
                            },
                            {
                              title: 'Days',
                              render: (_, record) =>
                                dayjs(record.endDate).diff(
                                  dayjs(record.startDate),
                                  'day',
                                ) + 1,
                            },
                          ]}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Monthly Summary">
                        <Statistic
                          title="Attendance Rate"
                          value={((totalAttendances / 20) * 100).toFixed(1)}
                          suffix="%"
                          prefix={<i className="las la-percentage"></i>}
                        />
                      </Card>
                    </Col>
                  </Row>
                ),
              },
            ]}
          />
          <Button
            type="primary"
            icon={<i className="las la-download"></i>}
            onClick={() => {
              const analyticsData = {
                attendanceRate: ((totalAttendances / 20) * 100).toFixed(1),
                onTimeRatio: (
                  (onTimeAttendances / totalAttendances) *
                  100
                ).toFixed(1),
                overtimeHours:
                  attendances?.reduce((total, a) => {
                    if (a.checkInTime && a.checkOutTime) {
                      const duration = dayjs(a.checkOutTime).diff(
                        dayjs(a.checkInTime),
                        'hour',
                      )
                      return total + Math.max(0, duration - 8)
                    }
                    return total
                  }, 0) || 0,
                leaveUtilization: leaveRequests?.map(l => ({
                  type: l.status,
                  days: dayjs(l.endDate).diff(dayjs(l.startDate), 'day') + 1,
                })),
              }
              const csv = Papa.unparse(analyticsData)
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const link = document.createElement('a')
              const url = URL.createObjectURL(blob)
              link.setAttribute('href', url)
              link.setAttribute(
                'download',
                `personal_analytics_${dayjs().format('YYYY-MM-DD')}.csv`,
              )
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            className="mt-4"
          >
            Export Analytics
          </Button>
        </Card>
      </div>
    </PageLayout>
  )
}
