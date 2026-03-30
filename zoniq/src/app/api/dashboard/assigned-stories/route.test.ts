import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

describe('GET /api/dashboard/assigned-stories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    const response = await GET()
    expect(response.status).toBe(401)
    const body = await response.json()
    expect(body.error).toBeDefined()
    expect(body.error.code).toBe('UNAUTHORIZED')
  })

  it('returns assigned stories in { data } format', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' })
    const response = await GET()
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.data).toBeInstanceOf(Array)
    expect(body.data.length).toBeGreaterThan(0)
    expect(body.data[0]).toHaveProperty('id')
    expect(body.data[0]).toHaveProperty('title')
    expect(body.data[0]).toHaveProperty('priority')
  })
})
