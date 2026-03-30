import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { ProjectsWidget } from './projects-widget'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockProjects = [
  { id: '1', name: 'Claims Portal', progress: 72, columns: { backlog: 3, active: 8, testing: 4, review: 5, done: 16 } },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ProjectsWidget', () => {
  it('shows loading skeleton initially', () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<ProjectsWidget />, { wrapper: createWrapper() })
    expect(screen.getAllByTestId('skeleton-row').length).toBeGreaterThan(0)
  })

  it('renders projects with progress after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockProjects }), { status: 200 })
    )
    render(<ProjectsWidget />, { wrapper: createWrapper() })
    expect(await screen.findByText('Claims Portal')).toBeInTheDocument()
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders project links to detail page', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockProjects }), { status: 200 })
    )
    render(<ProjectsWidget />, { wrapper: createWrapper() })
    const link = await screen.findByRole('link', { name: /Claims Portal/ })
    expect(link).toHaveAttribute('href', '/projects/1')
  })
})
