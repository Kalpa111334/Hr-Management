import { Api } from '@/core/trpc'
import { User } from '@prisma/client'
import { ReactNode, createContext, useContext } from 'react'

const ADMIN_ONLY_PAGES = ['team', 'reports', 'settings']

/**
 * @provider useUserContext
 * @description A provider to get the relevant user context
 * @attribute {(roleName: string) => boolean} checkRole - Check if the logged user match the globalRole of the user for example ADMIN or USER
 * @attribute {boolean} isLoggedIn - Wether the user is authenticated or not
 * @attribute {User} user - The user object, user.id to access the id for example
 * @usage  const {user, checkRole} = useUserContext(); // then you can access the id, name, email like that 'const userId = user?.id'
 * @import import { useUserContext } from '@/core/context'
 */

type AuthenticationStatus = 'unauthenticated' | 'loading' | 'authenticated'

type UserContextType = {
  user: User
  checkRole: (roleName: string) => boolean
  checkPageAccess: (pathname: string) => boolean
  refetch: () => void
  authenticationStatus: AuthenticationStatus
  isLoggedIn: boolean
  isLoading: boolean
}

const UserContext = createContext<UserContextType>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: session,
    refetch,
    ...querySession
  } = Api.authentication.session.useQuery()

  const user = session?.user

  const checkRole = (roleName: string) => {
    return !!(user?.globalRole === roleName)
  }

  const checkPageAccess = (pathname: string) => {
    const pageName = pathname.split('/').pop() || ''
    if (ADMIN_ONLY_PAGES.includes(pageName) && user?.globalRole !== 'ADMIN') {
      return false
    }
    return true
  }

  const isLoading = querySession.isLoading

  const isLoggedIn = !!session?.user

  let status: AuthenticationStatus = 'unauthenticated'

  if (isLoading) {
    status = 'loading'
  } else if (isLoggedIn) {
    status = 'authenticated'
  }

  return (
    <UserContext.Provider
      value={{
        user: session?.user,
        checkRole,
        checkPageAccess,
        refetch,
        authenticationStatus: status,
        isLoggedIn,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }

  return context
}
