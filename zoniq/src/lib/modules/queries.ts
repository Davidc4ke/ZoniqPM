import { eq, and, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { modules, features } from '@/lib/db/schema'
import type { Module, CreateModuleInput, UpdateModuleInput } from '@/types/module'

function toModule(
  row: typeof modules.$inferSelect,
  featuresCount: number
): Module {
  return {
    id: row.id,
    appId: row.appId,
    name: row.name,
    description: row.description,
    featuresCount,
    isDeleted: row.isDeleted,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getModulesByAppId(appId: string): Promise<Module[]> {
  const rows = await db
    .select({
      module: modules,
      featuresCount: sql<number>`cast(count(${features.id}) as int)`,
    })
    .from(modules)
    .leftJoin(
      features,
      and(eq(features.moduleId, modules.id), eq(features.isDeleted, false))
    )
    .where(and(eq(modules.appId, appId), eq(modules.isDeleted, false)))
    .groupBy(modules.id)

  return rows.map((r) => toModule(r.module, r.featuresCount))
}

export async function getModuleById(id: string): Promise<Module | undefined> {
  const rows = await db
    .select({
      module: modules,
      featuresCount: sql<number>`cast(count(${features.id}) as int)`,
    })
    .from(modules)
    .leftJoin(
      features,
      and(eq(features.moduleId, modules.id), eq(features.isDeleted, false))
    )
    .where(and(eq(modules.id, id), eq(modules.isDeleted, false)))
    .groupBy(modules.id)

  if (rows.length === 0) return undefined
  return toModule(rows[0].module, rows[0].featuresCount)
}

export async function createModule(
  appId: string,
  input: CreateModuleInput
): Promise<Module> {
  const now = new Date()
  const [row] = await db
    .insert(modules)
    .values({
      appId,
      name: input.name,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return toModule(row, 0)
}

export async function updateModule(
  id: string,
  input: UpdateModuleInput
): Promise<Module | undefined> {
  const existing = await db
    .select()
    .from(modules)
    .where(and(eq(modules.id, id), eq(modules.isDeleted, false)))

  if (existing.length === 0) return undefined

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (input.name !== undefined) updates.name = input.name
  if (input.description !== undefined) updates.description = input.description ?? null

  const [row] = await db
    .update(modules)
    .set(updates)
    .where(eq(modules.id, id))
    .returning()

  const [countResult] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(features)
    .where(and(eq(features.moduleId, id), eq(features.isDeleted, false)))

  return toModule(row, countResult.count)
}

export async function deleteModule(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const existing = await db
    .select()
    .from(modules)
    .where(and(eq(modules.id, id), eq(modules.isDeleted, false)))

  if (existing.length === 0) {
    return { success: false, error: 'Module not found' }
  }

  await db
    .update(modules)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(modules.id, id))

  return { success: true }
}
