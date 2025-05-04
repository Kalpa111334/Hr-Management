import { Api } from '@/core/trpc'

interface MigrationSummary {
  total: number
  successful: number
  failed: number
  errors: Array<{ id: string; error: string }>
}

export const migrateLeaveTypes = async (): Promise<MigrationSummary> => {
  const summary: MigrationSummary = {
    total: 0,
    successful: 0,
    failed: 0,
    errors: [],
  }

  const apiUtils = Api.useUtils()

  try {
    // Fetch all leave types from source
    console.log('Fetching leave types from source...')
    const sourceLeaveTypes = await apiUtils.leaveType.findMany.fetch()
    if (!sourceLeaveTypes) {
      throw new Error('Failed to fetch source leave types')
    }

    summary.total = sourceLeaveTypes.length
    console.log(`Found ${sourceLeaveTypes.length} leave types to migrate`)

    // Create mutation hook
    const { mutateAsync: createLeaveType } = Api.leaveType.create.useMutation()

    // Migrate each leave type
    for (const leaveType of sourceLeaveTypes) {
      try {
        console.log(
          `[${summary.successful + 1}/${summary.total}] Migrating leave type: ${
            leaveType.name
          }`,
        )

        await createLeaveType({
          data: {
            name: leaveType.name,
            description: leaveType.description,
            daysAllowed: leaveType.daysAllowed,
            carryForward: leaveType.carryForward,
            documentRequired: leaveType.documentRequired,
          },
        })

        summary.successful++
        console.log(`✓ Successfully migrated leave type: ${leaveType.name}`)
      } catch (error) {
        summary.failed++
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        summary.errors.push({
          id: leaveType.id,
          error: errorMessage,
        })
        console.error(
          `✗ Failed to migrate leave type ${leaveType.name}:`,
          errorMessage,
        )
      }

      // Log progress percentage
      const progress =
        ((summary.successful + summary.failed) / summary.total) * 100
      console.log(`Progress: ${progress.toFixed(2)}%`)
    }

    // Output migration summary
    console.log('\n=== Migration Summary ===')
    console.log(`Total leave types: ${summary.total}`)
    console.log(`Successfully migrated: ${summary.successful}`)
    console.log(`Failed to migrate: ${summary.failed}`)
    console.log(
      `Success rate: ${((summary.successful / summary.total) * 100).toFixed(
        2,
      )}%`,
    )

    if (summary.errors.length > 0) {
      console.log('\nDetailed Error Log:')
      summary.errors.forEach(({ id, error }) => {
        console.log(`- Leave type ${id}: ${error}`)
      })
    }

    return summary
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Migration failed:', errorMessage)
    throw new Error(`Migration script failed: ${errorMessage}`)
  }
}
