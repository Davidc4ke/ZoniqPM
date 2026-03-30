import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { TeamActivityWidget } from './team-activity-widget'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockActivity = [
  { id: '1', user: { name: 'Aisha', initials: 'A', color: 'bg-[#10B981]' }, action: 'moved', highlight: '#47', suffix: 'to Review', time: '2m ago' },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TeamActivityWidget', () => {
  it('shows loading skeleton initially', () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<TeamActivityWidget />, { wrapper: createWrapper() })
    expect(screen.getAllByTestId('skeleton-row').length).toBeGreaterThan(0)
  })

  it('renders activity items after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockActivity }), { status: 200 })
    )
    render(<TeamActivityWidget />, { wrapper: createWrapper() })
    expect(await screen.findByText(/Aisha/)).toBeInTheDocument()
    expect(screen.getByText('2m ago')).toBeInTheDocument()
  })
})
