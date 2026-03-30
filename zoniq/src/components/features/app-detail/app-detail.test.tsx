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

vi.mock('@/hooks/use-test-coverage', () => ({
  useModuleCoverage: vi.fn(() => ({ data: [], isLoading: false, isError: false, error: null })),
  useFeatureCoverage: vi.fn(() => ({ data: [], isLoading: false, isError: false, error: null })),
  useFeatureTestItems: vi.fn(() => ({ data: [], isLoading: false, isError: false, error: null })),
}))

vi.mock('@/hooks/use-workflows', () => ({
  useWorkflows: vi.fn(() => ({ data: [], isLoading: false, isError: false, error: null })),
  useWorkflowDetail: vi.fn(() => ({ data: undefined, isLoading: false, isError: false, error: null })),
  useNodeDetail: vi.fn(() => ({ data: undefined, isLoading: false, isError: false, error: null })),
}))

vi.mock('@/hooks/use-modules', () => ({
  useModules: vi.fn(() => ({ data: [], isLoading: false, isError: false, error: null })),
  useCreateModule: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useUpdateModule: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteModule: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
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
  modulesCount: 4,
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

  it('renders app details on overview tab by default', () => {
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

  // Tab navigation tests
  it('renders all tab buttons', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Modules & Features')).toBeInTheDocument()
    expect(screen.getByText('Tests')).toBeInTheDocument()
    expect(screen.getByText('Workflows')).toBeInTheDocument()
    expect(screen.getByText('Context')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()
  })

  it('shows overview tab as active by default', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    const overviewTab = screen.getByText('Overview').closest('button')
    expect(overviewTab).toHaveClass('border-[#2563EB]')
  })

  it('switches to modules tab when clicked', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    fireEvent.click(screen.getByText('Modules & Features'))
    // Modules tab should render AppModules component
    expect(screen.getByText('Modules')).toBeInTheDocument()
    // Overview content should not be visible
    expect(screen.queryByText('mx-acme-claims-001')).not.toBeInTheDocument()
  })

  it('shows color-coded status badge for active status', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('bg-[#DCFCE7]')
    expect(badge).toHaveClass('text-[#16A34A]')
  })

  it('shows color-coded status badge for inactive status', () => {
    const inactiveApp = { ...mockApp, status: 'inactive' as const }
    mockUseApp.mockReturnValue({ data: inactiveApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    const badge = screen.getByText('Inactive')
    expect(badge).toHaveClass('bg-[#F3F4F6]')
    expect(badge).toHaveClass('text-[#6B7280]')
  })

  it('shows color-coded status badge for in-development status', () => {
    const devApp = { ...mockApp, status: 'in-development' as const }
    mockUseApp.mockReturnValue({ data: devApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    const badge = screen.getByText('In Development')
    expect(badge).toHaveClass('bg-[#DBEAFE]')
    expect(badge).toHaveClass('text-[#2563EB]')
  })

  // Modules summary tests
  it('displays modules count in overview', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('4 modules configured')).toBeInTheDocument()
  })

  it('displays no modules message when count is 0', () => {
    const noModulesApp = { ...mockApp, modulesCount: 0 }
    mockUseApp.mockReturnValue({ data: noModulesApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('No modules configured')).toBeInTheDocument()
  })

  it('displays singular module text for count of 1', () => {
    const oneModuleApp = { ...mockApp, modulesCount: 1 }
    mockUseApp.mockReturnValue({ data: oneModuleApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    expect(screen.getByText('1 module configured')).toBeInTheDocument()
  })

  it('renders test coverage component when Tests tab clicked', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    fireEvent.click(screen.getByText('Tests'))
    expect(screen.getByText(/No test coverage data/)).toBeInTheDocument()
  })

  it('renders workflows component when Workflows tab clicked', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    fireEvent.click(screen.getByText('Workflows'))
    expect(screen.getByText(/No workflows available/)).toBeInTheDocument()
  })

  it('renders View Modules link that switches to modules tab', () => {
    mockUseApp.mockReturnValue({ data: mockApp, isLoading: false, isError: false, error: null } as ReturnType<typeof useApp>)
    renderWithProviders(React.createElement(AppDetail, { appId: '1' }))
    const viewModulesBtn = screen.getByText('View Modules')
    expect(viewModulesBtn).toBeInTheDocument()
    fireEvent.click(viewModulesBtn)
    // After clicking, modules tab should be active and show AppModules component
    expect(screen.getByText('Add Module')).toBeInTheDocument()
  })
})
