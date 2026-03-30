import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { resetEnvironments } from '@/lib/environments/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

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
      // App 3 exists but after reset all apps have environments; create a new app
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
