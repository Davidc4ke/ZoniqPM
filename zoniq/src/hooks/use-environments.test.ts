import { describe, it, expect } from 'vitest'

// Verify exports exist and hooks are callable (integration tested via component tests)
describe('use-environments', () => {
  it('exports useEnvironments hook', async () => {
    const mod = await import('./use-environments')
    expect(typeof mod.useEnvironments).toBe('function')
  })

  it('exports useCreateEnvironment hook', async () => {
    const mod = await import('./use-environments')
    expect(typeof mod.useCreateEnvironment).toBe('function')
  })

  it('exports useUpdateEnvironment hook', async () => {
    const mod = await import('./use-environments')
    expect(typeof mod.useUpdateEnvironment).toBe('function')
  })

  it('exports useDeleteEnvironment hook', async () => {
    const mod = await import('./use-environments')
    expect(typeof mod.useDeleteEnvironment).toBe('function')
  })
})
