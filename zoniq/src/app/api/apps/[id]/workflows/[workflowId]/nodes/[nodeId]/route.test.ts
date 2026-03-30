import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

function makeParams(id: string, workflowId: string, nodeId: string) {
  return { params: Promise.resolve({ id, workflowId, nodeId }) }
}

describe('/api/apps/[id]/workflows/[workflowId]/nodes/[nodeId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps/1/workflows/wf-1-1/nodes/wf-1-1-node-1')
      const response = await GET(request, makeParams('1', 'wf-1-1', 'wf-1-1-node-1'))
      expect(response.status).toBe(401)
    })

    it('returns node detail with linked stories', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/workflows/wf-1-1/nodes/wf-1-1-node-1')
      const response = await GET(request, makeParams('1', 'wf-1-1', 'wf-1-1-node-1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.id).toBe('wf-1-1-node-1')
      expect(body.data.label).toBeDefined()
      expect(body.data.linkedStories.length).toBeGreaterThan(0)
    })

    it('returns 404 for unknown app', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/999/workflows/wf-1-1/nodes/wf-1-1-node-1')
      const response = await GET(request, makeParams('999', 'wf-1-1', 'wf-1-1-node-1'))
      expect(response.status).toBe(404)
    })

    it('returns 404 for unknown node', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps/1/workflows/wf-1-1/nodes/unknown-node')
      const response = await GET(request, makeParams('1', 'wf-1-1', 'unknown-node'))
      expect(response.status).toBe(404)
    })
  })
})
