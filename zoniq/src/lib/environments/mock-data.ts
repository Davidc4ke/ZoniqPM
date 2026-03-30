import type { Environment, CreateEnvironmentInput, UpdateEnvironmentInput } from '@/types/environment'

// TODO: Replace with Drizzle ORM database queries when PostgreSQL is configured

let nextId = 100

function generateDefaultEnvironments(appId: string): Environment[] {
  const now = new Date().toISOString()
  const defaults: Array<{ name: string; status: Environment['status']; version: string; url: string }> = [
    { name: 'Development', status: 'online', version: '3.2.1', url: `https://app-${appId}-dev.example.com` },
    { name: 'Test', status: 'online', version: '3.2.0', url: `https://app-${appId}-test.example.com` },
    { name: 'Acceptance', status: 'offline', version: '3.1.0', url: `https://app-${appId}-acc.example.com` },
    { name: 'Production', status: 'online', version: '3.0.0', url: `https://app-${appId}-prod.example.com` },
  ]

  return defaults.map((d, i) => ({
    id: `env-${appId}-${i + 1}`,
    appId,
    name: d.name,
    url: d.url,
    status: d.status,
    version: d.version,
    lastPing: now,
    createdAt: now,
    updatedAt: now,
  }))
}

// Pre-seed environments for apps 1-5
let environments: Environment[] = [
  ...generateDefaultEnvironments('1'),
  ...generateDefaultEnvironments('2'),
  ...generateDefaultEnvironments('3'),
  ...generateDefaultEnvironments('4'),
  ...generateDefaultEnvironments('5'),
]

export function getEnvironmentsByAppId(appId: string): Environment[] {
  return environments.filter((e) => e.appId === appId)
}

export function getEnvironmentById(id: string): Environment | undefined {
  return environments.find((e) => e.id === id)
}

export function createEnvironment(appId: string, input: CreateEnvironmentInput): Environment {
  const now = new Date().toISOString()
  const env: Environment = {
    id: `env-${nextId++}`,
    appId,
    name: input.name,
    url: input.url,
    status: 'offline',
    version: '—',
    lastPing: now,
    createdAt: now,
    updatedAt: now,
  }
  environments.push(env)
  return env
}

export function updateEnvironment(id: string, input: UpdateEnvironmentInput): Environment | undefined {
  const env = environments.find((e) => e.id === id)
  if (!env) return undefined

  if (input.name !== undefined) env.name = input.name
  if (input.url !== undefined) env.url = input.url
  env.updatedAt = new Date().toISOString()

  return env
}

export function deleteEnvironment(id: string): { success: boolean; error?: string } {
  const index = environments.findIndex((e) => e.id === id)
  if (index === -1) {
    return { success: false, error: 'Environment not found' }
  }
  environments.splice(index, 1)
  return { success: true }
}

export function resetEnvironments(): void {
  environments = [
    ...generateDefaultEnvironments('1'),
    ...generateDefaultEnvironments('2'),
    ...generateDefaultEnvironments('3'),
    ...generateDefaultEnvironments('4'),
    ...generateDefaultEnvironments('5'),
  ]
  nextId = 100
}
