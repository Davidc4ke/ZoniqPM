import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { resetFeatures } from '@/lib/features/mock-data'
import { resetModules } from '@/lib/modules/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

function makeParams(id: string, moduleId: string) {
  return { params: Promise.resolve({ id, moduleId }) }
}

describe('/api/apps/[id]/modules/[moduleId]/features', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetFeatures()
    resetModules()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features')
      const response = await GET(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(401)
    })

    it('returns features for module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features')
      const response = await GET(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toHaveLength(2)
      expect(body.data[0].moduleId).toBe('mod-1-1')
      expect(body.meta.total).toBe(2)
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules/mod-1-1/features')
      const response = await GET(request, makeParams('999', 'mod-1-1'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-999/features')
      const response = await GET(request, makeParams('1', 'mod-999'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for module not belonging to app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-2-1/features')
      const response = await GET(request, makeParams('1', 'mod-2-1'))
      expect(response.status).toBe(404)
    })
  })

  describe('POST', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Feature' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(401)
    })

    it('creates a new feature', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features', {
        method: 'POST',
        body: JSON.stringify({ name: 'Payments', description: 'Payment processing' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data.name).toBe('Payments')
      expect(body.data.description).toBe('Payment processing')
      expect(body.data.moduleId).toBe('mod-1-1')
      expect(body.data.appId).toBe('1')
    })

    it('creates a feature without description', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features', {
        method: 'POST',
        body: JSON.stringify({ name: 'Minimal Feature' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data.description).toBeNull()
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules/mod-1-1/features', {
        method: 'POST',
        body: JSON.stringify({ name: 'Feature' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('999', 'mod-1-1'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-999/features', {
        method: 'POST',
        body: JSON.stringify({ name: 'Feature' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1', 'mod-999'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for missing name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features', {
        method: 'POST',
        body: JSON.stringify({ description: 'No name provided' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for empty name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features', {
        method: 'POST',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(400)
    })
  })
})
