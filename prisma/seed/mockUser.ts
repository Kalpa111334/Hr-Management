import { PrismaClient } from '@prisma/client'
import Bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const hashPassword = (password: string) => {
  const saltRounds = 10
  const salt = Bcrypt.genSaltSync(saltRounds)
  const passwordHashed = Bcrypt.hashSync(password, salt)
  return passwordHashed
}

const splitSql = (sql: string) => {
  return sql.split(';').filter(content => content.trim() !== '')
}

async function main() {
  const password = 'password123'
  const hashedPassword = hashPassword(password)

  const sql = `
INSERT INTO "User" (
  "id",
  "email", 
  "name", 
  "globalRole",
  "pictureUrl", 
  "password",
  "status"
) VALUES (
  '21a857f1-ba5f-4435-bcf6-f910ec07c0dc',
  'test@test.com',
  'John Doe',
  'ADMIN',
  'https://i.imgur.com/sdjqd62.jpeg',
  '${hashedPassword}',
  'VERIFIED'
);
`

  const sqls = splitSql(sql)

  for (const sql of sqls) {
    try {
      await prisma.$executeRawUnsafe(`${sql}`)
    } catch (error) {
      console.log(`Could not insert SQL: ${error.message}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
