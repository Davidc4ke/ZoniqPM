import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { resetTestCoverage } from '@/lib/test-coverage/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

function makeParams(id: string, moduleId: string) {
  return { params: Promise.resolve({ id, moduleId }) }
}

describe('/api/apps/[id]/test-coverage/modules/[moduleId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTestCoverage()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/test-coverage/modules/mod-1-1')
      const response = await GET(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(401)
    })

    it('returns feature coverage for module', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/test-coverage/modules/mod-1-1')
      const response = await GET(request, makeParams('1', 'mod-1-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.length).toBeGreaterThan(0)
      body.data.forEach((fc: Record<string, unknown>) => {
        expect(fc.featureId).toBeDefined()
        expect(fc.featureName).toBeDefined()
        expect(typeof fc.totalTests).toBe('number')
        expect(typeof fc.coveragePercentage).toBe('number')
      })
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/test-coverage/modules/mod-999-1')
      const response = await GET(request, makeParams('999', 'mod-999-1'))
      expect(response.status).toBe(404)
    })

    it('returns empty array for unknown moduleId', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/test-coverage/modules/unknown')
      const response = await GET(request, makeParams('1', 'unknown'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toEqual([])
    })
  })
})
