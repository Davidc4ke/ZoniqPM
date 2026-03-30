import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFeatures, useCreateFeature, useUpdateFeature, useDeleteFeature } from './use-features'
import React from 'react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useFeatures', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches features for a module', async () => {
    const mockFeatures = [
      { id: 'feat-1', moduleId: 'mod-1', appId: '1', name: 'Login', description: null, linkedStoriesCount: 0, isDeleted: false, createdAt: '', updatedAt: '' },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockFeatures }),
    })

    const { result } = renderHook(() => useFeatures('1', 'mod-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockFeatures)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules/mod-1/features')
  })

  it('does not fetch when moduleId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useFeatures('1', ''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('useCreateFeature', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a feature via POST', async () => {
    const mockFeature = { id: 'feat-100', moduleId: 'mod-1', appId: '1', name: 'New', description: null, linkedStoriesCount: 0, isDeleted: false, createdAt: '', updatedAt: '' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockFeature }),
    })

    const { result } = renderHook(() => useCreateFeature('1', 'mod-1'), { wrapper: createWrapper() })
    result.current.mutate({ name: 'New' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules/mod-1/features', expect.objectContaining({ method: 'POST' }))
  })

  it('throws on error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Validation failed' } }),
    })

    const { result } = renderHook(() => useCreateFeature('1', 'mod-1'), { wrapper: createWrapper() })
    result.current.mutate({ name: '' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Validation failed')
  })
})

describe('useUpdateFeature', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('updates a feature via PUT', async () => {
    const mockFeature = { id: 'feat-1', moduleId: 'mod-1', appId: '1', name: 'Updated', description: null, linkedStoriesCount: 0, isDeleted: false, createdAt: '', updatedAt: '' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockFeature }),
    })

    const { result } = renderHook(() => useUpdateFeature('1', 'mod-1'), { wrapper: createWrapper() })
    result.current.mutate({ featureId: 'feat-1', input: { name: 'Updated' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules/mod-1/features/feat-1', expect.objectContaining({ method: 'PUT' }))
  })
})

describe('useDeleteFeature', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('deletes a feature via DELETE', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { success: true } }),
    })

    const { result } = renderHook(() => useDeleteFeature('1', 'mod-1'), { wrapper: createWrapper() })
    result.current.mutate('feat-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/modules/mod-1/features/feat-1', expect.objectContaining({ method: 'DELETE' }))
  })

  it('throws on error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Cannot delete feature with linked stories' } }),
    })

    const { result } = renderHook(() => useDeleteFeature('1', 'mod-1'), { wrapper: createWrapper() })
    result.current.mutate('feat-1')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
