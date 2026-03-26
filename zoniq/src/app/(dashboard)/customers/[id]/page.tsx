import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { eq, isNull, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { CustomerDetail } from '@/components/features/customers/customer-detail'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId, orgId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const roles = (user.privateMetadata?.roles as string[]) || ['consultant']
  const canEdit = roles.includes('admin') || roles.includes('pm')
  const organizationId = orgId || 'default'

  const [customer] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, id),
        eq(customers.organizationId, organizationId),
        isNull(customers.deletedAt)
      )
    )

  if (!customer) notFound()

  // TODO: When apps table exists, query linked apps
  const apps: Array<{ id: string; name: string }> = []

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-8">
      <CustomerDetail customer={customer} apps={apps} canEdit={canEdit} />
    </div>
  )
}
