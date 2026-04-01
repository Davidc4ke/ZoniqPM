import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'
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

function makeRequest(method: string, body?: unknown) {
  return new Request('http://localhost/api/customers/1', {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  })
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('/api/customers/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetCustomers()
    resetApps()
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const response = await GET(makeRequest('GET'), makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('returns customer detail', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await GET(makeRequest('GET'), makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.name).toBe('Acme Insurance')
    })

    it('returns 404 for non-existent customer', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await GET(makeRequest('GET'), makeParams('999'))
      expect(response.status).toBe(404)
    })
  })

  describe('PUT', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const response = await PUT(makeRequest('PUT', { name: 'Updated' }), makeParams('1'))
      expect(response.status).toBe(401)
    })

    it('updates customer name', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await PUT(makeRequest('PUT', { name: 'Updated Name' }), makeParams('1'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.name).toBe('Updated Name')
    })

    it('returns 404 for non-existent customer', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await PUT(makeRequest('PUT', { name: 'Test' }), makeParams('999'))
      expect(response.status).toBe(404)
    })

    it('returns 400 for invalid input', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await PUT(makeRequest('PUT', { name: '' }), makeParams('1'))
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE', () => {
    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })
      const response = await DELETE(makeRequest('DELETE'), makeParams('3'))
      expect(response.status).toBe(401)
    })

    it('soft-deletes customer with no linked apps', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await DELETE(makeRequest('DELETE'), makeParams('3'))
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body.data.success).toBe(true)
    })

    it('returns 409 when customer has linked apps', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await DELETE(makeRequest('DELETE'), makeParams('1'))
      expect(response.status).toBe(409)
      const body = await response.json()
      expect(body.error.code).toBe('DELETE_BLOCKED')
    })

    it('returns 404 for non-existent customer', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })
      const response = await DELETE(makeRequest('DELETE'), makeParams('999'))
      expect(response.status).toBe(404)
    })
  })
})
