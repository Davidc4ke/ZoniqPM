import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useWorkflows, useWorkflowDetail, useNodeDetail } from './use-workflows'
import React from 'react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useWorkflows', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches workflows for an app', async () => {
    const mockData = [
      { id: 'wf-1', name: 'Claims Processing', description: 'Test', status: 'active', stepCount: 5, updatedAt: '2026-03-15T10:00:00Z' },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    })

    const { result } = renderHook(() => useWorkflows('1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/workflows')
  })

  it('does not fetch when appId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useWorkflows(''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('useWorkflowDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches workflow detail', async () => {
    const mockData = {
      id: 'wf-1',
      name: 'Claims Processing',
      description: 'Test',
      status: 'active',
      stepCount: 2,
      updatedAt: '2026-03-15T10:00:00Z',
      nodes: [{ id: 'node-1', type: 'workflowStep', position: { x: 0, y: 0 }, data: { label: 'Step 1', description: 'Desc', status: 'completed' } }],
      edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
    }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    })

    const { result } = renderHook(() => useWorkflowDetail('1', 'wf-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/workflows/wf-1')
  })

  it('does not fetch when workflowId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useWorkflowDetail('1', ''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('does not fetch when appId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useWorkflowDetail('', 'wf-1'), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('useNodeDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches node detail with linked stories', async () => {
    const mockData = {
      id: 'node-1',
      label: 'Claim Intake',
      description: 'Receive claims',
      status: 'completed',
      linkedStories: [{ id: 'story-1', title: 'Web form', status: 'done' }],
    }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    })

    const { result } = renderHook(() => useNodeDetail('1', 'wf-1', 'node-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/workflows/wf-1/nodes/node-1')
  })

  it('does not fetch when nodeId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useNodeDetail('1', 'wf-1', ''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
