import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'
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
