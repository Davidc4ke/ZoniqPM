import { z } from 'zod'

export type ContextType = 'note' | 'document' | 'url'

export interface ContextItem {
  id: string
  appId: string
  name: string
  type: ContextType
  content: string
  createdAt: string
  updatedAt: string
}

export const createContextSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  type: z.enum(['note', 'document', 'url'], { message: 'Type is required' }),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be 5000 characters or less'),
})

export const updateContextSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  type: z.enum(['note', 'document', 'url']).optional(),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be 5000 characters or less').optional(),
})

export type CreateContextInput = z.infer<typeof createContextSchema>
export type UpdateContextInput = z.infer<typeof updateContextSchema>
