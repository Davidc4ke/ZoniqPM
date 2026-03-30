import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { AppsWidget } from './apps-widget'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockApps = [
  {
    id: '1',
    name: 'Claims Portal',
    environments: [
      { name: 'Dev', status: 'healthy' },
      { name: 'Prod', status: 'error' },
    ],
    warnings: 1,
  },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AppsWidget', () => {
  it('shows loading skeleton initially', () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<AppsWidget />, { wrapper: createWrapper() })
    expect(screen.getAllByTestId('skeleton-row').length).toBeGreaterThan(0)
  })

  it('renders apps with environment statuses after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockApps }), { status: 200 })
    )
    render(<AppsWidget />, { wrapper: createWrapper() })
    expect(await screen.findByText('Claims Portal')).toBeInTheDocument()
    expect(screen.getByText('Dev')).toBeInTheDocument()
    expect(screen.getByText('1 warning')).toBeInTheDocument()
  })

  it('renders app links to detail page', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockApps }), { status: 200 })
    )
    render(<AppsWidget />, { wrapper: createWrapper() })
    const link = await screen.findByRole('link', { name: /Claims Portal/ })
    expect(link).toHaveAttribute('href', '/apps/1')
  })
})
