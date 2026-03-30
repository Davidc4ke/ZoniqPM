import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCustomers, useCustomer, useCreateCustomer, useDeleteCustomer } from './use-customers'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useCustomers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches customer list', async () => {
    const mockData = [{ id: '1', name: 'Test Corp' }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockData }), { status: 200 })
    )

    const { result } = renderHook(() => useCustomers(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('handles fetch error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { message: 'Server error' } }), { status: 500 })
    )

    const { result } = renderHook(() => useCustomers(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toContain('Server error')
  })
})

describe('useCustomer', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches single customer by id', async () => {
    const mockCustomer = { id: '1', name: 'Test Corp' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockCustomer }), { status: 200 })
    )

    const { result } = renderHook(() => useCustomer('1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockCustomer)
  })
})

describe('useCreateCustomer', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a customer', async () => {
    const created = { id: '5', name: 'New Corp' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: created }), { status: 201 })
    )

    const { result } = renderHook(() => useCreateCustomer(), { wrapper: createWrapper() })
    result.current.mutate({ name: 'New Corp' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(created)
  })
})

describe('useDeleteCustomer', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('handles deletion error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ error: { message: 'Cannot delete customer with linked apps' } }),
        { status: 409 }
      )
    )

    const { result } = renderHook(() => useDeleteCustomer(), { wrapper: createWrapper() })
    result.current.mutate('1')

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toContain('linked apps')
  })
})
