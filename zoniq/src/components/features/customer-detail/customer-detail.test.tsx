import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CustomerDetail } from './customer-detail'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockUseCustomer = vi.fn()
vi.mock('@/hooks/use-customers', () => ({
  useCustomer: (id: string) => mockUseCustomer(id),
  useUpdateCustomer: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteCustomer: () => ({ mutate: vi.fn(), isPending: false }),
}))

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

const mockCustomer = {
  id: '1',
  name: 'Acme Insurance',
  description: 'A large insurance provider',
  organizationId: 'org_1',
  isDeleted: false,
  createdAt: '2026-01-15T10:00:00.000Z',
  updatedAt: '2026-02-20T14:30:00.000Z',
  linkedAppsCount: 3,
}

const mockCustomerNoApps = {
  ...mockCustomer,
  id: '3',
  name: 'HealthTech',
  linkedAppsCount: 0,
}

describe('CustomerDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading skeleton', () => {
    mockUseCustomer.mockReturnValue({ isLoading: true, data: undefined })
    const { container } = renderWithQuery(
      React.createElement(CustomerDetail, { customerId: '1' })
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Not found'),
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '999' }))
    expect(screen.getByText('Not found')).toBeInTheDocument()
  })

  it('renders customer details', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCustomer,
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '1' }))
    expect(screen.getByText('Acme Insurance')).toBeInTheDocument()
    expect(screen.getByText('A large insurance provider')).toBeInTheDocument()
    expect(screen.getByText('3 apps')).toBeInTheDocument()
  })

  it('shows edit and delete buttons', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCustomer,
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '1' }))
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('opens edit dialog when Edit is clicked', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCustomer,
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '1' }))
    fireEvent.click(screen.getByText('Edit'))
    expect(screen.getByText('Edit Customer')).toBeInTheDocument()
  })

  it('opens delete dialog when Delete is clicked', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCustomer,
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '1' }))
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByText('Delete Customer')).toBeInTheDocument()
  })

  it('shows linked apps warning in delete dialog for customer with apps', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCustomer,
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '1' }))
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByText(/Remove all apps first/)).toBeInTheDocument()
  })

  it('shows confirmation prompt in delete dialog for customer without apps', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCustomerNoApps,
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '3' }))
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByText(/Are you sure/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Customer' })).toBeInTheDocument()
  })

  it('shows back link to masterdata', () => {
    mockUseCustomer.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCustomer,
    })
    renderWithQuery(React.createElement(CustomerDetail, { customerId: '1' }))
    const backLink = screen.getByText('Back to customers')
    expect(backLink.closest('a')).toHaveAttribute('href', '/masterdata')
  })
})
