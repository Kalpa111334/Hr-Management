import { Api } from '@/core/trpc'
import { Col, DatePicker, Row, Select } from 'antd'
import { FC } from 'react'
const { RangePicker } = DatePicker

interface ReportFiltersProps {
  onEmployeeChange: (value: string | null) => void
  onDepartmentChange: (value: string | null) => void
  onDateRangeChange: (dates: [any, any] | null) => void
  onReportTypeChange: (value: 'employee' | 'department' | 'monthly') => void
}

export const ReportFilters: FC<ReportFiltersProps> = ({
  onEmployeeChange,
  onDepartmentChange,
  onDateRangeChange,
  onReportTypeChange,
}) => {
  const { data: users } = Api.user.findMany.useQuery()
  const { data: teams } = Api.team.findMany.useQuery()

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={6}>
        <Select
          className="w-full"
          placeholder="Report Type"
          onChange={value => onReportTypeChange(value)}
        >
          <Select.Option value="employee">Employee Report</Select.Option>
          <Select.Option value="department">Department Report</Select.Option>
          <Select.Option value="monthly">Monthly Summary</Select.Option>
        </Select>
      </Col>
      <Col xs={24} md={6}>
        <Select
          className="w-full"
          placeholder="Silek employee"
          onChange={onEmployeeChange}
          allowClear
        >
          {users?.map(user => (
            <Select.Option key={user.id} value={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} md={6}>
        <Select
          className="w-full"
          placeholder="Select Department"
          onChange={onDepartmentChange}
          allowClear
        >
          {teams?.map(team => (
            <Select.Option key={team.id} value={team.id}>
              {team.departmentName}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} md={6}>
        <RangePicker
          className="w-full"
          onChange={dates => onDateRangeChange(dates)}
        />
      </Col>
    </Row>
  )
}
