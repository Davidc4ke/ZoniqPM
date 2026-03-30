import { describe, it, expect } from 'vitest'
import { createFeatureSchema, updateFeatureSchema } from './feature'
import type { Feature, LinkedStory } from './feature'

describe('Feature type', () => {
  it('should define Feature interface shape', () => {
    const feature: Feature = {
      id: 'feat-1',
      moduleId: 'mod-1',
      appId: '1',
      name: 'User Login',
      description: 'Login functionality',
      linkedStoriesCount: 2,
      isDeleted: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(feature.id).toBe('feat-1')
    expect(feature.moduleId).toBe('mod-1')
    expect(feature.appId).toBe('1')
    expect(feature.name).toBe('User Login')
    expect(feature.description).toBe('Login functionality')
    expect(feature.linkedStoriesCount).toBe(2)
    expect(feature.isDeleted).toBe(false)
  })

  it('should allow null description', () => {
    const feature: Feature = {
      id: 'feat-2',
      moduleId: 'mod-1',
      appId: '1',
      name: 'Core',
      description: null,
      linkedStoriesCount: 0,
      isDeleted: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(feature.description).toBeNull()
  })

  it('should define LinkedStory interface shape', () => {
    const story: LinkedStory = {
      id: 'story-1',
      title: 'Implement login',
      status: 'in-progress',
      projectName: 'Project Alpha',
    }
    expect(story.id).toBe('story-1')
    expect(story.title).toBe('Implement login')
    expect(story.status).toBe('in-progress')
    expect(story.projectName).toBe('Project Alpha')
  })
})

describe('createFeatureSchema', () => {
  it('should validate valid create input', () => {
    const result = createFeatureSchema.safeParse({
      name: 'User Login',
      description: 'Handles user login flow',
    })
    expect(result.success).toBe(true)
  })

  it('should accept missing description', () => {
    const result = createFeatureSchema.safeParse({
      name: 'User Login',
    })
    expect(result.success).toBe(true)
  })

  it('should accept empty string description', () => {
    const result = createFeatureSchema.safeParse({
      name: 'User Login',
      description: '',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = createFeatureSchema.safeParse({
      name: '',
      description: 'Some description',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing name', () => {
    const result = createFeatureSchema.safeParse({
      description: 'Some description',
    })
    expect(result.success).toBe(false)
  })

  it('should reject name over 100 characters', () => {
    const result = createFeatureSchema.safeParse({
      name: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('should reject description over 500 characters', () => {
    const result = createFeatureSchema.safeParse({
      name: 'Valid Name',
      description: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('updateFeatureSchema', () => {
  it('should validate valid update with name only', () => {
    const result = updateFeatureSchema.safeParse({
      name: 'Updated Name',
    })
    expect(result.success).toBe(true)
  })

  it('should validate valid update with description only', () => {
    const result = updateFeatureSchema.safeParse({
      description: 'Updated description',
    })
    expect(result.success).toBe(true)
  })

  it('should validate valid update with both fields', () => {
    const result = updateFeatureSchema.safeParse({
      name: 'Updated Name',
      description: 'Updated description',
    })
    expect(result.success).toBe(true)
  })

  it('should accept null description for clearing', () => {
    const result = updateFeatureSchema.safeParse({
      description: null,
    })
    expect(result.success).toBe(true)
  })

  it('should accept empty object', () => {
    const result = updateFeatureSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = updateFeatureSchema.safeParse({
      name: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject name over 100 characters', () => {
    const result = updateFeatureSchema.safeParse({
      name: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })
})
