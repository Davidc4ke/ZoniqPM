import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contextItems } from '@/lib/db/schema'
import type {
  ContextItem,
  CreateContextItemInput,
  UpdateContextItemInput,
} from '@/types/context-item'

function toContextItem(row: typeof contextItems.$inferSelect): ContextItem {
  return {
    id: row.id,
    appId: row.appId,
    type: row.type,
    title: row.title,
    content: row.content,
    url: row.url ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getContextItemsByAppId(appId: string): Promise<ContextItem[]> {
  const rows = await db
    .select()
    .from(contextItems)
    .where(eq(contextItems.appId, appId))

  return rows.map(toContextItem)
}

export async function getContextItemById(id: string): Promise<ContextItem | undefined> {
  const [row] = await db
    .select()
    .from(contextItems)
    .where(eq(contextItems.id, id))

  if (!row) return undefined
  return toContextItem(row)
}

export async function createContextItem(
  appId: string,
  input: CreateContextItemInput
): Promise<ContextItem> {
  const now = new Date()
  const [row] = await db
    .insert(contextItems)
    .values({
      appId,
      type: input.type,
      title: input.title,
      content: input.content,
      url: input.url || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return toContextItem(row)
}

export async function updateContextItem(
  id: string,
  input: UpdateContextItemInput
): Promise<ContextItem | undefined> {
  const [existing] = await db
    .select()
    .from(contextItems)
    .where(eq(contextItems.id, id))

  if (!existing) return undefined

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (input.type !== undefined) updates.type = input.type
  if (input.title !== undefined) updates.title = input.title
  if (input.content !== undefined) updates.content = input.content
  if (input.url !== undefined) updates.url = input.url || null

  const [row] = await db
    .update(contextItems)
    .set(updates)
    .where(eq(contextItems.id, id))
    .returning()

  return toContextItem(row)
}

export async function deleteContextItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const [existing] = await db
    .select()
    .from(contextItems)
    .where(eq(contextItems.id, id))

  if (!existing) {
    return { success: false, error: 'Context item not found' }
  }

  await db.delete(contextItems).where(eq(contextItems.id, id))
  return { success: true }
}
