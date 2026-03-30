import type { App, CreateAppInput, UpdateAppInput } from '@/types/app'
import { getCustomerById } from '@/lib/customers/mock-data'

// TODO: Replace with Drizzle ORM database queries when PostgreSQL is configured

let nextId = 6

const apps: App[] = [
  {
    id: '1',
    name: 'Claims Portal',
    description: 'Online claims submission and tracking portal',
    customerId: '1',
    customerName: 'Acme Insurance',
    mendixAppId: 'mx-acme-claims-001',
    version: '3.2.1',
    status: 'active',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-02-15T14:30:00.000Z',
    linkedProjectsCount: 2,
  },
  {
    id: '2',
    name: 'Policy Manager',
    description: 'Internal policy management system',
    customerId: '1',
    customerName: 'Acme Insurance',
    mendixAppId: 'mx-acme-policy-002',
    version: '2.0.0',
    status: 'active',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-01-25T09:00:00.000Z',
    updatedAt: '2026-01-25T09:00:00.000Z',
    linkedProjectsCount: 1,
  },
  {
    id: '3',
    name: 'Agent Dashboard',
    description: null,
    customerId: '1',
    customerName: 'Acme Insurance',
    mendixAppId: 'mx-acme-agent-003',
    version: '1.0.0',
    status: 'in-development',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-03-01T11:00:00.000Z',
    updatedAt: '2026-03-01T11:00:00.000Z',
    linkedProjectsCount: 0,
  },
  {
    id: '4',
    name: 'Trading Platform',
    description: 'Real-time trading and portfolio management',
    customerId: '2',
    customerName: 'Global Finance Corp',
    mendixAppId: 'mx-gfc-trading-001',
    version: '4.1.0',
    status: 'active',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-02-05T08:00:00.000Z',
    updatedAt: '2026-03-10T16:00:00.000Z',
    linkedProjectsCount: 0,
  },
  {
    id: '5',
    name: 'Risk Assessment Tool',
    description: 'Automated risk scoring and reporting',
    customerId: '2',
    customerName: 'Global Finance Corp',
    mendixAppId: 'mx-gfc-risk-002',
    version: '1.5.0',
    status: 'inactive',
    organizationId: 'org_default',
    isDeleted: false,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
    linkedProjectsCount: 0,
  },
]

export function getApps(customerId?: string): App[] {
  let result = apps.filter((a) => !a.isDeleted)
  if (customerId) {
    result = result.filter((a) => a.customerId === customerId)
  }
  return result
}

export function getAppById(id: string): App | undefined {
  return apps.find((a) => a.id === id && !a.isDeleted)
}

export function getAppsByCustomerId(customerId: string): App[] {
  return apps.filter((a) => a.customerId === customerId && !a.isDeleted)
}

export function createApp(input: CreateAppInput, organizationId: string): App | { error: string } {
  const customer = getCustomerById(input.customerId)
  if (!customer) {
    return { error: 'Customer not found' }
  }

  const now = new Date().toISOString()
  const app: App = {
    id: String(nextId++),
    name: input.name,
    description: input.description ?? null,
    customerId: input.customerId,
    customerName: customer.name,
    mendixAppId: input.mendixAppId,
    version: '1.0.0',
    status: 'in-development',
    organizationId,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    linkedProjectsCount: 0,
  }
  apps.push(app)
  return app
}

export function updateApp(id: string, input: UpdateAppInput): App | undefined {
  const app = apps.find((a) => a.id === id && !a.isDeleted)
  if (!app) return undefined

  if (input.name !== undefined) app.name = input.name
  if (input.description !== undefined) app.description = input.description ?? null
  if (input.version !== undefined) app.version = input.version
  if (input.status !== undefined) app.status = input.status
  app.updatedAt = new Date().toISOString()

  return app
}

export function deleteApp(id: string): { success: boolean; error?: string } {
  const app = apps.find((a) => a.id === id && !a.isDeleted)
  if (!app) {
    return { success: false, error: 'App not found' }
  }
  if (app.linkedProjectsCount > 0) {
    return { success: false, error: 'Cannot delete app with linked projects. Remove all projects first.' }
  }
  app.isDeleted = true
  app.updatedAt = new Date().toISOString()
  return { success: true }
}

export function getLinkedAppsCount(customerId: string): number {
  return apps.filter((a) => a.customerId === customerId && !a.isDeleted).length
}

export function resetApps(): void {
  apps.length = 0
  apps.push(
    {
      id: '1',
      name: 'Claims Portal',
      description: 'Online claims submission and tracking portal',
      customerId: '1',
      customerName: 'Acme Insurance',
      mendixAppId: 'mx-acme-claims-001',
      version: '3.2.1',
      status: 'active',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-01-20T10:00:00.000Z',
      updatedAt: '2026-02-15T14:30:00.000Z',
      linkedProjectsCount: 2,
    },
    {
      id: '2',
      name: 'Policy Manager',
      description: 'Internal policy management system',
      customerId: '1',
      customerName: 'Acme Insurance',
      mendixAppId: 'mx-acme-policy-002',
      version: '2.0.0',
      status: 'active',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-01-25T09:00:00.000Z',
      updatedAt: '2026-01-25T09:00:00.000Z',
      linkedProjectsCount: 1,
    },
    {
      id: '3',
      name: 'Agent Dashboard',
      description: null,
      customerId: '1',
      customerName: 'Acme Insurance',
      mendixAppId: 'mx-acme-agent-003',
      version: '1.0.0',
      status: 'in-development',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-03-01T11:00:00.000Z',
      updatedAt: '2026-03-01T11:00:00.000Z',
      linkedProjectsCount: 0,
    },
    {
      id: '4',
      name: 'Trading Platform',
      description: 'Real-time trading and portfolio management',
      customerId: '2',
      customerName: 'Global Finance Corp',
      mendixAppId: 'mx-gfc-trading-001',
      version: '4.1.0',
      status: 'active',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-02-05T08:00:00.000Z',
      updatedAt: '2026-03-10T16:00:00.000Z',
      linkedProjectsCount: 0,
    },
    {
      id: '5',
      name: 'Risk Assessment Tool',
      description: 'Automated risk scoring and reporting',
      customerId: '2',
      customerName: 'Global Finance Corp',
      mendixAppId: 'mx-gfc-risk-002',
      version: '1.5.0',
      status: 'inactive',
      organizationId: 'org_default',
      isDeleted: false,
      createdAt: '2026-02-10T10:00:00.000Z',
      updatedAt: '2026-02-10T10:00:00.000Z',
      linkedProjectsCount: 0,
    },
  )
  nextId = 6
}
