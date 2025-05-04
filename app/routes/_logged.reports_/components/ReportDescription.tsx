import { Typography } from 'antd'
const { Text } = Typography

interface ReportDescriptionProps {
  reportType: 'employee' | 'department' | 'monthly'
}

export const ReportDescription: React.FC<ReportDescriptionProps> = ({
  reportType,
}) => {
  const descriptions = {
    employee:
      'Track individual attendance, including check-in times, overtime, and attendance status',
    department:
      'View team-wide metrics like attendance rates, late arrivals, and leave days',
    monthly:
      'See company overview with total employees, average attendance, and overtime statistics',
  }

  return (
    <div className="mb-4">
      <Text type="secondary">{descriptions[reportType]}</Text>
    </div>
  )
}
