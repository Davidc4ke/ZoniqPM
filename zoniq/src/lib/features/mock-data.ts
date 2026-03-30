import type { Feature, LinkedStory, CreateFeatureInput, UpdateFeatureInput } from '@/types/feature'

// TODO: Replace with Drizzle ORM database queries when PostgreSQL is configured

let nextId = 100

function generateDefaultFeatures(moduleId: string, appId: string): Feature[] {
  const now = new Date().toISOString()
  const defaults: Array<{ name: string; description: string | null; linkedStoriesCount: number }> = [
    { name: 'Login Flow', description: 'User login and session management', linkedStoriesCount: 2 },
    { name: 'Data Validation', description: 'Input validation and error handling', linkedStoriesCount: 1 },
  ]

  return defaults.map((d, i) => ({
    id: `feat-${moduleId}-${i + 1}`,
    moduleId,
    appId,
    name: d.name,
    description: d.description,
    linkedStoriesCount: d.linkedStoriesCount,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  }))
}

// Pre-seed features for modules across apps 1-5 (3 modules per app)
function generateAllFeatures(): Feature[] {
  const all: Feature[] = []
  for (let appId = 1; appId <= 5; appId++) {
    for (let modIdx = 1; modIdx <= 3; modIdx++) {
      all.push(...generateDefaultFeatures(`mod-${appId}-${modIdx}`, String(appId)))
    }
  }
  return all
}

let features: Feature[] = generateAllFeatures()

// Mock linked stories data
const mockLinkedStories: Record<string, LinkedStory[]> = {}

function generateLinkedStories(featureId: string, count: number): LinkedStory[] {
  const statuses = ['backlog', 'in-progress', 'review', 'done']
  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma']
  return Array.from({ length: count }, (_, i) => ({
    id: `story-${featureId}-${i + 1}`,
    title: `Story ${i + 1} for ${featureId}`,
    status: statuses[i % statuses.length],
    projectName: projects[i % projects.length],
  }))
}

function initLinkedStories(): void {
  for (const feat of features) {
    if (feat.linkedStoriesCount > 0) {
      mockLinkedStories[feat.id] = generateLinkedStories(feat.id, feat.linkedStoriesCount)
    }
  }
}

initLinkedStories()

export function getFeaturesByModuleId(moduleId: string): Feature[] {
  return features.filter((f) => f.moduleId === moduleId && !f.isDeleted)
}

export function getFeatureById(id: string): Feature | undefined {
  return features.find((f) => f.id === id && !f.isDeleted)
}

export function createFeature(moduleId: string, appId: string, input: CreateFeatureInput): Feature {
  const now = new Date().toISOString()
  const feat: Feature = {
    id: `feat-${nextId++}`,
    moduleId,
    appId,
    name: input.name,
    description: input.description ?? null,
    linkedStoriesCount: 0,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  }
  features.push(feat)
  return feat
}

export function updateFeature(id: string, input: UpdateFeatureInput): Feature | undefined {
  const feat = features.find((f) => f.id === id && !f.isDeleted)
  if (!feat) return undefined

  if (input.name !== undefined) feat.name = input.name
  if (input.description !== undefined) feat.description = input.description
  feat.updatedAt = new Date().toISOString()

  return feat
}

export function deleteFeature(id: string): { success: boolean; error?: string } {
  const feat = features.find((f) => f.id === id && !f.isDeleted)
  if (!feat) {
    return { success: false, error: 'Feature not found' }
  }
  if (feat.linkedStoriesCount > 0) {
    return { success: false, error: 'Cannot delete feature with linked stories' }
  }
  feat.isDeleted = true
  feat.updatedAt = new Date().toISOString()
  return { success: true }
}

export function getLinkedStoriesByFeatureId(featureId: string): LinkedStory[] {
  return mockLinkedStories[featureId] ?? []
}

export function resetFeatures(): void {
  features = generateAllFeatures()
  // Clear and regenerate linked stories
  Object.keys(mockLinkedStories).forEach((key) => delete mockLinkedStories[key])
  nextId = 100
  initLinkedStories()
}
