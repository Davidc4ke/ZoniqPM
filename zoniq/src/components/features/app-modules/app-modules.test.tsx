import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppModules } from './app-modules'

vi.mock('@/hooks/use-modules', () => ({
  useModules: vi.fn(),
  useCreateModule: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useUpdateModule: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteModule: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

import { useModules } from '@/hooks/use-modules'
const mockUseModules = vi.mocked(useModules)

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

const mockModules = [
  {
    id: 'mod-1',
    appId: '1',
    name: 'Authentication',
    description: 'User authentication and authorization flows',
    featuresCount: 0,
    isDeleted: false,
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-02-15T10:30:00Z',
  },
  {
    id: 'mod-2',
    appId: '1',
    name: 'Dashboard',
    description: 'Main dashboard and reporting views',
    featuresCount: 0,
    isDeleted: false,
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-02-15T10:30:00Z',
  },
  {
    id: 'mod-3',
    appId: '1',
    name: 'Administration',
    description: null,
    featuresCount: 0,
    isDeleted: false,
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-02-15T10:30:00Z',
  },
]

describe('AppModules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton', () => {
    mockUseModules.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    const { container } = renderWithProviders(
      React.createElement(AppModules, { appId: '1' })
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseModules.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load modules'),
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    expect(screen.getByText('Failed to load modules')).toBeInTheDocument()
  })

  it('renders module cards', () => {
    mockUseModules.mockReturnValue({
      data: mockModules,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    expect(screen.getByText('Authentication')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Administration')).toBeInTheDocument()
  })

  it('renders module descriptions', () => {
    mockUseModules.mockReturnValue({
      data: mockModules,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    expect(screen.getByText('User authentication and authorization flows')).toBeInTheDocument()
    expect(screen.getByText('Main dashboard and reporting views')).toBeInTheDocument()
  })

  it('renders Add Module button', () => {
    mockUseModules.mockReturnValue({
      data: mockModules,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    expect(screen.getByText('Add Module')).toBeInTheDocument()
  })

  it('opens add dialog when Add Module clicked', () => {
    mockUseModules.mockReturnValue({
      data: mockModules,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    fireEvent.click(screen.getByText('Add Module'))
    expect(screen.getByText('Add Module', { selector: 'h2' })).toBeInTheDocument()
  })

  it('renders edit button for each module', () => {
    mockUseModules.mockReturnValue({
      data: mockModules,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    const editButtons = screen.getAllByText('Edit')
    expect(editButtons).toHaveLength(3)
  })

  it('renders delete button for each module', () => {
    mockUseModules.mockReturnValue({
      data: mockModules,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(3)
  })

  it('renders empty state when no modules', () => {
    mockUseModules.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    expect(screen.getByText(/No modules yet/)).toBeInTheDocument()
  })

  it('renders features count for each module', () => {
    mockUseModules.mockReturnValue({
      data: mockModules,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useModules>)
    renderWithProviders(React.createElement(AppModules, { appId: '1' }))
    const featureLabels = screen.getAllByText(/0 features/)
    expect(featureLabels).toHaveLength(3)
  })
})
