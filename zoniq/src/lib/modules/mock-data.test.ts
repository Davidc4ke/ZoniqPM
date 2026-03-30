import { describe, it, expect, beforeEach } from 'vitest'
import {
  getModulesByAppId,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  resetModules,
} from './mock-data'

describe('Module mock data', () => {
  beforeEach(() => {
    resetModules()
  })

  describe('getModulesByAppId', () => {
    it('should return modules for a given app', () => {
      const modules = getModulesByAppId('1')
      expect(modules.length).toBeGreaterThan(0)
      modules.forEach((m) => {
        expect(m.appId).toBe('1')
        expect(m.isDeleted).toBe(false)
      })
    })

    it('should not return deleted modules', () => {
      const modules = getModulesByAppId('1')
      const firstModule = modules[0]
      deleteModule(firstModule.id)
      const afterDelete = getModulesByAppId('1')
      expect(afterDelete.length).toBe(modules.length - 1)
      expect(afterDelete.find((m) => m.id === firstModule.id)).toBeUndefined()
    })

    it('should return empty array for unknown app', () => {
      const modules = getModulesByAppId('unknown')
      expect(modules).toEqual([])
    })
  })

  describe('getModuleById', () => {
    it('should return a module by id', () => {
      const modules = getModulesByAppId('1')
      const found = getModuleById(modules[0].id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(modules[0].id)
    })

    it('should not return a deleted module', () => {
      const modules = getModulesByAppId('1')
      deleteModule(modules[0].id)
      const found = getModuleById(modules[0].id)
      expect(found).toBeUndefined()
    })

    it('should return undefined for unknown id', () => {
      const found = getModuleById('nonexistent')
      expect(found).toBeUndefined()
    })
  })

  describe('createModule', () => {
    it('should create a new module with name and description', () => {
      const mod = createModule('1', { name: 'New Module', description: 'Test desc' })
      expect(mod.id).toBeDefined()
      expect(mod.appId).toBe('1')
      expect(mod.name).toBe('New Module')
      expect(mod.description).toBe('Test desc')
      expect(mod.featuresCount).toBe(0)
      expect(mod.isDeleted).toBe(false)
      expect(mod.createdAt).toBeDefined()
      expect(mod.updatedAt).toBeDefined()
    })

    it('should create a module without description', () => {
      const mod = createModule('2', { name: 'No Desc Module' })
      expect(mod.name).toBe('No Desc Module')
      expect(mod.description).toBeNull()
    })

    it('should be retrievable after creation', () => {
      const mod = createModule('1', { name: 'Retrievable' })
      const found = getModuleById(mod.id)
      expect(found).toBeDefined()
      expect(found?.name).toBe('Retrievable')
    })

    it('should appear in app module list after creation', () => {
      const before = getModulesByAppId('1')
      createModule('1', { name: 'Extra Module' })
      const after = getModulesByAppId('1')
      expect(after.length).toBe(before.length + 1)
    })
  })

  describe('updateModule', () => {
    it('should update module name', () => {
      const modules = getModulesByAppId('1')
      const updated = updateModule(modules[0].id, { name: 'Updated Name' })
      expect(updated).toBeDefined()
      expect(updated?.name).toBe('Updated Name')
    })

    it('should update module description', () => {
      const modules = getModulesByAppId('1')
      const updated = updateModule(modules[0].id, { description: 'New desc' })
      expect(updated).toBeDefined()
      expect(updated?.description).toBe('New desc')
    })

    it('should clear description with null', () => {
      const modules = getModulesByAppId('1')
      const updated = updateModule(modules[0].id, { description: null })
      expect(updated).toBeDefined()
      expect(updated?.description).toBeNull()
    })

    it('should update updatedAt timestamp', () => {
      const modules = getModulesByAppId('1')
      const updated = updateModule(modules[0].id, { name: 'Timestamp Test' })
      expect(updated?.updatedAt).toBeDefined()
      // updatedAt should be a valid ISO date string
      expect(new Date(updated!.updatedAt).toISOString()).toBe(updated!.updatedAt)
    })

    it('should return undefined for nonexistent id', () => {
      const updated = updateModule('nonexistent', { name: 'Nope' })
      expect(updated).toBeUndefined()
    })

    it('should return undefined for deleted module', () => {
      const modules = getModulesByAppId('1')
      deleteModule(modules[0].id)
      const updated = updateModule(modules[0].id, { name: 'Nope' })
      expect(updated).toBeUndefined()
    })
  })

  describe('deleteModule (soft-delete)', () => {
    it('should soft-delete a module', () => {
      const modules = getModulesByAppId('1')
      const result = deleteModule(modules[0].id)
      expect(result.success).toBe(true)
    })

    it('should fail for nonexistent module', () => {
      const result = deleteModule('nonexistent')
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should fail for already deleted module', () => {
      const modules = getModulesByAppId('1')
      deleteModule(modules[0].id)
      const result = deleteModule(modules[0].id)
      expect(result.success).toBe(false)
    })

    it('should make module invisible in list and getById', () => {
      const modules = getModulesByAppId('1')
      const id = modules[0].id
      deleteModule(id)
      expect(getModuleById(id)).toBeUndefined()
      expect(getModulesByAppId('1').find((m) => m.id === id)).toBeUndefined()
    })
  })

  describe('resetModules', () => {
    it('should restore original state', () => {
      const before = getModulesByAppId('1').length
      createModule('1', { name: 'Extra' })
      resetModules()
      const after = getModulesByAppId('1').length
      expect(after).toBe(before)
    })
  })
})
