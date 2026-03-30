import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppTestCoverage } from './app-test-coverage'

vi.mock('@/hooks/use-test-coverage', () => ({
  useModuleCoverage: vi.fn(),
  useFeatureCoverage: vi.fn(),
  useFeatureTestItems: vi.fn(),
}))

import { useModuleCoverage, useFeatureCoverage, useFeatureTestItems } from '@/hooks/use-test-coverage'
const mockUseModuleCoverage = vi.mocked(useModuleCoverage)
const mockUseFeatureCoverage = vi.mocked(useFeatureCoverage)
const mockUseFeatureTestItems = vi.mocked(useFeatureTestItems)

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

const mockModuleCoverage = [
  {
    moduleId: 'mod-1-1',
    moduleName: 'Authentication',
    totalTests: 10,
    passedTests: 9,
    failedTests: 1,
    pendingTests: 0,
    coveragePercentage: 90,
    healthStatus: 'excellent' as const,
  },
  {
    moduleId: 'mod-1-2',
    moduleName: 'Dashboard',
    totalTests: 8,
    passedTests: 5,
    failedTests: 2,
    pendingTests: 1,
    coveragePercentage: 63,
    healthStatus: 'good' as const,
  },
  {
    moduleId: 'mod-1-3',
    moduleName: 'Administration',
    totalTests: 4,
    passedTests: 1,
    failedTests: 2,
    pendingTests: 1,
    coveragePercentage: 25,
    healthStatus: 'critical' as const,
  },
]

const mockFeatureCoverage = [
  {
    featureId: 'feat-mod-1-1-1',
    featureName: 'Login Flow',
    totalTests: 5,
    passedTests: 5,
    failedTests: 0,
    pendingTests: 0,
    coveragePercentage: 100,
  },
  {
    featureId: 'feat-mod-1-1-2',
    featureName: 'Data Validation',
    totalTests: 5,
    passedTests: 4,
    failedTests: 1,
    pendingTests: 0,
    coveragePercentage: 80,
  },
]

const mockTestItems = [
  { id: 'ti-1', name: 'Validate login renders', type: 'test-script' as const, status: 'passed' as const },
  { id: 'ti-2', name: 'Verify login flow', type: 'uat-step' as const, status: 'failed' as const },
  { id: 'ti-3', name: 'Check edge cases', type: 'test-script' as const, status: 'pending' as const },
]

describe('AppTestCoverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseFeatureCoverage.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatureCoverage>)
    mockUseFeatureTestItems.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatureTestItems>)
  })

  it('renders loading skeleton', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    const { container } = renderWithProviders(
      React.createElement(AppTestCoverage, { appId: '1' })
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load coverage'),
    } as ReturnType<typeof useModuleCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))
    expect(screen.getByText('Failed to load coverage')).toBeInTheDocument()
  })

  it('renders empty state when no modules', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))
    expect(screen.getByText(/No test coverage data/)).toBeInTheDocument()
  })

  it('renders module coverage rows', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: mockModuleCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))
    expect(screen.getByText('Authentication')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Administration')).toBeInTheDocument()
  })

  it('renders health badges', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: mockModuleCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('renders coverage percentages', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: mockModuleCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))
    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.getByText('63%')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('renders test counts', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: mockModuleCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))
    expect(screen.getByText('10 tests')).toBeInTheDocument()
    expect(screen.getByText('8 tests')).toBeInTheDocument()
    expect(screen.getByText('4 tests')).toBeInTheDocument()
  })

  it('expands module to show features on click', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: mockModuleCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    mockUseFeatureCoverage.mockReturnValue({
      data: mockFeatureCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatureCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))

    // Click on Authentication module to expand
    fireEvent.click(screen.getByText('Authentication'))

    expect(screen.getByText('Login Flow')).toBeInTheDocument()
    expect(screen.getByText('Data Validation')).toBeInTheDocument()
  })

  it('shows test items when feature is clicked', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: mockModuleCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    mockUseFeatureCoverage.mockReturnValue({
      data: mockFeatureCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatureCoverage>)
    mockUseFeatureTestItems.mockReturnValue({
      data: mockTestItems,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatureTestItems>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))

    // Expand module
    fireEvent.click(screen.getByText('Authentication'))
    // Click feature
    fireEvent.click(screen.getByText('Login Flow'))

    expect(screen.getByText('Validate login renders')).toBeInTheDocument()
    expect(screen.getByText('Verify login flow')).toBeInTheDocument()
    expect(screen.getByText('Check edge cases')).toBeInTheDocument()
  })

  it('renders overall summary header', () => {
    mockUseModuleCoverage.mockReturnValue({
      data: mockModuleCoverage,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModuleCoverage>)
    renderWithProviders(React.createElement(AppTestCoverage, { appId: '1' }))
    expect(screen.getByText('Test Coverage')).toBeInTheDocument()
  })
})
