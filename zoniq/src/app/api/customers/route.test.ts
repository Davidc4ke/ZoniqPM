import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { resetCustomers } from '@/lib/customers/mock-data'
import { resetApps } from '@/lib/apps/mock-data'

const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

vi.mock('@/lib/customers/queries', async () => {
  const mock = await vi.importActual<typeof import('@/lib/customers/mock-data')>('@/lib/customers/mock-data')
  return {
    getCustomers: async () => mock.getCustomers(),
    getCustomerById: async (id: string) => mock.getCustomerById(id),
    createCustomer: async (input: Parameters<typeof mock.createCustomer>[0], orgId: string) => mock.createCustomer(input, orgId),
    updateCustomer: async (id: string, input: Parameters<typeof mock.updateCustomer>[1]) => mock.updateCustomer(id, input),
    deleteCustomer: async (id: string) => mock.deleteCustomer(id),
  }
})

describe('/api/customers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetCustomers()
    resetApps()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const response = await GET()
      expect(response.status).toBe(401)
    })

    it('returns customer list when authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await GET()
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data).toBeInstanceOf(Array)
      expect(body.data.length).toBe(4)
      expect(body.meta.total).toBe(4)
    })

    it('returns customers with expected fields', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await GET()
      const body = await response.json()
      expect(body.data[0]).toHaveProperty('id')
      expect(body.data[0]).toHaveProperty('name')
      expect(body.data[0]).toHaveProperty('description')
      expect(body.data[0]).toHaveProperty('linkedAppsCount')
    })
  })

  describe('POST', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const request = new Request('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(401)
    })

    it('creates a customer with valid input', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Customer', description: 'A desc' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(201)
      const body = await response.json()
      expect(body.data.name).toBe('New Customer')
      expect(body.data.description).toBe('A desc')
    })

    it('returns 400 for missing name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 400 for invalid JSON', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const request = new Request('http://localhost/api/customers', {
        method: 'POST',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })
})
