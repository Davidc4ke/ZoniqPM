import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contexts } from '@/lib/db/schema'
import type {
  ContextItem,
  CreateContextInput,
  UpdateContextInput,
} from '@/types/context'

function toContextItem(row: typeof contexts.$inferSelect): ContextItem {
  return {
    id: row.id,
    appId: row.appId,
    name: row.name,
    type: row.type,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getContextsByAppId(appId: string): Promise<ContextItem[]> {
  const rows = await db
    .select()
    .from(contexts)
    .where(eq(contexts.appId, appId))

  return rows.map(toContextItem)
}

export async function getContextById(id: string): Promise<ContextItem | undefined> {
  const [row] = await db
    .select()
    .from(contexts)
    .where(eq(contexts.id, id))

  if (!row) return undefined
  return toContextItem(row)
}

export async function createContext(
  appId: string,
  input: CreateContextInput
): Promise<ContextItem> {
  const now = new Date()
  const [row] = await db
    .insert(contexts)
    .values({
      appId,
      name: input.name,
      type: input.type,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return toContextItem(row)
}

export async function updateContext(
  id: string,
  input: UpdateContextInput
): Promise<ContextItem | undefined> {
  const [existing] = await db
    .select()
    .from(contexts)
    .where(eq(contexts.id, id))

  if (!existing) return undefined

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (input.name !== undefined) updates.name = input.name
  if (input.type !== undefined) updates.type = input.type
  if (input.content !== undefined) updates.content = input.content

  const [row] = await db
    .update(contexts)
    .set(updates)
    .where(eq(contexts.id, id))
    .returning()

  return toContextItem(row)
}

export async function deleteContext(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const [existing] = await db
    .select()
    .from(contexts)
    .where(eq(contexts.id, id))

  if (!existing) {
    return { success: false, error: 'Context not found' }
  }

  await db.delete(contexts).where(eq(contexts.id, id))
  return { success: true }
}
