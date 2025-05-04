import { PrismaClient } from '@prisma/client'
import Bcrypt from 'bcryptjs'

const hashPassword = (password: string) => {
  const saltRounds = 10
  const salt = Bcrypt.genSaltSync(saltRounds)
  const passwordHashed = Bcrypt.hashSync(password, salt)
  return passwordHashed
}

export async function seedAdmin() {
  const prisma = new PrismaClient()

  try {
    const adminPassword = 'Admin123!' // Secure password with special chars and numbers
    const hashedPassword = hashPassword(adminPassword)

    await prisma.user.create({
      data: {
        email: 'admin@company.com',
        name: 'System Admin',
        globalRole: 'ADMIN',
        status: 'VERIFIED',
        password: hashedPassword,
      },
    })

    console.log('Admin user created successfully')
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
