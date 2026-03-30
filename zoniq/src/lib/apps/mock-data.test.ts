import { describe, it, expect, beforeEach } from 'vitest'
import {
  getApps,
  getAppById,
  getAppsByCustomerId,
  createApp,
  updateApp,
  deleteApp,
  getLinkedAppsCount,
  resetApps,
} from './mock-data'

describe('apps mock data', () => {
  beforeEach(() => {
    resetApps()
  })

  describe('getApps', () => {
    it('returns all non-deleted apps', () => {
      const apps = getApps()
      expect(apps.length).toBe(5)
      expect(apps.every((a) => !a.isDeleted)).toBe(true)
    })

    it('filters by customerId when provided', () => {
      const apps = getApps('1')
      expect(apps.length).toBe(3)
      expect(apps.every((a) => a.customerId === '1')).toBe(true)
    })

    it('returns empty array for unknown customerId', () => {
      const apps = getApps('unknown')
      expect(apps.length).toBe(0)
    })
  })

  describe('getAppById', () => {
    it('returns app by id', () => {
      const app = getAppById('1')
      expect(app).toBeDefined()
      expect(app!.name).toBe('Claims Portal')
    })

    it('returns undefined for unknown id', () => {
      expect(getAppById('999')).toBeUndefined()
    })

    it('does not return deleted apps', () => {
      deleteApp('3') // Agent Dashboard has 0 linked projects
      expect(getAppById('3')).toBeUndefined()
    })
  })

  describe('getAppsByCustomerId', () => {
    it('returns apps for customer 1', () => {
      const apps = getAppsByCustomerId('1')
      expect(apps.length).toBe(3)
    })

    it('returns apps for customer 2', () => {
      const apps = getAppsByCustomerId('2')
      expect(apps.length).toBe(2)
    })

    it('returns empty for customer with no apps', () => {
      const apps = getAppsByCustomerId('3')
      expect(apps.length).toBe(0)
    })
  })

  describe('createApp', () => {
    it('creates a new app linked to a customer', () => {
      const result = createApp(
        { name: 'New App', customerId: '1', mendixAppId: 'mx-new-001' },
        'org_test'
      )
      expect('error' in result).toBe(false)
      const app = result as ReturnType<typeof getAppById> & object
      expect(app.name).toBe('New App')
      expect(app.customerId).toBe('1')
      expect(app.customerName).toBe('Acme Insurance')
      expect(app.mendixAppId).toBe('mx-new-001')
      expect(app.version).toBe('1.0.0')
      expect(app.status).toBe('in-development')
      expect(app.linkedProjectsCount).toBe(0)
      expect(app.isDeleted).toBe(false)
    })

    it('creates app with optional description', () => {
      const result = createApp(
        { name: 'App', description: 'Desc', customerId: '1', mendixAppId: 'mx-001' },
        'org_test'
      )
      expect('error' in result).toBe(false)
      expect((result as Record<string, unknown>).description).toBe('Desc')
    })

    it('returns error for invalid customer', () => {
      const result = createApp(
        { name: 'App', customerId: 'nonexistent', mendixAppId: 'mx-001' },
        'org_test'
      )
      expect('error' in result).toBe(true)
      expect((result as Record<string, unknown>).error).toBe('Customer not found')
    })
  })

  describe('updateApp', () => {
    it('updates app name', () => {
      const app = updateApp('1', { name: 'Updated Claims' })
      expect(app).toBeDefined()
      expect(app!.name).toBe('Updated Claims')
    })

    it('updates app status', () => {
      const app = updateApp('1', { status: 'inactive' })
      expect(app).toBeDefined()
      expect(app!.status).toBe('inactive')
    })

    it('updates app version', () => {
      const app = updateApp('1', { version: '4.0.0' })
      expect(app).toBeDefined()
      expect(app!.version).toBe('4.0.0')
    })

    it('sets description to null', () => {
      const app = updateApp('1', { description: null })
      expect(app).toBeDefined()
      expect(app!.description).toBeNull()
    })

    it('returns undefined for unknown id', () => {
      expect(updateApp('999', { name: 'X' })).toBeUndefined()
    })
  })

  describe('deleteApp', () => {
    it('soft-deletes app with no linked projects', () => {
      const result = deleteApp('3') // Agent Dashboard, 0 projects
      expect(result.success).toBe(true)
      expect(getAppById('3')).toBeUndefined()
    })

    it('prevents deletion of app with linked projects', () => {
      const result = deleteApp('1') // Claims Portal, 2 projects
      expect(result.success).toBe(false)
      expect(result.error).toContain('linked projects')
    })

    it('returns error for unknown app', () => {
      const result = deleteApp('999')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  describe('getLinkedAppsCount', () => {
    it('returns count for customer with apps', () => {
      expect(getLinkedAppsCount('1')).toBe(3)
    })

    it('returns 0 for customer with no apps', () => {
      expect(getLinkedAppsCount('3')).toBe(0)
    })

    it('excludes deleted apps', () => {
      deleteApp('3') // delete one of customer 1's apps
      expect(getLinkedAppsCount('1')).toBe(2)
    })
  })

  describe('resetApps', () => {
    it('restores initial data', () => {
      deleteApp('3')
      expect(getApps().length).toBe(4)
      resetApps()
      expect(getApps().length).toBe(5)
    })
  })
})
