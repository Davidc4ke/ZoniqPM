import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PUT, DELETE } from './route'
import { resetEnvironments, getEnvironmentsByAppId } from '@/lib/environments/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

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

function makeParams(id: string, envId: string) {
  return { params: Promise.resolve({ id, envId }) }
}

describe('/api/apps/[id]/environments/[envId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetEnvironments()
    resetApps()
    resetCustomers()
  })

  describe('PUT', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/environments/env-1-1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'env-1-1'))
      expect(response.status).toBe(401)
    })

    it('updates environment name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const envs = getEnvironmentsByAppId('1')
      const envId = envs[0].id
      const request = new Request(`http://localhost/api/apps/1/environments/${envId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Dev' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', envId))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.name).toBe('Updated Dev')
    })

    it('updates environment url', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const envs = getEnvironmentsByAppId('1')
      const envId = envs[0].id
      const request = new Request(`http://localhost/api/apps/1/environments/${envId}`, {
        method: 'PUT',
        body: JSON.stringify({ url: 'https://new.example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', envId))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.url).toBe('https://new.example.com')
    })

    it('returns 404 for unknown environment', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments/unknown', {
        method: 'PUT',
        body: JSON.stringify({ name: 'X' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'unknown'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for invalid url', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const envs = getEnvironmentsByAppId('1')
      const envId = envs[0].id
      const request = new Request(`http://localhost/api/apps/1/environments/${envId}`, {
        method: 'PUT',
        body: JSON.stringify({ url: 'not-a-url' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', envId))
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments/env-1-1', {
        method: 'PUT',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await PUT(request, makeParams('1', 'env-1-1'))
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/environments/env-1-1')
      const response = await DELETE(request, makeParams('1', 'env-1-1'))
      expect(response.status).toBe(401)
    })

    it('deletes an environment', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const envs = getEnvironmentsByAppId('1')
      const envId = envs[0].id
      const request = new Request(`http://localhost/api/apps/1/environments/${envId}`)
      const response = await DELETE(request, makeParams('1', envId))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.success).toBe(true)
    })

    it('returns 404 for unknown environment', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/environments/unknown')
      const response = await DELETE(request, makeParams('1', 'unknown'))
      expect(response.status).toBe(404)
    })
  })
})
