import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppDetail } from './app-detail'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/hooks/use-apps', () => ({
  useApp: vi.fn(),
  useUpdateApp: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteApp: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

import { useApp } from '@/hooks/use-apps'
const mockUseApp = vi.mocked(useApp)

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

const mockApp = {
  id: '1',
  name: 'Claims Portal',
  description: 'Online claims submission',
  customerId: '1',
  customerName: 'Acme Insurance',
  mendixAppId: 'mx-acme-claims-001',
  version: '3.2.1',
  status: 'active' as const,
  organizationId: 'org_default',
  isDeleted: false,
  createdAt: '2026-01-20T10:00:00.000Z',
  updatedAt: '2026-02-15T14:30:00.000Z',
  linkedProjectsCount: 2,
}

describe('AppDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton', () => {
    mockUseApp.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null } as ReturnType<typeof useApp>)
    const { container } = renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseApp.mockReturnValue({ data: undefined, isLoading: false, isError: true, error: new Error('Load failed') } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('Load failed')).toBeInTheDocument()
  })

  it('renders not found state', () => {
    mockUseApp.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '999' }))
    expect(screen.getByText('App not found')).toBeInTheDocument()
  })

  it('renders app details', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('Claims Portal')).toBeInTheDocument()
    expect(screen.getByText('Online claims submission')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('3.2.1')).toBeInTheDocument()
    expect(screen.getByText('mx-acme-claims-001')).toBeInTheDocument()
    expect(screen.getByText('Acme Insurance')).toBeInTheDocument()
    expect(screen.getByText('2 projects')).toBeInTheDocument()
  })

  it('renders back link to customer', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('Back to Acme Insurance')).toBeInTheDocument()
  })

  it('renders edit and delete buttons', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('opens edit dialog when Edit clicked', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    fireEvent.click(screen.getByText('Edit'))
    expect(screen.getByText('Edit App')).toBeInTheDocument()
  })

  it('opens delete dialog when Delete clicked', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByText('Delete App')).toBeInTheDocument()
  })

  it('shows linked projects prevention in delete dialog', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByText(/Cannot delete/)).toBeInTheDocument()
    expect(screen.getByText(/2 linked projects/)).toBeInTheDocument()
  })
})
