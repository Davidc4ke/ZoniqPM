import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import {
  useAssignedStories,
  useReviewQueue,
  useProjects,
  useApps,
  useTeamActivity,
} from './use-dashboard'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockAssignedStories = [
  { id: '1', number: 47, title: 'Test', status: 'in-progress', priority: 'high', projectName: 'P1' },
]
const mockReviewQueue = [
  { id: '4', number: 44, title: 'Review', status: 'ready', priority: 'high', projectName: 'P1' },
]
const mockProjects = [
  { id: '1', name: 'Project', progress: 50, columns: { backlog: 1, active: 2, testing: 0, review: 1, done: 5 } },
]
const mockApps = [
  { id: '1', name: 'App', environments: [{ name: 'Dev', status: 'healthy' }], warnings: 0 },
]
const mockActivity = [
  { id: '1', user: { name: 'A', initials: 'A', color: 'bg-green' }, action: 'created', highlight: '#1', time: '1m ago' },
]

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useAssignedStories', () => {
  it('fetches assigned stories', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockAssignedStories }), { status: 200 })
    )
    const { result } = renderHook(() => useAssignedStories(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockAssignedStories)
  })
})

describe('useReviewQueue', () => {
  it('fetches review queue with total', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockReviewQueue, meta: { total: 1 } }), { status: 200 })
    )
    const { result } = renderHook(() => useReviewQueue(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toEqual(mockReviewQueue)
    expect(result.current.data?.meta.total).toBe(1)
  })
})

describe('useProjects', () => {
  it('fetches projects', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockProjects }), { status: 200 })
    )
    const { result } = renderHook(() => useProjects(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockProjects)
  })
})

describe('useApps', () => {
  it('fetches apps', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockApps }), { status: 200 })
    )
    const { result } = renderHook(() => useApps(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockApps)
  })
})

describe('useTeamActivity', () => {
  it('fetches team activity', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockActivity }), { status: 200 })
    )
    const { result } = renderHook(() => useTeamActivity(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockActivity)
  })
})
