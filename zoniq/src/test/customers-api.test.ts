import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Clerk
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  clerkClient: vi.fn(),
}))

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('@/lib/db/schema', () => ({
  customers: {
    id: 'id',
    organizationId: 'organization_id',
    name: 'name',
    description: 'description',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
}))

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// Helper to create chain mock
function createSelectChain(result: unknown[]) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue(result),
  }
  ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue(chain)
  return chain
}

function createInsertChain(result: unknown[]) {
  const chain = {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(result),
  }
  ;(db.insert as ReturnType<typeof vi.fn>).mockReturnValue(chain)
  return chain
}

function mockAuth(userId: string | null, orgId: string | null = 'org_123') {
  ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ userId, orgId })
}

function mockClerkUser(roles: string[]) {
  ;(clerkClient as ReturnType<typeof vi.fn>).mockResolvedValue({
    users: {
      getUser: vi.fn().mockResolvedValue({
        privateMetadata: { roles },
      }),
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Customer API - Authorization', () => {
  it('should reject unauthenticated requests', async () => {
    mockAuth(null)

    const { GET } = await import('@/app/api/customers/route')
    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error.code).toBe('UNAUTHORIZED')
  })

  it('should reject POST from consultant role', async () => {
    mockAuth('user_1')
    mockClerkUser(['consultant'])

    const { POST } = await import('@/app/api/customers/route')
    const request = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(403)
    expect(json.error.code).toBe('FORBIDDEN')
  })

  it('should allow GET for authenticated consultant', async () => {
    mockAuth('user_1')
    mockClerkUser(['consultant'])
    createSelectChain([])

    const { GET } = await import('@/app/api/customers/route')
    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.data).toEqual([])
  })
})

describe('Customer API - CRUD', () => {
  it('should create customer with valid data', async () => {
    mockAuth('user_1')
    mockClerkUser(['pm'])

    const customer = {
      id: '123',
      organizationId: 'org_123',
      name: 'Acme Corp',
      description: 'A test customer',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }
    createInsertChain([customer])

    const { POST } = await import('@/app/api/customers/route')
    const request = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Acme Corp', description: 'A test customer' }),
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.data.name).toBe('Acme Corp')
  })

  it('should reject create with empty name', async () => {
    mockAuth('user_1')
    mockClerkUser(['pm'])

    const { POST } = await import('@/app/api/customers/route')
    const request = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('should list customers for organization', async () => {
    mockAuth('user_1')
    mockClerkUser(['pm'])
    const mockCustomers = [
      { id: '1', name: 'Alpha', organizationId: 'org_123', appCount: 0 },
      { id: '2', name: 'Beta', organizationId: 'org_123', appCount: 2 },
    ]
    createSelectChain(mockCustomers)

    const { GET } = await import('@/app/api/customers/route')
    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.data).toHaveLength(2)
  })
})

describe('Customer API - Validation', () => {
  it('should validate name max length', async () => {
    mockAuth('user_1')
    mockClerkUser(['admin'])

    const { POST } = await import('@/app/api/customers/route')
    const request = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'a'.repeat(256) }),
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })
})
