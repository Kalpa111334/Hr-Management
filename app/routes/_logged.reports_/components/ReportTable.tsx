import { Api } from '@/core/trpc'
import { Table } from 'antd'
import dayjs from 'dayjs'
import { FC, useMemo } from 'react'

interface ReportTableProps {
  reportType: 'employee' | 'department' | 'monthly'
  employeeId?: string
  teamId?: string
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs]
  detailed?: boolean
}

export const ReportTable: FC<ReportTableProps> = ({
  reportType,
  employeeId,
  teamId,
  dateRange,
  detailed,
}) => {
  const { data: attendances } = Api.attendance.findMany.useQuery({
    include: {
      user: true,
      location: true,
    },
    where: {
      ...(employeeId && { userId: employeeId }),
      ...(teamId && {
        user: {
          teamMembers: {
            some: {
              teamId,
            },
          },
        },
      }),
      ...(dateRange && {
        createdAt: {
          gte: dateRange[0].toDate(),
          lte: dateRange[1].toDate(),
        },
      }),
    },
  })

  const { data: teams } = Api.team.findMany.useQuery({
    include: {
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

  const columns = useMemo(() => {
    const baseColumns = {
      employee: [
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'date',
          sorter: (a: any, b: any) =>
            dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
          render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
          title: 'Check In',
          dataIndex: 'checkInTime',
          key: 'checkIn',
          sorter: (a: any, b: any) =>
            (a.checkInTime || '').localeCompare(b.checkInTime || ''),
        },
        {
          title: 'Check Out',
          dataIndex: 'checkOutTime',
          key: 'checkOut',
          sorter: (a: any, b: any) =>
            (a.checkOutTime || '').localeCompare(b.checkOutTime || ''),
        },
        {
          title: 'Overtime Hours',
          key: 'overtime',
          sorter: (a: any, b: any) => {
            const getOvertime = (record: any) =>
              record.checkInTime && record.checkOutTime
                ? Math.max(
                    0,
                    dayjs(record.checkOutTime, 'HH:mm').diff(
                      dayjs(record.checkInTime, 'HH:mm'),
                      'hour',
                    ) - 8,
                  )
                : 0
            return getOvertime(a) - getOvertime(b)
          },
          render: (record: any) =>
            record.checkInTime && record.checkOutTime
              ? Math.max(
                  0,
                  dayjs(record.checkOutTime, 'HH:mm').diff(
                    dayjs(record.checkInTime, 'HH:mm'),
                    'hour',
                  ) - 8,
                )
              : 0,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: 'ON_TIME', value: 'ON_TIME' },
            { text: 'LATE', value: 'LATE' },
          ],
          onFilter: (value: string, record: any) => record.status === value,
          sorter: (a: any, b: any) =>
            (a.status || '').localeCompare(b.status || ''),
        },
      ],
      department: [
        {
          title: 'Employee',
          dataIndex: ['user', 'name'],
          key: 'employee',
          sorter: (a: any, b: any) =>
            (a.user?.name || '').localeCompare(b.user?.name || ''),
          filterable: true,
        },
        {
          title: 'Attendance Rate',
          key: 'attendanceRate',
          sorter: (a: any, b: any) => {
            const getRate = (record: any) =>
              ((record.user?.attendances?.length || 0) / 20) * 100
            return getRate(a) - getRate(b)
          },
          render: (record: any) =>
            `${(((record.user?.attendances?.length || 0) / 20) * 100).toFixed(
              1,
            )}%`,
        },
        {
          title: 'Late Arrivals',
          key: 'lateArrivals',
          sorter: (a: any, b: any) => {
            const getLateCount = (record: any) =>
              record.user?.attendances?.filter((a: any) => a.status === 'LATE')
                .length || 0
            return getLateCount(a) - getLateCount(b)
          },
          render: (record: any) =>
            record.user?.attendances?.filter((a: any) => a.status === 'LATE')
              .length || 0,
        },
        {
          title: 'Leave Days',
          key: 'leaveDays',
          sorter: (a: any, b: any) => {
            const getLeaveDays = (record: any) =>
              record.user?.leaveRequests?.reduce(
                (total: number, lr: any) =>
                  total +
                  (dayjs(lr.endDate).diff(dayjs(lr.startDate), 'day') + 1),
                0,
              ) || 0
            return getLeaveDays(a) - getLeaveDays(b)
          },
          render: (record: any) =>
            record.user?.leaveRequests?.reduce(
              (total: number, lr: any) =>
                total +
                (dayjs(lr.endDate).diff(dayjs(lr.startDate), 'day') + 1),
              0,
            ) || 0,
        },
      ],
      monthly: [
        {
          title: 'Metric',
          dataIndex: 'metric',
          key: 'metric',
          sorter: (a: any, b: any) => a.metric.localeCompare(b.metric),
          filters: [
            { text: 'Total Employees', value: 'Total Employees' },
            {
              text: 'Average Attendance Rate',
              value: 'Average Attendance Rate',
            },
            { text: 'Total Late Arrivals', value: 'Total Late Arrivals' },
            { text: 'Total Overtime Hours', value: 'Total Overtime Hours' },
          ],
          onFilter: (value: string, record: any) => record.metric === value,
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          sorter: (a: any, b: any) => a.value.localeCompare(b.value),
        },
      ],
    }

    switch (reportType) {
      case 'employee':
        return baseColumns.employee
      case 'department':
        return baseColumns.department
      case 'monthly':
        return baseColumns.monthly
      default:
        return []
    }
  }, [reportType])

  const data = useMemo(() => {
    switch (reportType) {
      case 'employee':
        return attendances || []
      case 'department':
        return (
          teams
            ?.find(t => t.id === teamId)
            ?.teamMembers.map(member => ({
              user: member.user,
              attendances: member.user?.attendances,
              leaveRequests: member.user?.leaveRequests,
            })) || []
        )
      case 'monthly':
        const totalEmployees =
          teams?.reduce(
            (sum, team) => sum + (team.teamMembers?.length || 0),
            0,
          ) || 0
        const totalAttendances = attendances?.length || 0
        const lateAttendances =
          attendances?.filter(a => a.status === 'LATE').length || 0
        const totalOvertimeHours =
          attendances?.reduce((total, a) => {
            if (a.checkInTime && a.checkOutTime) {
              return (
                total +
                Math.max(
                  0,
                  dayjs(a.checkOutTime, 'HH:mm').diff(
                    dayjs(a.checkInTime, 'HH:mm'),
                    'hour',
                  ) - 8,
                )
              )
            }
            return total
          }, 0) || 0

        return [
          {
            metric: 'Total Employees',
            value: totalEmployees.toString(),
          },
          {
            metric: 'Average Attendance Rate',
            value: `${((totalAttendances / 20) * 100).toFixed(1)}%`,
          },
          {
            metric: 'Total Late Arrivals',
            value: lateAttendances.toString(),
          },
          {
            metric: 'Total Overtime Hours',
            value: totalOvertimeHours.toString(),
          },
        ]
      default:
        return []
    }
  }, [reportType, attendances, teams, teamId])

  const summary = useMemo(() => {
    if (reportType === 'employee') {
      return (data: any[]) => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
            <Table.Summary.Cell index={1} />
            <Table.Summary.Cell index={2} />
            <Table.Summary.Cell index={3}>
              {data.reduce(
                (total, record) =>
                  total +
                  (record.checkInTime && record.checkOutTime
                    ? Math.max(
                        0,
                        dayjs(record.checkOutTime, 'HH:mm').diff(
                          dayjs(record.checkInTime, 'HH:mm'),
                          'hour',
                        ) - 8,
                      )
                    : 0),
                0,
              )}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} />
          </Table.Summary.Row>
        </Table.Summary>
      )
    }
    return undefined
  }, [reportType])

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={record =>
        reportType === 'monthly' ? record.metric : record.id || record.user?.id
      }
      pagination={detailed ? false : { pageSize: 10 }}
      scroll={{ x: true, y: detailed ? 500 : undefined }}
      summary={summary}
      expandable={
        detailed
          ? {
              expandedRowRender: record => (
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(record, null, 2)}
                </pre>
              ),
            }
          : undefined
      }
    />
  )
}
