import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
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

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('/api/apps/[id]/modules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetModules()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('returns modules for app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toHaveLength(3)
      expect(body.data[0].appId).toBe('1')
      expect(body.meta.total).toBe(3)
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules')
      const response = await GET(request, makeParams('999'))
      expect(response.status).toBe(404)
    })
  })

  describe('POST', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Module' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('creates a new module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules', {
        method: 'POST',
        body: JSON.stringify({ name: 'Payments', description: 'Payment processing' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data.name).toBe('Payments')
      expect(body.data.description).toBe('Payment processing')
      expect(body.data.appId).toBe('1')
    })

    it('creates a module without description', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules', {
        method: 'POST',
        body: JSON.stringify({ name: 'Minimal Module' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data.description).toBeNull()
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules', {
        method: 'POST',
        body: JSON.stringify({ name: 'Module' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('999'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for missing name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules', {
        method: 'POST',
        body: JSON.stringify({ description: 'No name provided' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for empty name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules', {
        method: 'POST',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(400)
    })
  })
})
