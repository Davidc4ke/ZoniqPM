import { z } from 'zod'

export type AppStatus = 'active' | 'inactive' | 'in-development'

export interface App {
  id: string
  name: string
  description: string | null
  customerId: string
  customerName: string
  mendixAppId: string
  version: string
  status: AppStatus
  organizationId: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  linkedProjectsCount: number
  modulesCount: number
}

export const createAppSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  customerId: z.string().min(1, 'Customer is required'),
  mendixAppId: z.string().min(1, 'Mendix App ID is required').max(100, 'Mendix App ID must be 100 characters or less'),
})

export const updateAppSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  version: z.string().max(50, 'Version must be 50 characters or less').optional(),
  status: z.enum(['active', 'inactive', 'in-development']).optional(),
})

export type CreateAppInput = z.infer<typeof createAppSchema>
export type UpdateAppInput = z.infer<typeof updateAppSchema>
