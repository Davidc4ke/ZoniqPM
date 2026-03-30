import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useModuleCoverage, useFeatureCoverage, useFeatureTestItems } from './use-test-coverage'
import React from 'react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useModuleCoverage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches module coverage for an app', async () => {
    const mockData = [
      { moduleId: 'mod-1-1', moduleName: 'Auth', totalTests: 10, passedTests: 8, failedTests: 1, pendingTests: 1, coveragePercentage: 80, healthStatus: 'excellent' },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    })

    const { result } = renderHook(() => useModuleCoverage('1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/test-coverage')
  })

  it('does not fetch when appId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useModuleCoverage(''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('useFeatureCoverage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches feature coverage for a module', async () => {
    const mockData = [
      { featureId: 'feat-1', featureName: 'Login', totalTests: 5, passedTests: 4, failedTests: 1, pendingTests: 0, coveragePercentage: 80 },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    })

    const { result } = renderHook(() => useFeatureCoverage('1', 'mod-1-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/test-coverage/modules/mod-1-1')
  })

  it('does not fetch when moduleId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useFeatureCoverage('1', ''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('does not fetch when appId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useFeatureCoverage('', 'mod-1-1'), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('useFeatureTestItems', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches test items for a feature', async () => {
    const mockData = [
      { id: 'ti-1', name: 'Login test', type: 'test-script', status: 'passed' },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    })

    const { result } = renderHook(() => useFeatureTestItems('1', 'feat-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/api/apps/1/test-coverage/features/feat-1')
  })

  it('does not fetch when featureId is empty', () => {
    global.fetch = vi.fn()
    renderHook(() => useFeatureTestItems('1', ''), { wrapper: createWrapper() })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
