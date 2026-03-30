import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppEnvironments } from './app-environments'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}))

vi.mock('@/hooks/use-environments', () => ({
  useEnvironments: vi.fn(),
  useCreateEnvironment: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useUpdateEnvironment: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteEnvironment: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

import { useEnvironments } from '@/hooks/use-environments'
const mockUseEnvironments = vi.mocked(useEnvironments)

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

const mockEnvironments = [
  {
    id: 'env-1',
    appId: '1',
    name: 'Development',
    url: 'https://dev.example.com',
    status: 'online' as const,
    version: '3.2.1',
    lastPing: '2026-03-30T14:23:45Z',
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-03-30T14:23:45Z',
  },
  {
    id: 'env-2',
    appId: '1',
    name: 'Test',
    url: 'https://test.example.com',
    status: 'online' as const,
    version: '3.2.0',
    lastPing: '2026-03-30T14:20:00Z',
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-03-30T14:20:00Z',
  },
  {
    id: 'env-3',
    appId: '1',
    name: 'Acceptance',
    url: 'https://acc.example.com',
    status: 'offline' as const,
    version: '3.1.0',
    lastPing: '2026-03-29T10:00:00Z',
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-03-29T10:00:00Z',
  },
  {
    id: 'env-4',
    appId: '1',
    name: 'Production',
    url: 'https://prod.example.com',
    status: 'deploying' as const,
    version: '3.0.0',
    lastPing: '2026-03-30T14:25:00Z',
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-03-30T14:25:00Z',
  },
]

describe('AppEnvironments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton', () => {
    mockUseEnvironments.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    const { container } = renderWithProviders(
      React.createElement(AppEnvironments, { appId: '1' })
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseEnvironments.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Load failed'),
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    expect(screen.getByText('Load failed')).toBeInTheDocument()
  })

  it('renders environment cards', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Acceptance')).toBeInTheDocument()
    expect(screen.getByText('Production')).toBeInTheDocument()
  })

  it('renders status indicators with correct text', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    const statusTexts = screen.getAllByText(/^(Online|Offline|Deploying)$/)
    expect(statusTexts.length).toBeGreaterThanOrEqual(4)
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByText('Deploying')).toBeInTheDocument()
  })

  it('renders version numbers', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    expect(screen.getByText('3.2.1')).toBeInTheDocument()
    expect(screen.getByText('3.2.0')).toBeInTheDocument()
    expect(screen.getByText('3.1.0')).toBeInTheDocument()
    expect(screen.getByText('3.0.0')).toBeInTheDocument()
  })

  it('renders Add Environment button', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    expect(screen.getByText('Add Environment')).toBeInTheDocument()
  })

  it('opens add dialog when Add Environment clicked', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    fireEvent.click(screen.getByText('Add Environment'))
    expect(screen.getByText('Add Environment', { selector: 'h2' })).toBeInTheDocument()
  })

  it('renders edit button for each environment', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    const editButtons = screen.getAllByText('Edit')
    expect(editButtons).toHaveLength(4)
  })

  it('renders delete button for each environment', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(4)
  })

  it('renders environment URLs', () => {
    mockUseEnvironments.mockReturnValue({
      data: mockEnvironments,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    expect(screen.getByText('https://dev.example.com')).toBeInTheDocument()
    expect(screen.getByText('https://test.example.com')).toBeInTheDocument()
  })

  it('renders empty state when no environments', () => {
    mockUseEnvironments.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useEnvironments>)
    renderWithProviders(React.createElement(AppEnvironments, { appId: '1' }))
    expect(screen.getByText(/No environments configured/)).toBeInTheDocument()
  })
})
