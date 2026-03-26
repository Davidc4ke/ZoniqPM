import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z
    .string()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .nullable(),
});

export const updateCustomerSchema = z.object({
  name: z
    .string()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name must be 100 characters or less')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
