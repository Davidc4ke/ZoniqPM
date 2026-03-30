import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { resetTestCoverage } from '@/lib/test-coverage/mock-data'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('/api/apps/[id]/test-coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTestCoverage()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/test-coverage')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('returns module coverage for app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/test-coverage')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toHaveLength(3)
      body.data.forEach((mc: Record<string, unknown>) => {
        expect(mc.moduleId).toBeDefined()
        expect(mc.moduleName).toBeDefined()
        expect(typeof mc.totalTests).toBe('number')
        expect(typeof mc.coveragePercentage).toBe('number')
        expect(['excellent', 'good', 'critical']).toContain(mc.healthStatus)
      })
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/test-coverage')
      const response = await GET(request, makeParams('999'))
      expect(response.status).toBe(404)
    })

    it('includes meta with total count', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/test-coverage')
      const response = await GET(request, makeParams('1'))
      const body = await response.json()
      expect(body.meta.total).toBe(3)
    })
  })
})
