import { eq, and, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { apps, customers, modules } from '@/lib/db/schema'
import type { App, CreateAppInput, UpdateAppInput } from '@/types/app'

function toApp(
  row: typeof apps.$inferSelect,
  customerName: string,
  modulesCount: number,
  linkedProjectsCount: number
): App {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    customerId: row.customerId,
    customerName,
    mendixAppId: row.mendixAppId,
    version: row.version,
    status: row.status,
    organizationId: row.organizationId,
    isDeleted: row.isDeleted,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    linkedProjectsCount,
    modulesCount,
  }
}

export async function getApps(customerId?: string): Promise<App[]> {
  const conditions = [eq(apps.isDeleted, false)]
  if (customerId) {
    conditions.push(eq(apps.customerId, customerId))
  }

  const rows = await db
    .select({
      app: apps,
      customerName: customers.name,
      modulesCount: sql<number>`cast(count(${modules.id}) as int)`,
    })
    .from(apps)
    .innerJoin(customers, eq(customers.id, apps.customerId))
    .leftJoin(
      modules,
      and(eq(modules.appId, apps.id), eq(modules.isDeleted, false))
    )
    .where(and(...conditions))
    .groupBy(apps.id, customers.name)

  // linkedProjectsCount is 0 until projects table exists (Epic 4)
  return rows.map((r) => toApp(r.app, r.customerName, r.modulesCount, 0))
}

export async function getAppById(id: string): Promise<App | undefined> {
  const rows = await db
    .select({
      app: apps,
      customerName: customers.name,
      modulesCount: sql<number>`cast(count(${modules.id}) as int)`,
    })
    .from(apps)
    .innerJoin(customers, eq(customers.id, apps.customerId))
    .leftJoin(
      modules,
      and(eq(modules.appId, apps.id), eq(modules.isDeleted, false))
    )
    .where(and(eq(apps.id, id), eq(apps.isDeleted, false)))
    .groupBy(apps.id, customers.name)

  if (rows.length === 0) return undefined
  return toApp(rows[0].app, rows[0].customerName, rows[0].modulesCount, 0)
}

export async function createApp(
  input: CreateAppInput,
  organizationId: string
): Promise<App | { error: string }> {
  // Check customer exists
  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, input.customerId), eq(customers.isDeleted, false)))

  if (!customer) {
    return { error: 'Customer not found' }
  }

  const now = new Date()
  const [row] = await db
    .insert(apps)
    .values({
      name: input.name,
      description: input.description ?? null,
      customerId: input.customerId,
      mendixAppId: input.mendixAppId,
      organizationId,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return toApp(row, customer.name, 0, 0)
}

export async function updateApp(
  id: string,
  input: UpdateAppInput
): Promise<App | undefined> {
  const existing = await db
    .select()
    .from(apps)
    .where(and(eq(apps.id, id), eq(apps.isDeleted, false)))

  if (existing.length === 0) return undefined

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (input.name !== undefined) updates.name = input.name
  if (input.description !== undefined) updates.description = input.description ?? null
  if (input.version !== undefined) updates.version = input.version
  if (input.status !== undefined) updates.status = input.status

  const [row] = await db
    .update(apps)
    .set(updates)
    .where(eq(apps.id, id))
    .returning()

  // Get customer name and modules count
  const [customer] = await db
    .select({ name: customers.name })
    .from(customers)
    .where(eq(customers.id, row.customerId))

  const [modCount] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(modules)
    .where(and(eq(modules.appId, id), eq(modules.isDeleted, false)))

  return toApp(row, customer.name, modCount.count, 0)
}

export async function deleteApp(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const existing = await db
    .select()
    .from(apps)
    .where(and(eq(apps.id, id), eq(apps.isDeleted, false)))

  if (existing.length === 0) {
    return { success: false, error: 'App not found' }
  }

  // linkedProjectsCount is always 0 until projects table exists
  await db
    .update(apps)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(apps.id, id))

  return { success: true }
}

export async function getLinkedAppsCount(customerId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(apps)
    .where(and(eq(apps.customerId, customerId), eq(apps.isDeleted, false)))

  return result.count
}
