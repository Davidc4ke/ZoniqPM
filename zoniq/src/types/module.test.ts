import { describe, it, expect } from 'vitest'
import { createModuleSchema, updateModuleSchema } from './module'
import type { Module } from './module'

describe('Module type', () => {
  it('should define Module interface shape', () => {
    const mod: Module = {
      id: 'mod-1',
      appId: '1',
      name: 'Authentication',
      description: 'Handles user authentication',
      featuresCount: 0,
      isDeleted: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(mod.id).toBe('mod-1')
    expect(mod.appId).toBe('1')
    expect(mod.name).toBe('Authentication')
    expect(mod.description).toBe('Handles user authentication')
    expect(mod.featuresCount).toBe(0)
    expect(mod.isDeleted).toBe(false)
  })

  it('should allow null description', () => {
    const mod: Module = {
      id: 'mod-2',
      appId: '1',
      name: 'Core',
      description: null,
      featuresCount: 0,
      isDeleted: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(mod.description).toBeNull()
  })
})

describe('createModuleSchema', () => {
  it('should validate valid create input', () => {
    const result = createModuleSchema.safeParse({
      name: 'Authentication Module',
      description: 'Handles user login and registration',
    })
    expect(result.success).toBe(true)
  })

  it('should accept missing description', () => {
    const result = createModuleSchema.safeParse({
      name: 'Core Module',
    })
    expect(result.success).toBe(true)
  })

  it('should accept empty string description', () => {
    const result = createModuleSchema.safeParse({
      name: 'Core Module',
      description: '',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = createModuleSchema.safeParse({
      name: '',
      description: 'Some description',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing name', () => {
    const result = createModuleSchema.safeParse({
      description: 'Some description',
    })
    expect(result.success).toBe(false)
  })

  it('should reject name over 100 characters', () => {
    const result = createModuleSchema.safeParse({
      name: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('should reject description over 500 characters', () => {
    const result = createModuleSchema.safeParse({
      name: 'Valid Name',
      description: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('updateModuleSchema', () => {
  it('should validate valid update with name only', () => {
    const result = updateModuleSchema.safeParse({
      name: 'Updated Name',
    })
    expect(result.success).toBe(true)
  })

  it('should validate valid update with description only', () => {
    const result = updateModuleSchema.safeParse({
      description: 'Updated description',
    })
    expect(result.success).toBe(true)
  })

  it('should validate valid update with both fields', () => {
    const result = updateModuleSchema.safeParse({
      name: 'Updated Name',
      description: 'Updated description',
    })
    expect(result.success).toBe(true)
  })

  it('should accept null description for clearing', () => {
    const result = updateModuleSchema.safeParse({
      description: null,
    })
    expect(result.success).toBe(true)
  })

  it('should accept empty object', () => {
    const result = updateModuleSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = updateModuleSchema.safeParse({
      name: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject name over 100 characters', () => {
    const result = updateModuleSchema.safeParse({
      name: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })
})
