import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import dayjs from 'dayjs'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}

interface DepartmentStat {
  department: string;
  rate: number;
}

interface TeamAttendanceRate {
  teamId: string;
  departmentName: string;
  rate: number;
}

interface AttendanceMetrics {
  weeklyRate: number;
  monthlyLeaves: number;
  pendingLeaves: number;
  overtimeHours: number;
  lateArrivals: number;
  departmentStats: DepartmentStat[];
  teamAttendanceRates: TeamAttendanceRate[];
  recentActivities: Array<{
    id: string;
    type: 'attendance' | 'leave';
    userId: string;
    userName: string;
    timestamp: string;
    status: string;
  }>;
}

export const useAttendanceData = () => {
  const { user } = useUserContext()

  // Fetch current user's attendance with shift info
  const {
    data: attendance,
    isLoading: isLoadingAttendance,
    error: attendanceError,
    refetch: refetchAttendance,
  } = Api.attendance.findMany.useQuery(
    {
      where: { userId: user?.id },
      orderBy: { createdAt: 'desc' },
      include: {
        location: true,
        user: {
          include: {
            teamMembers: {
              include: {
                team: {
                  include: {
                    shift: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      retry: 3,
      retryDelay: 1000,
    },
  )

  // Fetch user's leave requests
  const {
    data: leaves,
    isLoading: isLoadingLeaves,
    error: leavesError,
    refetch: refetchLeaves,
  } = Api.leaveRequest.findMany.useQuery(
    {
      where: { userId: user?.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { user: true },
    },
    {
      retry: 3,
      retryDelay: 1000,
    },
  )

  const calculateWeeklyAttendanceRate = () => {
    if (!attendance) return 0
    const oneWeekAgo = dayjs().subtract(7, 'day')
    const weeklyAttendances = attendance.filter(a =>
      dayjs(a.createdAt).isAfter(oneWeekAgo),
    )
    return ((weeklyAttendances.length || 0) / 7) * 100
  }

  const calculateMonthlyLeaves = () => {
    if (!leaves) return 0
    const oneMonthAgo = dayjs().subtract(1, 'month')
    return leaves.filter(
      l => dayjs(l.startDate).isAfter(oneMonthAgo) && l.status === 'APPROVED',
    ).length
  }

  const calculatePendingLeaves = () => {
    if (!leaves) return 0
    return leaves.filter(l => l.status === 'PENDING').length
  }

  const calculateDepartmentAttendance = () => {
    if (!attendance) return []
    const departments = new Map<string, { total: number; present: number }>()
    
    attendance.forEach(record => {
      const department = record.user?.teamMembers?.[0]?.team?.departmentName
      if (!department) return

      const current = departments.get(department) || { total: 0, present: 0 }
      departments.set(department, {
        total: current.total + 1,
        present: current.present + (record.status === 'PRESENT' ? 1 : 0),
      })
    })

    return Array.from(departments.entries()).map(([name, stats]) => ({
      department: name,
      rate: (stats.present / stats.total) * 100,
    }))
  }

  const calculateTeamAttendanceRates = () => {
    if (!attendance) return []
    const teams = new Map<string, { id: string, name: string, total: number; present: number }>()
    
    attendance.forEach(record => {
      const team = record.user?.teamMembers?.[0]?.team
      if (!team?.id || !team.departmentName) return

      const current = teams.get(team.id) || { 
        id: team.id,
        name: team.departmentName,
        total: 0, 
        present: 0 
      }
      teams.set(team.id, {
        ...current,
        total: current.total + 1,
        present: current.present + (record.status === 'PRESENT' ? 1 : 0),
      })
    })

    return Array.from(teams.values()).map(stats => ({
      teamId: stats.id,
      departmentName: stats.name,
      rate: (stats.present / stats.total) * 100,
    }))
  }

  const getRecentActivities = () => {
    if (!attendance || !leaves) return []
    
    const attendanceActivities = attendance.map(record => ({
      id: record.id,
      type: 'attendance' as const,
      userId: record.userId || '',
      userName: record.user?.name || '',
      timestamp: record.createdAt,
      status: record.status || '',
    }))

    const leaveActivities = leaves.map(record => ({
      id: record.id,
      type: 'leave' as const, 
      userId: record.userId || '',
      userName: record.user?.name || '',
      timestamp: record.createdAt,
      status: record.status || '',
    }))

    return [...attendanceActivities, ...leaveActivities]
      .sort((a, b) => dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix())
  }

  const calculateOvertimeHours = () => {
    if (!attendance) return 0
    return attendance.reduce((total, record) => {
      if (!record?.checkInTime || !record?.checkOutTime) return total
      const shift = record.user?.teamMembers?.[0]?.team?.shift
      if (!shift?.endTime || !shift.overtimeThreshold) return total

      const checkOut = dayjs(record.checkOutTime, 'HH:mm')
      const shiftEnd = dayjs(shift.endTime, 'HH:mm')
      const overtime = checkOut.diff(shiftEnd, 'hour', true)

      return overtime > shift.overtimeThreshold ? total + overtime : total
    }, 0)
  }

  const calculateLateArrivals = () => {
    if (!attendance) return 0
    return attendance.filter(record => {
      if (!record?.checkInTime) return false
      const shift = record.user?.teamMembers?.[0]?.team?.shift
      if (!shift?.startTime) return false

      return dayjs(record.checkInTime, 'HH:mm').isAfter(
        dayjs(shift.startTime, 'HH:mm'),
      )
    }).length
  }

  const refresh = () => {
    refetchAttendance()
    refetchLeaves()
  }

  return {
    attendance,
    leaves,
    isLoading: isLoadingAttendance || isLoadingLeaves,
    error: attendanceError
      ? getErrorMessage(attendanceError)
      : leavesError
      ? getErrorMessage(leavesError)
      : null,
    metrics: {
      weeklyRate: calculateWeeklyAttendanceRate(),
      monthlyLeaves: calculateMonthlyLeaves(),
      pendingLeaves: calculatePendingLeaves(),
      overtimeHours: calculateOvertimeHours(),
      lateArrivals: calculateLateArrivals(),
      departmentStats: calculateDepartmentAttendance(),
      teamAttendanceRates: calculateTeamAttendanceRates(),
      recentActivities: getRecentActivities(),
    },
    refresh,
    calculateOvertimeHours,
  }
}
