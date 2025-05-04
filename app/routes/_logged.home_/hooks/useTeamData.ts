import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { Prisma } from '@prisma/client'
import { UseQueryOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}

export interface TeamMetrics {
  presentEmployees: number
  presentTeams: number
  onLeave: number
  totalRegistered: number
  activeTeamsCount: number
  teamMembersCount: number
  teams: TeamWithRelations[]
  members: TeamWithRelations['teamMembers']
}

type TeamWithRelations = Prisma.TeamGetPayload<{
  include: {
    teamMembers: {
      include: {
        user: {
          include: {
            attendances: true
            leaveRequests: true
          }
        }
      }
    }
  }
}>

export const useTeamData = (): TeamMetrics & {
  isLoading: boolean
  error: string | null
} => {
  const { checkRole } = useUserContext()

  const {
    data: teams,
    isLoading,
    error: teamsError,
  } = Api.team.findMany.useQuery(
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
      enabled: checkRole('ADMIN') || checkRole('USER'),
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay: 1000,
      onError: error => {
        console.error('Team data fetch failed:', error)
        return null
      },
    } as UseQueryOptions<any, any, any, any>,
  )

  const today = dayjs()

  const presentEmployees =
    teams?.reduce((count, team) => {
      return (
        count +
        (team.teamMembers?.filter(
          member =>
            member?.user?.status === 'VERIFIED' &&
            member?.user?.attendances?.some(
              attendance =>
                attendance?.status === 'PRESENT' &&
                dayjs(attendance.createdAt).format('YYYY-MM-DD') ===
                  today.format('YYYY-MM-DD'),
            ),
        )?.length || 0)
      )
    }, 0) ?? 0

  const presentTeams =
    teams?.filter(team =>
      team.teamMembers?.some(
        member =>
          member?.user?.status === 'VERIFIED' &&
          member?.user?.attendances?.some(
            attendance =>
              attendance?.status === 'PRESENT' &&
              dayjs(attendance.createdAt).format('YYYY-MM-DD') ===
                today.format('YYYY-MM-DD'),
          ),
      ),
    )?.length ?? 0

  const onLeave =
    teams?.reduce((count, team) => {
      return (
        count +
        (team.teamMembers?.filter(member =>
          member?.user?.leaveRequests?.some(
            leave =>
              leave?.status === 'APPROVED' &&
              today.isBetween(
                dayjs(leave.startDate),
                dayjs(leave.endDate),
                'day',
                '[]',
              ),
          ),
        )?.length || 0)
      )
    }, 0) ?? 0

  const totalRegistered =
    teams?.reduce((uniqueUsers, team) => {
      team.teamMembers?.forEach(member => {
        if (member?.user?.status === 'VERIFIED' && member?.user?.id) {
          uniqueUsers.add(member.user.id)
        }
      })
      return uniqueUsers
    }, new Set<string>())?.size ?? 0

  const activeTeamsCount =
    teams?.filter(team =>
      team.teamMembers?.some(member => member?.user?.status === 'VERIFIED'),
    )?.length ?? 0

  const teamMembersCount =
    teams?.reduce((count, team) => {
      return (
        count +
        (team.teamMembers?.filter(member => member?.user?.status === 'VERIFIED')
          ?.length ?? 0)
      )
    }, 0) ?? 0

  return {
    presentEmployees,
    presentTeams,
    onLeave,
    totalRegistered,
    activeTeamsCount,
    teamMembersCount,
    teams: teams ?? [],
    members: teams?.flatMap(team => team.teamMembers) ?? [],
    isLoading,
    error: teamsError ? getErrorMessage(teamsError) : null,
  }
}
