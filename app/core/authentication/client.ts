import { z } from 'zod'
import { AuthenticationClient as AuthClient } from './client/index'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']).optional(),
})

export type LoginInput = {
  email: string
  password: string
  role?: 'ADMIN' | 'USER'
}

export const AuthenticationClient = AuthClient
