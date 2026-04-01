import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'
import { resetFeatures, createFeature } from '@/lib/features/mock-data'
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
    getAppById: async (id: string) => mock.getAppById(id),
  }
})

vi.mock('@/lib/modules/queries', async () => {
  const mock = await vi.importActual<typeof import('@/lib/modules/mock-data')>('@/lib/modules/mock-data')
  return {
    getModuleById: async (id: string) => mock.getModuleById(id),
  }
})

vi.mock('@/lib/features/queries', async () => {
  const mock = await vi.importActual<typeof import('@/lib/features/mock-data')>('@/lib/features/mock-data')
  return {
    getFeaturesByModuleId: async (moduleId: string) => mock.getFeaturesByModuleId(moduleId),
    getFeatureById: async (id: string) => mock.getFeatureById(id),
    createFeature: async (moduleId: string, appId: string, input: Parameters<typeof mock.createFeature>[2]) => mock.createFeature(moduleId, appId, input),
    updateFeature: async (id: string, input: Parameters<typeof mock.updateFeature>[1]) => mock.updateFeature(id, input),
    deleteFeature: async (id: string) => mock.deleteFeature(id),
  }
})

function makeParams(id: string, moduleId: string, featureId: string) {
  return { params: Promise.resolve({ id, moduleId, featureId }) }
}

describe('/api/apps/[id]/modules/[moduleId]/features/[featureId]', () => {
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
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1')
      const response = await GET(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(401)
    })

    it('returns a single feature', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1')
      const response = await GET(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.id).toBe('feat-mod-1-1-1')
      expect(body.data.name).toBe('Login Flow')
      expect(body.data.linkedStories).toBeDefined()
    })

    it('returns 404 for unknown feature', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/nonexistent')
      const response = await GET(request, makeParams('1', 'mod-1-1', 'nonexistent'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for feature in wrong module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-2/features/feat-mod-1-1-1')
      const response = await GET(request, makeParams('1', 'mod-1-2', 'feat-mod-1-1-1'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules/mod-1-1/features/feat-mod-1-1-1')
      const response = await GET(request, makeParams('999', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(404)
    })
  })

  describe('PUT', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(401)
    })

    it('updates a feature name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Flow' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.name).toBe('Updated Flow')
    })

    it('returns 404 for unknown feature', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/nonexistent', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Nope' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1', 'nonexistent'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1', {
        method: 'PUT',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(400)
    })

    it('returns 400 for empty name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: '' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(401)
    })

    it('soft-deletes a feature with no linked stories', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const feat = createFeature('mod-1-1', '1', { name: 'Deletable' })
      const request = new Request(`http://localhost/api/apps/1/modules/mod-1-1/features/${feat.id}`, {
        method: 'DELETE',
      })
      const response = await DELETE(request, makeParams('1', 'mod-1-1', feat.id))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.success).toBe(true)
    })

    it('returns 400 for feature with linked stories', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/feat-mod-1-1-1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, makeParams('1', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error.code).toBe('HAS_DEPENDENCIES')
    })

    it('returns 404 for unknown feature', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/modules/mod-1-1/features/nonexistent', {
        method: 'DELETE',
      })
      const response = await DELETE(request, makeParams('1', 'mod-1-1', 'nonexistent'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/modules/mod-1-1/features/feat-mod-1-1-1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, makeParams('999', 'mod-1-1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(404)
    })
  })
})
