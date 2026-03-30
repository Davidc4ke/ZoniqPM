import type { Module, CreateModuleInput, UpdateModuleInput } from '@/types/module'

// TODO: Replace with Drizzle ORM database queries when PostgreSQL is configured

let nextId = 100

function generateDefaultModules(appId: string): Module[] {
  const now = new Date().toISOString()
  const defaults: Array<{ name: string; description: string | null }> = [
    { name: 'Authentication', description: 'User authentication and authorization flows' },
    { name: 'Dashboard', description: 'Main dashboard and reporting views' },
    { name: 'Administration', description: 'Admin settings and configuration management' },
  ]

  return defaults.map((d, i) => ({
    id: `mod-${appId}-${i + 1}`,
    appId,
    name: d.name,
    description: d.description,
    featuresCount: 0,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  }))
}

// Pre-seed modules for apps 1-5
let modules: Module[] = [
  ...generateDefaultModules('1'),
  ...generateDefaultModules('2'),
  ...generateDefaultModules('3'),
  ...generateDefaultModules('4'),
  ...generateDefaultModules('5'),
]

export function getModulesByAppId(appId: string): Module[] {
  return modules.filter((m) => m.appId === appId && !m.isDeleted)
}

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id && !m.isDeleted)
}

export function createModule(appId: string, input: CreateModuleInput): Module {
  const now = new Date().toISOString()
  const mod: Module = {
    id: `mod-${nextId++}`,
    appId,
    name: input.name,
    description: input.description ?? null,
    featuresCount: 0,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  }
  modules.push(mod)
  return mod
}

export function updateModule(id: string, input: UpdateModuleInput): Module | undefined {
  const mod = modules.find((m) => m.id === id && !m.isDeleted)
  if (!mod) return undefined

  if (input.name !== undefined) mod.name = input.name
  if (input.description !== undefined) mod.description = input.description
  mod.updatedAt = new Date().toISOString()

  return mod
}

export function deleteModule(id: string): { success: boolean; error?: string } {
  const mod = modules.find((m) => m.id === id && !m.isDeleted)
  if (!mod) {
    return { success: false, error: 'Module not found' }
  }
  mod.isDeleted = true
  mod.updatedAt = new Date().toISOString()
  return { success: true }
}

export function resetModules(): void {
  modules = [
    ...generateDefaultModules('1'),
    ...generateDefaultModules('2'),
    ...generateDefaultModules('3'),
    ...generateDefaultModules('4'),
    ...generateDefaultModules('5'),
  ]
  nextId = 100
}
