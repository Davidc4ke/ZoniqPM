import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppList } from './app-list'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}))

vi.mock('@/hooks/use-apps', () => ({
  useApps: vi.fn(),
}))

vi.mock('./add-app-dialog', () => ({
  AddAppDialog: () => React.createElement('button', null, 'Add App'),
}))

import { useApps } from '@/hooks/use-apps'
const mockUseApps = vi.mocked(useApps)

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

describe('AppList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton', () => {
    mockUseApps.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null } as ReturnType<typeof useApps>)
    renderWithProviders(React.createElement(AppList, { customerId: '1' }))
    expect(screen.getByText('Linked Apps')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseApps.mockReturnValue({ data: undefined, isLoading: false, isError: true, error: new Error('Failed') } as ReturnType<typeof useApps>)
    renderWithProviders(React.createElement(AppList, { customerId: '1' }))
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    mockUseApps.mockReturnValue({ data: [], isLoading: false, isError: false, error: null } as ReturnType<typeof useApps>)
    renderWithProviders(React.createElement(AppList, { customerId: '1' }))
    expect(screen.getByText('No apps yet')).toBeInTheDocument()
  })

  it('renders app cards', () => {
    mockUseApps.mockReturnValue({
      data: [
        { id: '1', name: 'Claims Portal', description: 'A portal', status: 'active', customerId: '1' },
        { id: '2', name: 'Policy Manager', description: null, status: 'in-development', customerId: '1' },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useApps>)
    renderWithProviders(React.createElement(AppList, { customerId: '1' }))
    expect(screen.getByText('Claims Portal')).toBeInTheDocument()
    expect(screen.getByText('Policy Manager')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('In Development')).toBeInTheDocument()
  })

  it('renders Add App button', () => {
    mockUseApps.mockReturnValue({ data: [], isLoading: false, isError: false, error: null } as ReturnType<typeof useApps>)
    renderWithProviders(React.createElement(AppList, { customerId: '1' }))
    expect(screen.getByText('Add App')).toBeInTheDocument()
  })

  it('passes customerId to useApps', () => {
    mockUseApps.mockReturnValue({ data: [], isLoading: false, isError: false, error: null } as ReturnType<typeof useApps>)
    renderWithProviders(React.createElement(AppList, { customerId: 'cust-42' }))
    expect(mockUseApps).toHaveBeenCalledWith('cust-42')
  })
})
