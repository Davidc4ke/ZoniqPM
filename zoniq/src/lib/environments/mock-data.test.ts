import { describe, it, expect, beforeEach } from 'vitest'
import {
  getEnvironmentsByAppId,
  getEnvironmentById,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
  resetEnvironments,
} from './mock-data'

describe('environments mock-data', () => {
  beforeEach(() => {
    resetEnvironments()
  })

  describe('getEnvironmentsByAppId', () => {
    it('returns 4 default environments for app 1', () => {
      const envs = getEnvironmentsByAppId('1')
      expect(envs).toHaveLength(4)
    })

    it('returns environments with expected names', () => {
      const envs = getEnvironmentsByAppId('1')
      const names = envs.map((e) => e.name)
      expect(names).toContain('Development')
      expect(names).toContain('Test')
      expect(names).toContain('Acceptance')
      expect(names).toContain('Production')
    })

    it('returns empty array for unknown app', () => {
      const envs = getEnvironmentsByAppId('999')
      expect(envs).toHaveLength(0)
    })

    it('returns environments with correct appId', () => {
      const envs = getEnvironmentsByAppId('1')
      envs.forEach((env) => {
        expect(env.appId).toBe('1')
      })
    })
  })

  describe('getEnvironmentById', () => {
    it('returns environment by id', () => {
      const envs = getEnvironmentsByAppId('1')
      const env = getEnvironmentById(envs[0].id)
      expect(env).toBeDefined()
      expect(env!.id).toBe(envs[0].id)
    })

    it('returns undefined for unknown id', () => {
      const env = getEnvironmentById('unknown-id')
      expect(env).toBeUndefined()
    })
  })

  describe('createEnvironment', () => {
    it('creates a new environment', () => {
      const env = createEnvironment('1', { name: 'Staging', url: 'https://staging.example.com' })
      expect(env.name).toBe('Staging')
      expect(env.url).toBe('https://staging.example.com')
      expect(env.appId).toBe('1')
      expect(env.status).toBe('offline')
      expect(env.version).toBe('—')
    })

    it('new environment appears in list', () => {
      const before = getEnvironmentsByAppId('1').length
      createEnvironment('1', { name: 'Staging', url: 'https://staging.example.com' })
      const after = getEnvironmentsByAppId('1').length
      expect(after).toBe(before + 1)
    })
  })

  describe('updateEnvironment', () => {
    it('updates environment name', () => {
      const envs = getEnvironmentsByAppId('1')
      const updated = updateEnvironment(envs[0].id, { name: 'Updated Dev' })
      expect(updated).toBeDefined()
      expect(updated!.name).toBe('Updated Dev')
    })

    it('updates environment url', () => {
      const envs = getEnvironmentsByAppId('1')
      const updated = updateEnvironment(envs[0].id, { url: 'https://new.example.com' })
      expect(updated).toBeDefined()
      expect(updated!.url).toBe('https://new.example.com')
    })

    it('returns undefined for unknown id', () => {
      const updated = updateEnvironment('unknown-id', { name: 'X' })
      expect(updated).toBeUndefined()
    })

    it('sets updatedAt on update', () => {
      const envs = getEnvironmentsByAppId('1')
      const updated = updateEnvironment(envs[0].id, { name: 'Updated' })
      expect(updated!.updatedAt).toBeDefined()
      expect(new Date(updated!.updatedAt).getTime()).not.toBeNaN()
    })
  })

  describe('deleteEnvironment', () => {
    it('deletes an environment', () => {
      const envs = getEnvironmentsByAppId('1')
      const result = deleteEnvironment(envs[0].id)
      expect(result.success).toBe(true)
    })

    it('deleted environment no longer in list', () => {
      const envs = getEnvironmentsByAppId('1')
      const id = envs[0].id
      deleteEnvironment(id)
      const env = getEnvironmentById(id)
      expect(env).toBeUndefined()
    })

    it('returns failure for unknown id', () => {
      const result = deleteEnvironment('unknown-id')
      expect(result.success).toBe(false)
    })
  })

  describe('resetEnvironments', () => {
    it('restores default environments after changes', () => {
      const envs = getEnvironmentsByAppId('1')
      deleteEnvironment(envs[0].id)
      resetEnvironments()
      const restored = getEnvironmentsByAppId('1')
      expect(restored).toHaveLength(4)
    })
  })
})
