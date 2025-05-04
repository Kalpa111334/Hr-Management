import { useUserContext } from '@/core/context'
import { PageLayout } from '@/designSystem'
import { ErrorBoundary } from '@/designSystem/core'
import { Alert, Button, Skeleton, Typography } from 'antd'
import { EmployeeDashboard } from './components/EmployeeDashboard'
import { NewAdminDashboard } from './components/NewAdminDashboard'
import { useAttendanceData } from './hooks/useAttendanceData'
import { useTeamData } from './hooks/useTeamData'

const { Title } = Typography

/**
 * HomePage Component
 *
 * Main dashboard component that displays either admin or employee view based on user role.
 * Features:
 * - Real-time attendance tracking
 * - Leave management overview
 * - Team performance metrics for admins
 * - Personal attendance statistics for employees
 */
export default function HomePage() {
  const { checkRole } = useUserContext()
  const {
    attendance: userAttendance,
    leaves: leaveRequests,
    isLoading,
    error,
    metrics,
    refresh,
  } = useAttendanceData()

  const {
    teams: allTeams,
    members: teamMembers,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useTeamData()

  return (
    <ErrorBoundary>
      <PageLayout layout="full-width">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={2}>
              <i className="las la-tachometer-alt"></i>
              {checkRole('ADMIN') ? 'Admin Dashboard' : 'Employee Dashboard'}
            </Title>
            <Button
              type="primary"
              icon={<i className="las la-sync"></i>}
              onClick={refresh}
              loading={isLoading || isLoadingTeams}
            >
              Refresh
            </Button>
          </div>

          {(error || teamsError) && (
            <Alert
              message="Error"
              description="Failed to fetch data. Please try again."
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {isLoading || isLoadingTeams ? (
            <div className="space-y-4">
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </div>
          ) : (
            <>
              {checkRole('ADMIN') ? (
                <NewAdminDashboard
                  allTeams={allTeams}
                  teamMembers={teamMembers}
                  attendance={userAttendance}
                  leaves={leaveRequests}
                  metrics={metrics}
                />
              ) : (
                <EmployeeDashboard
                  userAttendance={userAttendance}
                  leaveRequests={leaveRequests}
                  weeklyAttendanceRate={metrics.weeklyRate}
                  monthlyLeaves={metrics.monthlyLeaves}
                  overtimeHours={metrics.overtimeHours}
                  lateArrivals={metrics.lateArrivals}
                  teamMembers={teamMembers}
                />
              )}
            </>
          )}
        </div>
      </PageLayout>
    </ErrorBoundary>
  )
}
