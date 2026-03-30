import { describe, it, expect } from 'vitest'
import { createCustomerSchema, updateCustomerSchema } from './customer'

describe('createCustomerSchema', () => {
  it('accepts valid input with name only', () => {
    const result = createCustomerSchema.safeParse({ name: 'Acme Corp' })
    expect(result.success).toBe(true)
  })

  it('accepts valid input with name and description', () => {
    const result = createCustomerSchema.safeParse({
      name: 'Acme Corp',
      description: 'A test customer',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createCustomerSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing name', () => {
    const result = createCustomerSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects name over 100 characters', () => {
    const result = createCustomerSchema.safeParse({ name: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects description over 500 characters', () => {
    const result = createCustomerSchema.safeParse({
      name: 'Test',
      description: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('updateCustomerSchema', () => {
  it('accepts partial update with name only', () => {
    const result = updateCustomerSchema.safeParse({ name: 'New Name' })
    expect(result.success).toBe(true)
  })

  it('accepts partial update with description only', () => {
    const result = updateCustomerSchema.safeParse({ description: 'New desc' })
    expect(result.success).toBe(true)
  })

  it('accepts null description (clearing it)', () => {
    const result = updateCustomerSchema.safeParse({ description: null })
    expect(result.success).toBe(true)
  })

  it('accepts empty object', () => {
    const result = updateCustomerSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects empty name string', () => {
    const result = updateCustomerSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })
})
