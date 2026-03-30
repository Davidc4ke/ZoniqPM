import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppFeatures } from './app-features'

vi.mock('@/hooks/use-features', () => ({
  useFeatures: vi.fn(),
  useCreateFeature: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useUpdateFeature: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteFeature: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

import { useFeatures } from '@/hooks/use-features'
const mockUseFeatures = vi.mocked(useFeatures)

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

const mockFeatures = [
  {
    id: 'feat-1',
    moduleId: 'mod-1',
    appId: '1',
    name: 'Login Flow',
    description: 'User login and session management',
    linkedStoriesCount: 2,
    isDeleted: false,
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-02-15T10:30:00Z',
  },
  {
    id: 'feat-2',
    moduleId: 'mod-1',
    appId: '1',
    name: 'Data Validation',
    description: null,
    linkedStoriesCount: 0,
    isDeleted: false,
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-02-15T10:30:00Z',
  },
]

const defaultProps = {
  appId: '1',
  moduleId: 'mod-1',
  moduleName: 'Authentication',
  onBack: vi.fn(),
}

describe('AppFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton', () => {
    mockUseFeatures.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    const { container } = renderWithProviders(
      React.createElement(AppFeatures, defaultProps)
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseFeatures.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load features'),
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    expect(screen.getByText('Failed to load features')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    mockUseFeatures.mockReturnValue({
      data: mockFeatures,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    expect(screen.getByText('Login Flow')).toBeInTheDocument()
    expect(screen.getByText('Data Validation')).toBeInTheDocument()
  })

  it('renders module name in header', () => {
    mockUseFeatures.mockReturnValue({
      data: mockFeatures,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    expect(screen.getByText('Authentication — Features')).toBeInTheDocument()
  })

  it('renders Add Feature button', () => {
    mockUseFeatures.mockReturnValue({
      data: mockFeatures,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    expect(screen.getByText('Add Feature')).toBeInTheDocument()
  })

  it('opens add dialog when Add Feature clicked', () => {
    mockUseFeatures.mockReturnValue({
      data: mockFeatures,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    fireEvent.click(screen.getByText('Add Feature'))
    expect(screen.getByText('Add Feature', { selector: 'h2' })).toBeInTheDocument()
  })

  it('renders edit button for each feature', () => {
    mockUseFeatures.mockReturnValue({
      data: mockFeatures,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    const editButtons = screen.getAllByText('Edit')
    expect(editButtons).toHaveLength(2)
  })

  it('renders delete button for each feature', () => {
    mockUseFeatures.mockReturnValue({
      data: mockFeatures,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(2)
  })

  it('renders empty state when no features', () => {
    mockUseFeatures.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    expect(screen.getByText(/No features yet/)).toBeInTheDocument()
  })

  it('renders linked stories count for each feature', () => {
    mockUseFeatures.mockReturnValue({
      data: mockFeatures,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFeatures>)
    renderWithProviders(React.createElement(AppFeatures, defaultProps))
    expect(screen.getByText('2 stories')).toBeInTheDocument()
    expect(screen.getByText('0 stories')).toBeInTheDocument()
  })
})
