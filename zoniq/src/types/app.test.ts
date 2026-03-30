import { describe, it, expect } from 'vitest'
import { createAppSchema, updateAppSchema } from './app'

describe('createAppSchema', () => {
  it('validates valid input', () => {
    const result = createAppSchema.safeParse({
      name: 'My App',
      customerId: 'cust-1',
      mendixAppId: 'mx-123',
    })
    expect(result.success).toBe(true)
  })

  it('validates with optional description', () => {
    const result = createAppSchema.safeParse({
      name: 'My App',
      description: 'A test app',
      customerId: 'cust-1',
      mendixAppId: 'mx-123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = createAppSchema.safeParse({
      customerId: 'cust-1',
      mendixAppId: 'mx-123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = createAppSchema.safeParse({
      name: '',
      customerId: 'cust-1',
      mendixAppId: 'mx-123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name over 100 characters', () => {
    const result = createAppSchema.safeParse({
      name: 'a'.repeat(101),
      customerId: 'cust-1',
      mendixAppId: 'mx-123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing customerId', () => {
    const result = createAppSchema.safeParse({
      name: 'My App',
      mendixAppId: 'mx-123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty customerId', () => {
    const result = createAppSchema.safeParse({
      name: 'My App',
      customerId: '',
      mendixAppId: 'mx-123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing mendixAppId', () => {
    const result = createAppSchema.safeParse({
      name: 'My App',
      customerId: 'cust-1',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty mendixAppId', () => {
    const result = createAppSchema.safeParse({
      name: 'My App',
      customerId: 'cust-1',
      mendixAppId: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects description over 500 characters', () => {
    const result = createAppSchema.safeParse({
      name: 'My App',
      customerId: 'cust-1',
      mendixAppId: 'mx-123',
      description: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('updateAppSchema', () => {
  it('validates with all optional fields', () => {
    const result = updateAppSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('validates with name only', () => {
    const result = updateAppSchema.safeParse({ name: 'Updated Name' })
    expect(result.success).toBe(true)
  })

  it('validates with status', () => {
    const result = updateAppSchema.safeParse({ status: 'active' })
    expect(result.success).toBe(true)
  })

  it('validates with all fields', () => {
    const result = updateAppSchema.safeParse({
      name: 'Updated',
      description: 'New desc',
      version: '2.0.0',
      status: 'inactive',
    })
    expect(result.success).toBe(true)
  })

  it('validates nullable description', () => {
    const result = updateAppSchema.safeParse({ description: null })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = updateAppSchema.safeParse({ status: 'unknown' })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = updateAppSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('validates in-development status', () => {
    const result = updateAppSchema.safeParse({ status: 'in-development' })
    expect(result.success).toBe(true)
  })
})
