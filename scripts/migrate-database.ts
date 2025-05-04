import { PrismaClient } from '@prisma/client'

// Initialize source and target database clients
const sourceDb = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: ['error', 'warn'],
})

const targetDb = new PrismaClient({
  datasourceUrl: process.env.SERVER_DATABASE_URL,
  log: ['error', 'warn'],
})

// Define model dependencies order based on relationships
const migrationOrder = [
  'User',
  'WorkShift',
  'LeaveType',
  'OfficeLocation',
  'Team',
  'TeamMember',
  'Attendance',
  'LeaveRequest',
] as const

export async function migrateData(): Promise<{
  success: boolean
  error?: string
  duration?: number
}> {
  console.log('Starting database migration...')
  const startTime = Date.now()

  try {
    // Migrate each model in order
    for (const model of migrationOrder) {
      console.log(`\nMigrating ${model} records...`)
      const modelLower = model.charAt(0).toLowerCase() + model.slice(1)

      try {
        // Fetch all records from source with relationships
        const records = await sourceDb[modelLower].findMany({
          include: {
            ...(model === 'User' && {
              teamsAsManager: true,
              teamMembers: true,
              attendances: true,
              leaveRequests: true,
            }),
            ...(model === 'Team' && {
              manager: true,
              shift: true,
              teamMembers: true,
            }),
            ...(model === 'TeamMember' && {
              team: true,
              user: true,
            }),
            ...(model === 'Attendance' && {
              user: true,
              location: true,
            }),
            ...(model === 'LeaveRequest' && {
              user: true,
              leaveType: true,
            }),
          },
        })
        console.log(`Found ${records.length} ${model} records`)

        // Insert records into target
        let successCount = 0
        let errorCount = 0

        for (const record of records) {
          try {
            // Remove metadata and relationship objects while preserving IDs
            const { id, createdAt, updatedAt, ...data } = record
            const cleanData = Object.entries(data).reduce(
              (acc, [key, value]) => {
                // Keep only ID references from relationship fields
                if (value && typeof value === 'object') {
                  if ('id' in value) {
                    acc[key + 'Id'] = value.id
                  }
                } else {
                  acc[key] = value
                }
                return acc
              },
              {} as Record<string, any>,
            )

            await targetDb[modelLower].create({
              data: {
                id,
                ...cleanData,
              },
            })
            successCount++
          } catch (err) {
            console.error(`Failed to migrate ${model} record:`, err)
            errorCount++
          }
        }

        console.log(`${model} migration complete:`)
        console.log(`- Successfully migrated: ${successCount}`)
        console.log(`- Failed to migrate: ${errorCount}`)

        if (errorCount > 0) {
          throw new Error(`Failed to migrate ${errorCount} ${model} records`)
        }
      } catch (err) {
        console.error(`Error migrating ${model}:`, err)
        throw err
      }
    }

    const duration = Date.now() - startTime
    console.log(`\nMigration completed successfully in ${duration}ms!`)
    return { success: true, duration }
  } catch (err) {
    const error = `Migration failed: ${err}`
    console.error(error)
    return { success: false, error, duration: Date.now() - startTime }
  } finally {
    await Promise.all([sourceDb.$disconnect(), targetDb.$disconnect()])
  }
}

export const migrateDatabaseScript = migrateData
