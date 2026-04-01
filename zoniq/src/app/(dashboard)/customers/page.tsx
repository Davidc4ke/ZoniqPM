import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { eq, isNull, and, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { CustomerList } from '@/components/features/customers/customer-list'

export default async function CustomersPage() {
  const { userId, orgId } = await auth()
  if (!userId) redirect('/sign-in')

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const roles = (user.privateMetadata?.roles as string[]) || ['consultant']
  const canEdit = roles.includes('admin') || roles.includes('pm')
  const organizationId = orgId || 'default'

  const results = await db
    .select({
      id: customers.id,
      organizationId: customers.organizationId,
      name: customers.name,
      description: customers.description,
      createdAt: customers.createdAt,
      updatedAt: customers.updatedAt,
      deletedAt: customers.deletedAt,
      appCount: sql<number>`0`,
    })
    .from(customers)
    .where(and(eq(customers.organizationId, organizationId), isNull(customers.deletedAt)))
    .orderBy(customers.name)

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-8">
      <CustomerList initialCustomers={results} canEdit={canEdit} />
    </div>
  )
}
