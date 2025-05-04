import { ColumnType } from 'antd/es/table'

type EmployeeData = {
  type: 'employee'
  Date: string
  'Check In': string
  'Check Out': string
  'Overtime Hours': number
  Status: string
}

type DepartmentData = {
  type: 'department'
  Employee: string
  'Attendance Rate': string
  'Late Arrivals': number
  'Leave Days': number
}

type MonthlyData = {
  type: 'monthly'
  Employee: string
  'Total Employees': number
  'Average Attendance Rate': string
  'Total Late Arrivals': number
  'Total Overtime Hours': number
}

export type ReportData = {
  type: 'employee' | 'department' | 'monthly'
  data: Array<EmployeeData | DepartmentData | MonthlyData>
}

export type ReportColumn = ColumnType<
  EmployeeData | DepartmentData | MonthlyData
>
