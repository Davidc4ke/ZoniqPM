import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { environments } from '@/lib/db/schema'
import type {
  Environment,
  CreateEnvironmentInput,
  UpdateEnvironmentInput,
} from '@/types/environment'

function toEnvironment(row: typeof environments.$inferSelect): Environment {
  return {
    id: row.id,
    appId: row.appId,
    name: row.name,
    url: row.url,
    status: row.status,
    version: row.version,
    lastPing: row.lastPing.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getEnvironmentsByAppId(appId: string): Promise<Environment[]> {
  const rows = await db
    .select()
    .from(environments)
    .where(eq(environments.appId, appId))

  return rows.map(toEnvironment)
}

export async function getEnvironmentById(id: string): Promise<Environment | undefined> {
  const [row] = await db
    .select()
    .from(environments)
    .where(eq(environments.id, id))

  if (!row) return undefined
  return toEnvironment(row)
}

export async function createEnvironment(
  appId: string,
  input: CreateEnvironmentInput
): Promise<Environment> {
  const now = new Date()
  const [row] = await db
    .insert(environments)
    .values({
      appId,
      name: input.name,
      url: input.url,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return toEnvironment(row)
}

export async function updateEnvironment(
  id: string,
  input: UpdateEnvironmentInput
): Promise<Environment | undefined> {
  const [existing] = await db
    .select()
    .from(environments)
    .where(eq(environments.id, id))

  if (!existing) return undefined

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (input.name !== undefined) updates.name = input.name
  if (input.url !== undefined) updates.url = input.url

  const [row] = await db
    .update(environments)
    .set(updates)
    .where(eq(environments.id, id))
    .returning()

  return toEnvironment(row)
}

export async function deleteEnvironment(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const [existing] = await db
    .select()
    .from(environments)
    .where(eq(environments.id, id))

  if (!existing) {
    return { success: false, error: 'Environment not found' }
  }

  await db.delete(environments).where(eq(environments.id, id))
  return { success: true }
}
