import { z } from 'zod'

export type EnvironmentStatus = 'online' | 'offline' | 'deploying'

export interface Environment {
  id: string
  appId: string
  name: string
  url: string
  status: EnvironmentStatus
  version: string
  lastPing: string
  createdAt: string
  updatedAt: string
}

export const createEnvironmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  url: z.string().url('Must be a valid URL'),
})

export const updateEnvironmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  url: z.string().url('Must be a valid URL').optional(),
})

export type CreateEnvironmentInput = z.infer<typeof createEnvironmentSchema>
export type UpdateEnvironmentInput = z.infer<typeof updateEnvironmentSchema>
