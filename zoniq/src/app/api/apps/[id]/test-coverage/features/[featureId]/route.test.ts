import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { resetTestCoverage } from '@/lib/test-coverage/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

function makeParams(id: string, featureId: string) {
  return { params: Promise.resolve({ id, featureId }) }
}

describe('/api/apps/[id]/test-coverage/features/[featureId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTestCoverage()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/test-coverage/features/feat-mod-1-1-1')
      const response = await GET(request, makeParams('1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(401)
    })

    it('returns test items for feature', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/test-coverage/features/feat-mod-1-1-1')
      const response = await GET(request, makeParams('1', 'feat-mod-1-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.length).toBeGreaterThan(0)
      body.data.forEach((item: Record<string, unknown>) => {
        expect(item.id).toBeDefined()
        expect(item.name).toBeDefined()
        expect(['test-script', 'uat-step']).toContain(item.type)
        expect(['passed', 'failed', 'pending']).toContain(item.status)
      })
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/test-coverage/features/feat-mod-999-1-1')
      const response = await GET(request, makeParams('999', 'feat-mod-999-1-1'))
      expect(response.status).toBe(404)
    })

    it('returns empty array for unknown featureId', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/test-coverage/features/unknown')
      const response = await GET(request, makeParams('1', 'unknown'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toEqual([])
    })
  })
})
