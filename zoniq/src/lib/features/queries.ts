import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { features } from '@/lib/db/schema'
import type { Feature, CreateFeatureInput, UpdateFeatureInput } from '@/types/feature'

function toFeature(row: typeof features.$inferSelect): Feature {
  return {
    id: row.id,
    moduleId: row.moduleId,
    appId: row.appId,
    name: row.name,
    description: row.description,
    // linkedStoriesCount is 0 until stories table exists (Epic 4)
    linkedStoriesCount: 0,
    isDeleted: row.isDeleted,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getFeaturesByModuleId(moduleId: string): Promise<Feature[]> {
  const rows = await db
    .select()
    .from(features)
    .where(and(eq(features.moduleId, moduleId), eq(features.isDeleted, false)))

  return rows.map(toFeature)
}

export async function getFeatureById(id: string): Promise<Feature | undefined> {
  const [row] = await db
    .select()
    .from(features)
    .where(and(eq(features.id, id), eq(features.isDeleted, false)))

  if (!row) return undefined
  return toFeature(row)
}

export async function createFeature(
  moduleId: string,
  appId: string,
  input: CreateFeatureInput
): Promise<Feature> {
  const now = new Date()
  const [row] = await db
    .insert(features)
    .values({
      moduleId,
      appId,
      name: input.name,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return toFeature(row)
}

export async function updateFeature(
  id: string,
  input: UpdateFeatureInput
): Promise<Feature | undefined> {
  const existing = await db
    .select()
    .from(features)
    .where(and(eq(features.id, id), eq(features.isDeleted, false)))

  if (existing.length === 0) return undefined

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (input.name !== undefined) updates.name = input.name
  if (input.description !== undefined) updates.description = input.description ?? null

  const [row] = await db
    .update(features)
    .set(updates)
    .where(eq(features.id, id))
    .returning()

  return toFeature(row)
}

export async function deleteFeature(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const [existing] = await db
    .select()
    .from(features)
    .where(and(eq(features.id, id), eq(features.isDeleted, false)))

  if (!existing) {
    return { success: false, error: 'Feature not found' }
  }

  // linkedStoriesCount check — currently always 0 until stories table exists
  await db
    .update(features)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(features.id, id))

  return { success: true }
}
