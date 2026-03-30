import type { Customer, CreateCustomerInput, UpdateCustomerInput } from '@/types/customer'

// TODO: Replace with Drizzle ORM database queries when PostgreSQL is configured

let nextId = 5

const customers: Customer[] = [
  {
    id: '1',
    name: 'Acme Insurance',
    description: 'Large insurance provider with multiple Mendix apps',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
    linkedAppsCount: 3,
  },
  {
    id: '2',
    name: 'Global Finance Corp',
    description: 'Financial services company',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-02-01T09:00:00.000Z',
    updatedAt: '2026-02-01T09:00:00.000Z',
    linkedAppsCount: 2,
  },
  {
    id: '3',
    name: 'HealthTech Solutions',
    description: 'Healthcare technology startup',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-02-20T14:30:00.000Z',
    updatedAt: '2026-02-20T14:30:00.000Z',
    linkedAppsCount: 0,
  },
  {
    id: '4',
    name: 'RetailMax',
    description: null,
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
    linkedAppsCount: 0,
  },
]

export function getCustomers(): Customer[] {
  return customers.filter((c) => !c.isDeleted)
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id && !c.isDeleted)
}

export function createCustomer(input: CreateCustomerInput, organizationId: string): Customer {
  const now = new Date().toISOString()
  const customer: Customer = {
    id: String(nextId++),
    name: input.name,
    description: input.description ?? null,
    organizationId,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    linkedAppsCount: 0,
  }
  customers.push(customer)
  return customer
}

export function updateCustomer(id: string, input: UpdateCustomerInput): Customer | undefined {
  const customer = customers.find((c) => c.id === id && !c.isDeleted)
  if (!customer) return undefined

  if (input.name !== undefined) customer.name = input.name
  if (input.description !== undefined) customer.description = input.description ?? null
  customer.updatedAt = new Date().toISOString()

  return customer
}

export function deleteCustomer(id: string): { success: boolean; error?: string } {
  const customer = customers.find((c) => c.id === id && !c.isDeleted)
  if (!customer) {
    return { success: false, error: 'Customer not found' }
  }
  if (customer.linkedAppsCount > 0) {
    return { success: false, error: 'Cannot delete customer with linked apps. Remove all apps first.' }
  }
  customer.isDeleted = true
  customer.updatedAt = new Date().toISOString()
  return { success: true }
}

export function resetCustomers(): void {
  customers.length = 0
  customers.push(
    {
      id: '1',
      name: 'Acme Insurance',
      description: 'Large insurance provider with multiple Mendix apps',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-01-15T10:00:00.000Z',
      linkedAppsCount: 3,
    },
    {
      id: '2',
      name: 'Global Finance Corp',
      description: 'Financial services company',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-02-01T09:00:00.000Z',
      updatedAt: '2026-02-01T09:00:00.000Z',
      linkedAppsCount: 2,
    },
    {
      id: '3',
      name: 'HealthTech Solutions',
      description: 'Healthcare technology startup',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-02-20T14:30:00.000Z',
      updatedAt: '2026-02-20T14:30:00.000Z',
      linkedAppsCount: 0,
    },
    {
      id: '4',
      name: 'RetailMax',
      description: null,
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-03-01T08:00:00.000Z',
      updatedAt: '2026-03-01T08:00:00.000Z',
      linkedAppsCount: 0,
    },
  )
  nextId = 5
}
