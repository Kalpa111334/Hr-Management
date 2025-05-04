import { Api } from '@/core/trpc'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import type { ReportData } from '../types'

interface ReportFilters {
  employeeId?: string
  teamId?: string
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs]
  reportType: 'employee' | 'department' | 'monthly'
}

interface UseReportDataReturn {
  data: ReportData | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  transformData: (filters: ReportFilters) => ReportData
  calculateMetrics: {
    totalWorkHours: (attendances: any[]) => number
    averageEfficiency: (attendances: any[]) => number
    locationStats: (
      attendances: any[],
    ) => Array<{ location: string; frequency: number }>
  }
}

export const useReportData = (filters: ReportFilters): UseReportDataReturn => {
  const [error, setError] = useState<string | null>(null)
  const apiUtils = Api.useUtils()

  const {
    data: attendances,
    isLoading: isLoadingAttendances,
    refetch: refetchAttendances,
  } = Api.attendance.findMany.useQuery(
    {
      include: {
        user: true,
        location: true,
      },
      where: {
        ...(filters.employeeId && { userId: filters.employeeId }),
        ...(filters.teamId && {
          user: {
            teamMembers: { some: { teamId: filters.teamId } },
          },
        }),
        ...(filters.dateRange && {
          createdAt: {
            gte: filters.dateRange[0].toDate(),
            lte: filters.dateRange[1].toDate(),
          },
        }),
      },
    },
    {
      refetchInterval: 30000,
      cacheTime: 5 * 60 * 1000,
      staleTime: 1 * 60 * 1000,
      retry: 3,
      onError: err => setError(err.message),
    },
  )

  const { data: teams, isLoading: isLoadingTeams } = Api.team.findMany.useQuery(
    {
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
    },
    {
      refetchInterval: 30000,
      cacheTime: 5 * 60 * 1000,
      staleTime: 1 * 60 * 1000,
    },
  )

  const calculateMetrics = {
    totalWorkHours: useCallback((attendances: any[]) => {
      return attendances.reduce((total, attendance) => {
        if (attendance.checkInTime && attendance.checkOutTime) {
          return (
            total +
            dayjs(attendance.checkOutTime).diff(
              dayjs(attendance.checkInTime),
              'hour',
            )
          )
        }
        return total
      }, 0)
    }, []),

    averageEfficiency: useCallback((attendances: any[]) => {
      const onTimeCount = attendances.filter(a => a.status === 'ON_TIME').length
      return attendances.length > 0
        ? (onTimeCount / attendances.length) * 100
        : 0
    }, []),

    locationStats: useCallback((attendances: any[]): Array<{ location: string; frequency: number }> => {
      const stats = attendances.reduce(
        (acc: { [key: string]: number }, curr) => {
          const location = curr.location?.name || 'Unknown'
          acc[location] = (acc[location] || 0) + 1
          return acc
        },
        {},
      )

      return Object.entries(stats).map(([location, frequency]) => ({
        location,
        frequency: frequency as number,
      }))
    }, []),
  }

  const transformData = useCallback(
    (filters: ReportFilters): ReportData => {
      const filteredAttendances = attendances || []
      const workHours = calculateMetrics.totalWorkHours(filteredAttendances)
      const efficiency = calculateMetrics.averageEfficiency(filteredAttendances)
      const locationStats = calculateMetrics.locationStats(filteredAttendances)

      const baseMetrics = {
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        detailedMetrics: {
          workHours,
          breakTime: workHours * 0.125, // Assuming 1/8th of work time is break
          efficiency,
          locationStats,
        },
      }

      switch (filters.reportType) {
        case 'employee':
          return {
            type: 'employee',
            ...baseMetrics,
            data: filteredAttendances.map(attendance => ({
              type: 'employee' as const,
              Date: dayjs(attendance.createdAt).format('YYYY-MM-DD'),
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
            })),
          }

        case 'department':
          const teamData = teams?.find(t => t.id === filters.teamId)
          return {
            type: 'department',
            ...baseMetrics,
            data:
              teamData?.teamMembers.map(member => ({
                type: 'department' as const,
                Employee: member.user?.name || '-',
                'Attendance Rate': `${(
                  ((member.user?.attendances?.length || 0) / 20) *
                  100
                ).toFixed(1)}%`,
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
          }

        case 'monthly':
          return {
            type: 'monthly',
            ...baseMetrics,
            data: [
              {
                type: 'monthly' as const,
                Employee: '-',
                'Total Employees':
                  teams?.reduce(
                    (sum, team) => sum + (team.teamMembers?.length || 0),
                    0,
                  ) || 0,
                'Average Attendance Rate': `${(
                  (filteredAttendances.length / 20) *
                  100
                ).toFixed(1)}%`,
                'Total Late Arrivals': filteredAttendances.filter(
                  a => a.status === 'LATE',
                ).length,
                'Total Overtime Hours': filteredAttendances.reduce(
                  (total, a) => {
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
                  },
                  0,
                ),
              },
            ],
          }
      }
    },
    [attendances, teams, calculateMetrics],
  )

  const refetch = useCallback(() => {
    refetchAttendances()
  }, [refetchAttendances])

  return {
    data: attendances ? transformData(filters) : null,
    isLoading: isLoadingAttendances || isLoadingTeams,
    error,
    refetch,
    transformData,
    calculateMetrics,
  }
}
