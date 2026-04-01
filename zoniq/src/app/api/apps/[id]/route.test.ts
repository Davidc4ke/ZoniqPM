import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'
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

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('/api/apps/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('returns app by id', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.id).toBe('1')
      expect(body.data.name).toBe('Claims Portal')
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999')
      const response = await GET(request, makeParams('999'))
      expect(response.status).toBe(404)
    })
  })

  describe('PUT', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('updates app name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Claims Portal' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.name).toBe('Updated Claims Portal')
    })

    it('updates app status', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1', {
        method: 'PUT',
        body: JSON.stringify({ status: 'inactive' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.status).toBe('inactive')
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999', {
        method: 'PUT',
        body: JSON.stringify({ name: 'X' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('999'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for invalid status', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1', {
        method: 'PUT',
        body: JSON.stringify({ status: 'unknown' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1', {
        method: 'PUT',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1'))
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/3')
      const response = await DELETE(request, makeParams('3'))
      expect(response.status).toBe(401)
    })

    it('deletes app with no linked projects', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/3')
      const response = await DELETE(request, makeParams('3'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.success).toBe(true)
    })

    it('returns 409 for app with linked projects', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1')
      const response = await DELETE(request, makeParams('1'))
      expect(response.status).toBe(409)
      const body = await response.json()
      expect(body.error.code).toBe('DELETE_BLOCKED')
      expect(body.error.message).toContain('linked projects')
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999')
      const response = await DELETE(request, makeParams('999'))
      expect(response.status).toBe(404)
    })
  })
})
