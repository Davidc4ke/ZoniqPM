import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CustomerList } from './customer-list'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}))

const mockUseCustomers = vi.fn()
vi.mock('@/hooks/use-customers', () => ({
  useCustomers: () => mockUseCustomers(),
  useCreateCustomer: () => ({ mutate: vi.fn(), isPending: false }),
}))

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

describe('CustomerList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading skeleton when loading', () => {
    mockUseCustomers.mockReturnValue({ isLoading: true, data: undefined })
    renderWithQuery(React.createElement(CustomerList))
    expect(screen.getByText('Customers')).toBeInTheDocument()
  })

  it('shows error message on error', () => {
    mockUseCustomers.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
    })
    renderWithQuery(React.createElement(CustomerList))
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('shows empty state when no customers', () => {
    mockUseCustomers.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    })
    renderWithQuery(React.createElement(CustomerList))
    expect(screen.getByText('No customers yet')).toBeInTheDocument()
  })

  it('renders customer cards', () => {
    mockUseCustomers.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          id: '1',
          name: 'Acme Corp',
          description: 'A test company',
          linkedAppsCount: 2,
          isDeleted: false,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
          organizationId: 'org_1',
        },
      ],
    })
    renderWithQuery(React.createElement(CustomerList))
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('A test company')).toBeInTheDocument()
    expect(screen.getByText('2 apps')).toBeInTheDocument()
  })

  it('links to customer detail page', () => {
    mockUseCustomers.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          id: '42',
          name: 'Test',
          description: null,
          linkedAppsCount: 0,
          isDeleted: false,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
          organizationId: 'org_1',
        },
      ],
    })
    renderWithQuery(React.createElement(CustomerList))
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/masterdata/customers/42')
  })

  it('shows Add Customer button', () => {
    mockUseCustomers.mockReturnValue({ isLoading: false, data: [] })
    renderWithQuery(React.createElement(CustomerList))
    expect(screen.getByText('Add Customer')).toBeInTheDocument()
  })
})
