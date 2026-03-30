import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { resetApps } from '@/lib/apps/mock-data'
import { resetCustomers } from '@/lib/customers/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

describe('/api/apps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetApps()
    resetCustomers()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps')
      const response = await GET(request)
      expect(response.status).toBe(401)
    })

    it('returns all apps when authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps')
      const response = await GET(request)
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toBeInstanceOf(Array)
      expect(body.data.length).toBe(5)
      expect(body.meta.total).toBe(5)
    })

    it('filters by customerId query param', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps?customerId=1')
      const response = await GET(request)
      const body = await response.json()
      expect(body.data.length).toBe(3)
      expect(body.data.every((a: { customerId: string }) => a.customerId === '1')).toBe(true)
    })

    it('returns apps with expected fields', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps')
      const response = await GET(request)
      const body = await response.json()
      expect(body.data[0]).toHaveProperty('id')
      expect(body.data[0]).toHaveProperty('name')
      expect(body.data[0]).toHaveProperty('customerId')
      expect(body.data[0]).toHaveProperty('mendixAppId')
      expect(body.data[0]).toHaveProperty('status')
      expect(body.data[0]).toHaveProperty('linkedProjectsCount')
    })
  })

  describe('POST', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/apps', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test', customerId: '1', mendixAppId: 'mx-001' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(401)
    })

    it('creates an app with valid input', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps', {
        method: 'POST',
        body: JSON.stringify({ name: 'New App', customerId: '1', mendixAppId: 'mx-new-001' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data.name).toBe('New App')
      expect(body.data.customerId).toBe('1')
      expect(body.data.mendixAppId).toBe('mx-new-001')
      expect(body.data.customerName).toBe('Acme Insurance')
    })

    it('returns 400 for missing required fields', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 400 for invalid customer', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps', {
        method: 'POST',
        body: JSON.stringify({ name: 'App', customerId: 'nonexistent', mendixAppId: 'mx-001' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error.message).toContain('Customer not found')
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/apps', {
        method: 'POST',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })
})
