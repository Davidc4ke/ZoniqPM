import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'
import { resetModules } from '@/lib/modules/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

vi.mock('@/lib/apps/queries', async () => {
  const mock = await vi.importActual<typeof import('@/lib/apps/mock-data')>('@/lib/apps/mock-data')
  return {
    getApps: async (customerId?: string) => mock.getApps(customerId),
    getAppById: async (id: string) => mock.getAppById(id),
    createApp: async (input: Parameters<typeof mock.createApp>[0], orgId: string) => mock.createApp(input, orgId),
    updateApp: async (id: string, input: Parameters<typeof mock.updateApp>[1]) => mock.updateApp(id, input),
    deleteApp: async (id: string) => mock.deleteApp(id),
    getLinkedAppsCount: async (customerId: string) => mock.getLinkedAppsCount(customerId),
  }
})

vi.mock('@/lib/modules/queries', async () => {
  const mock = await vi.importActual<typeof import('@/lib/modules/mock-data')>('@/lib/modules/mock-data')
  return {
    getModulesByAppId: async (appId: string) => mock.getModulesByAppId(appId),
    getModuleById: async (id: string) => mock.getModuleById(id),
    createModule: async (appId: string, input: Parameters<typeof mock.createModule>[1]) => mock.createModule(appId, input),
    updateModule: async (id: string, input: Parameters<typeof mock.updateModule>[1]) => mock.updateModule(id, input),
    deleteModule: async (id: string) => mock.deleteModule(id),
  }
})

function makeParams(id: string, moduleId: string) {
  return { params: Promise.resolve({ id, moduleId }) }
}

describe('/api/apps/[id]/modules/[moduleId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetModules()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1')
      const response = await GET(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(401)
    })

    it('returns a single module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1')
      const response = await GET(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.id).toBe('mod-1-1')
      expect(body.data.appId).toBe('1')
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules/mod-1-1')
      const response = await GET(request, makeParams('999', 'mod-1-1'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/nonexistent')
      const response = await GET(request, makeParams('1', 'nonexistent'))
      expect(response.status).toBe(404)
    })
  })

  describe('PUT', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(401)
    })

    it('updates module name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Auth' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.name).toBe('Updated Auth')
    })

    it('updates module description', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', {
        method: 'PUT',
        body: JSON.stringify({ description: 'New description' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.description).toBe('New description')
    })

    it('clears description with null', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', {
        method: 'PUT',
        body: JSON.stringify({ description: null }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.description).toBeNull()
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules/mod-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('999', 'mod-1-1'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/nonexistent', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'nonexistent'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for empty name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: '' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', {
        method: 'PUT',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', { method: 'DELETE' })
      const response = await DELETE(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(401)
    })

    it('soft-deletes a module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1', { method: 'DELETE' })
      const response = await DELETE(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.success).toBe(true)
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules/mod-1-1', { method: 'DELETE' })
      const response = await DELETE(request, makeParams('999', 'mod-1-1'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/nonexistent', { method: 'DELETE' })
      const response = await DELETE(request, makeParams('1', 'nonexistent'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for already deleted module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request1 = new Request('http://localhost/api/apps/1/modules/mod-1-1', { method: 'DELETE' })
      await DELETE(request1, makeParams('1', 'mod-1-1'))
      const request2 = new Request('http://localhost/api/apps/1/modules/mod-1-1', { method: 'DELETE' })
      const response = await DELETE(request2, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(404)
    })
  })
})
