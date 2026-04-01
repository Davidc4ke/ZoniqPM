import { z } from 'zod'

export type ContextItemType = 'note' | 'document' | 'url'

export interface ContextItem {
  id: string
  appId: string
  type: ContextItemType
  title: string
  content: string
  url?: string
  createdAt: string
  updatedAt: string
}

export const createContextItemSchema = z.object({
  type: z.enum(['note', 'document', 'url'], { message: 'Type is required' }),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be 5000 characters or less'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export const updateContextItemSchema = z.object({
  type: z.enum(['note', 'document', 'url']).optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less').optional(),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be 5000 characters or less').optional(),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export type CreateContextItemInput = z.infer<typeof createContextItemSchema>
export type UpdateContextItemInput = z.infer<typeof updateContextItemSchema>
