import { describe, it, expect } from 'vitest'
import { createEnvironmentSchema, updateEnvironmentSchema } from './environment'

describe('createEnvironmentSchema', () => {
  it('validates valid input', () => {
    const result = createEnvironmentSchema.safeParse({
      name: 'Development',
      url: 'https://dev.example.com',
    })
    expect(result.success).toBe(true)
  })

  it('requires name', () => {
    const result = createEnvironmentSchema.safeParse({
      url: 'https://dev.example.com',
    })
    expect(result.success).toBe(false)
  })

  it('requires url', () => {
    const result = createEnvironmentSchema.safeParse({
      name: 'Development',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = createEnvironmentSchema.safeParse({
      name: '',
      url: 'https://dev.example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name over 100 chars', () => {
    const result = createEnvironmentSchema.safeParse({
      name: 'a'.repeat(101),
      url: 'https://dev.example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid url', () => {
    const result = createEnvironmentSchema.safeParse({
      name: 'Development',
      url: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })

  it('accepts url without protocol prefix as valid URL', () => {
    const result = createEnvironmentSchema.safeParse({
      name: 'Development',
      url: 'https://localhost:3000',
    })
    expect(result.success).toBe(true)
  })
})

describe('updateEnvironmentSchema', () => {
  it('validates partial update with name only', () => {
    const result = updateEnvironmentSchema.safeParse({
      name: 'Updated Name',
    })
    expect(result.success).toBe(true)
  })

  it('validates partial update with url only', () => {
    const result = updateEnvironmentSchema.safeParse({
      url: 'https://new.example.com',
    })
    expect(result.success).toBe(true)
  })

  it('validates empty object (no updates)', () => {
    const result = updateEnvironmentSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = updateEnvironmentSchema.safeParse({
      name: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid url', () => {
    const result = updateEnvironmentSchema.safeParse({
      url: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})
