import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

describe('GET /api/dashboard/activity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    const response = await GET()
    expect(response.status).toBe(401)
  })

  it('returns activity items', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' })
    const response = await GET()
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.data).toBeInstanceOf(Array)
    expect(body.data[0]).toHaveProperty('user')
    expect(body.data[0]).toHaveProperty('action')
    expect(body.data[0]).toHaveProperty('time')
  })
})
