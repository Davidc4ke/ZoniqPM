import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

describe('GET /api/dashboard/review-queue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    const response = await GET()
    expect(response.status).toBe(401)
  })

  it('returns review queue with data and meta.total', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' })
    const response = await GET()
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.data).toBeInstanceOf(Array)
    expect(body.meta).toBeDefined()
    expect(body.meta.total).toBe(body.data.length)
    for (const story of body.data) {
      expect(['ready', 'review']).toContain(story.status)
    }
  })
})
