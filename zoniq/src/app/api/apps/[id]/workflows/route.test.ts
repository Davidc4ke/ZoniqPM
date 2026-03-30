import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('/api/apps/[id]/workflows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/workflows')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('returns workflows for app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/workflows')
      const response = await GET(request, makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toHaveLength(3)
      body.data.forEach((wf: Record<string, unknown>) => {
        expect(wf.id).toBeDefined()
        expect(wf.name).toBeDefined()
        expect(wf.status).toBeDefined()
        expect(typeof wf.stepCount).toBe('number')
      })
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/workflows')
      const response = await GET(request, makeParams('999'))
      expect(response.status).toBe(404)
    })

    it('includes meta with total count', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/workflows')
      const response = await GET(request, makeParams('1'))
      const body = await response.json()
      expect(body.meta.total).toBe(3)
    })
  })
})
