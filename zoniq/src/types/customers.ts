import { z } from 'zod/v4'

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  description: z.string().optional(),
})

export const updateCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less').optional(),
  description: z.string().optional(),
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>

export interface Customer {
  id: string
  organizationId: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CustomerWithAppCount extends Customer {
  appCount: number
}
