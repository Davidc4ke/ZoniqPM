import { z } from 'zod'

export type ContextItemType = 'note' | 'document' | 'url'

export interface ContextItem {
  id: string
  appId: string
  title: string
  type: ContextItemType
  content: string
  createdAt: string
  updatedAt: string
}

export const createContextItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  type: z.enum(['note', 'document', 'url']),
  content: z.string().min(1, 'Content is required'),
})

export type CreateContextItemInput = z.infer<typeof createContextItemSchema>
