import type { ModuleSuggestion } from '@/types/ai'

// TODO: Replace with real AI provider (Vercel AI SDK + Anthropic)
// This mock service generates module suggestions based on app context

const MODULE_TEMPLATES: Array<{ name: string; description: string }> = [
  { name: 'User Management', description: 'User registration, profiles, roles, and permissions management' },
  { name: 'Authentication', description: 'Login, logout, SSO, and session management flows' },
  { name: 'Dashboard', description: 'Main dashboard with KPIs, charts, and quick-access widgets' },
  { name: 'Notifications', description: 'In-app notifications, email alerts, and push notification handling' },
  { name: 'Reporting', description: 'Report generation, scheduling, and export functionality' },
  { name: 'Administration', description: 'System configuration, settings, and administrative tools' },
  { name: 'Data Import/Export', description: 'Bulk data import via CSV/Excel and export to various formats' },
  { name: 'Audit Trail', description: 'Activity logging, change tracking, and compliance audit records' },
  { name: 'Workflow Engine', description: 'Configurable approval workflows and business process automation' },
  { name: 'Document Management', description: 'File upload, storage, versioning, and document sharing' },
  { name: 'Search', description: 'Full-text search across entities with filters and saved searches' },
  { name: 'API Integration', description: 'REST/SOAP API connectors for third-party system integration' },
  { name: 'Task Management', description: 'Task creation, assignment, tracking, and deadline management' },
  { name: 'Communication', description: 'Internal messaging, comments, and collaboration features' },
  { name: 'Analytics', description: 'Usage analytics, performance metrics, and data visualization' },
]

let idCounter = 0

export function generateModuleSuggestions(
  appName: string,
  _appDescription: string,
  existingModules: string[]
): ModuleSuggestion[] {
  const existingLower = new Set(existingModules.map((m) => m.toLowerCase()))

  // Filter out modules that already exist
  const available = MODULE_TEMPLATES.filter(
    (t) => !existingLower.has(t.name.toLowerCase())
  )

  // Shuffle and pick 4-6 suggestions
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  const count = Math.min(shuffled.length, 4 + Math.floor(Math.random() * 3))
  const selected = shuffled.slice(0, count)

  return selected.map((s) => ({
    id: `suggestion-${++idCounter}`,
    name: s.name,
    description: `${s.description} — suggested for ${appName}`,
  }))
}
