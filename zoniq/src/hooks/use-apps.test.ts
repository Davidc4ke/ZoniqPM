import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useApps, useApp, useCreateApp, useUpdateApp, useDeleteApp } from './use-apps'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useApps', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches app list', async () => {
    const mockData = [{ id: '1', name: 'Claims Portal' }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockData }), { status: 200 })
    )

    const { result } = renderHook(() => useApps(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('fetches apps filtered by customerId', async () => {
    const mockData = [{ id: '1', name: 'Claims Portal', customerId: '1' }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockData }), { status: 200 })
    )

    const { result } = renderHook(() => useApps('1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/apps?customerId=1')
  })

  it('handles fetch error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { message: 'Server error' } }), { status: 500 })
    )

    const { result } = renderHook(() => useApps(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toContain('Server error')
  })
})

describe('useApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches single app by id', async () => {
    const mockApp = { id: '1', name: 'Claims Portal' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockApp }), { status: 200 })
    )

    const { result } = renderHook(() => useApp('1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockApp)
  })
})

describe('useCreateApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('creates an app', async () => {
    const created = { id: '6', name: 'New App', customerId: '1' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: created }), { status: 201 })
    )

    const { result } = renderHook(() => useCreateApp(), { wrapper: createWrapper() })
    result.current.mutate({ name: 'New App', customerId: '1', mendixAppId: 'mx-001' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(created)
  })
})

describe('useUpdateApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('updates an app', async () => {
    const updated = { id: '1', name: 'Updated Portal' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: updated }), { status: 200 })
    )

    const { result } = renderHook(() => useUpdateApp('1'), { wrapper: createWrapper() })
    result.current.mutate({ name: 'Updated Portal' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(updated)
  })
})

describe('useDeleteApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('handles deletion error for app with linked projects', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ error: { message: 'Cannot delete app with linked projects' } }),
        { status: 409 }
      )
    )

    const { result } = renderHook(() => useDeleteApp(), { wrapper: createWrapper() })
    result.current.mutate('1')

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toContain('linked projects')
  })
})
