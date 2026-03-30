import { z } from 'zod'

export interface Feature {
  id: string
  moduleId: string
  appId: string
  name: string
  description: string | null
  linkedStoriesCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface LinkedStory {
  id: string
  title: string
  status: string
  projectName: string
}

export const createFeatureSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
})

export const updateFeatureSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
})

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>
export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>
