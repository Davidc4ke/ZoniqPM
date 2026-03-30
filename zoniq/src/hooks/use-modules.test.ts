import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useModules, useCreateModule, useUpdateModule, useDeleteModule } from './use-modules'
import React from 'react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useModules', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches modules for an app', async () => {
    const mockModules = [
      { id: 'mod-1', appId: '1', name: 'Auth', description: null, featuresCount: 0, isDeleted: false, createdAt: '', updatedAt: '' },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockModules }),
    })

    const { result } = renderHook(() => useModules('1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockModules)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules')
  })

  it('does not fetch when appId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useModules(''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('useCreateModule', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a module via POST', async () => {
    const mockModule = { id: 'mod-100', appId: '1', name: 'New', description: null, featuresCount: 0, isDeleted: false, createdAt: '', updatedAt: '' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockModule }),
    })

    const { result } = renderHook(() => useCreateModule('1'), { wrapper: createWrapper() })
    result.current.mutate({ name: 'New' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules', expect.objectContaining({ method: 'POST' }))
  })

  it('throws on error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Validation failed' } }),
    })

    const { result } = renderHook(() => useCreateModule('1'), { wrapper: createWrapper() })
    result.current.mutate({ name: '' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Validation failed')
  })
})

describe('useUpdateModule', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('updates a module via PUT', async () => {
    const mockModule = { id: 'mod-1', appId: '1', name: 'Updated', description: null, featuresCount: 0, isDeleted: false, createdAt: '', updatedAt: '' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockModule }),
    })

    const { result } = renderHook(() => useUpdateModule('1'), { wrapper: createWrapper() })
    result.current.mutate({ moduleId: 'mod-1', input: { name: 'Updated' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules/mod-1', expect.objectContaining({ method: 'PUT' }))
  })
})

describe('useDeleteModule', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('deletes a module via DELETE', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { success: true } }),
    })

    const { result } = renderHook(() => useDeleteModule('1'), { wrapper: createWrapper() })
    result.current.mutate('mod-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules/mod-1', expect.objectContaining({ method: 'DELETE' }))
  })

  it('throws on error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Module not found' } }),
    })

    const { result } = renderHook(() => useDeleteModule('1'), { wrapper: createWrapper() })
    result.current.mutate('nonexistent')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
