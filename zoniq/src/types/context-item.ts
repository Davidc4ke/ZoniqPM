import { z } from 'zod'

export type ContextItemType = 'note' | 'document' | 'url'

export interface ContextItem {
  id: string
  appId: string
  name: string
  type: ContextItemType
  content: string
  createdAt: string
  updatedAt: string
}

export const createContextItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  type: z.enum(['note', 'document', 'url'], { message: 'Type is required' }),
  content: z.string().min(1, 'Content is required'),
})

export type CreateContextItemInput = z.infer<typeof createContextItemSchema>
