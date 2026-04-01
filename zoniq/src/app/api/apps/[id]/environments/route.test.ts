import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { resetEnvironments } from '@/lib/environments/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

vi.mock('@/lib/apps/queries', async () => {
  const mock = await vi.importActual<typeof import('@/lib/apps/mock-data')>('@/lib/apps/mock-data')
  return {
    getAppById: async (id: string) => mock.getAppById(id),
  }
})

vi.mock('@/lib/environments/queries', async () => {
  const mock = await vi.importActual<typeof import('@/lib/environments/mock-data')>('@/lib/environments/mock-data')
  return {
    getEnvironmentsByAppId: async (appId: string) => mock.getEnvironmentsByAppId(appId),
    getEnvironmentById: async (id: string) => mock.getEnvironmentById(id),
    createEnvironment: async (appId: string, input: Parameters<typeof mock.createEnvironment>[1]) => mock.createEnvironment(appId, input),
    updateEnvironment: async (id: string, input: Parameters<typeof mock.updateEnvironment>[1]) => mock.updateEnvironment(id, input),
    deleteEnvironment: async (id: string) => mock.deleteEnvironment(id),
  }
})

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('/api/apps/[id]/environments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetEnvironments()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/environments')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('returns environments for app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toHaveLength(4)
      expect(body.data[0].appId).toBe('1')
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/environments')
      const response = await GET(request, makeParams('999'))
      expect(response.status).toBe(404)
    })

    it('returns empty array for app with no environments', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('POST', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/environments', {
        method: 'POST',
        body: JSON.stringify({ name: 'Staging', url: 'https://staging.example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('creates a new environment', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments', {
        method: 'POST',
        body: JSON.stringify({ name: 'Staging', url: 'https://staging.example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data.name).toBe('Staging')
      expect(body.data.appId).toBe('1')
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/environments', {
        method: 'POST',
        body: JSON.stringify({ name: 'Staging', url: 'https://staging.example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('999'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for missing name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://staging.example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid url', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments', {
        method: 'POST',
        body: JSON.stringify({ name: 'Staging', url: 'not-a-url' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments', {
        method: 'POST',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1'))
      expect(response.status).toBe(400)
    })
  })
})
