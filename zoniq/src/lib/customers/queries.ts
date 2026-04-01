import { eq, and, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customers, apps } from '@/lib/db/schema'
import type { Customer, CreateCustomerInput, UpdateCustomerInput } from '@/types/customer'

function toCustomer(
  row: typeof customers.$inferSelect,
  linkedAppsCount: number
): Customer {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    organizationId: row.organizationId,
    isDeleted: row.isDeleted,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    linkedAppsCount,
  }
}

export async function getCustomers(): Promise<Customer[]> {
  const rows = await db
    .select({
      customer: customers,
      linkedAppsCount: sql<number>`cast(count(${apps.id}) as int)`,
    })
    .from(customers)
    .leftJoin(
      apps,
      and(eq(apps.customerId, customers.id), eq(apps.isDeleted, false))
    )
    .where(eq(customers.isDeleted, false))
    .groupBy(customers.id)

  return rows.map((r) => toCustomer(r.customer, r.linkedAppsCount))
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const rows = await db
    .select({
      customer: customers,
      linkedAppsCount: sql<number>`cast(count(${apps.id}) as int)`,
    })
    .from(customers)
    .leftJoin(
      apps,
      and(eq(apps.customerId, customers.id), eq(apps.isDeleted, false))
    )
    .where(and(eq(customers.id, id), eq(customers.isDeleted, false)))
    .groupBy(customers.id)

  if (rows.length === 0) return undefined
  return toCustomer(rows[0].customer, rows[0].linkedAppsCount)
}

export async function createCustomer(
  input: CreateCustomerInput,
  organizationId: string
): Promise<Customer> {
  const now = new Date()
  const [row] = await db
    .insert(customers)
    .values({
      name: input.name,
      description: input.description ?? null,
      organizationId,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return toCustomer(row, 0)
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<Customer | undefined> {
  const existing = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.isDeleted, false)))

  if (existing.length === 0) return undefined

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (input.name !== undefined) updates.name = input.name
  if (input.description !== undefined) updates.description = input.description ?? null

  const [row] = await db
    .update(customers)
    .set(updates)
    .where(eq(customers.id, id))
    .returning()

  // Get linked apps count
  const [countResult] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(apps)
    .where(and(eq(apps.customerId, id), eq(apps.isDeleted, false)))

  return toCustomer(row, countResult.count)
}

export async function deleteCustomer(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const existing = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.isDeleted, false)))

  if (existing.length === 0) {
    return { success: false, error: 'Customer not found' }
  }

  // Check for linked apps
  const [countResult] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(apps)
    .where(and(eq(apps.customerId, id), eq(apps.isDeleted, false)))

  if (countResult.count > 0) {
    return {
      success: false,
      error: 'Cannot delete customer with linked apps. Remove all apps first.',
    }
  }

  await db
    .update(customers)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(customers.id, id))

  return { success: true }
}
