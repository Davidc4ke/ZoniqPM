import { z } from 'zod'

export interface Customer {
  id: string
  name: string
  description: string | null
  organizationId: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  linkedAppsCount: number
}

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
})

export const updateCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
