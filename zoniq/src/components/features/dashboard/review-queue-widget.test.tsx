import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { ReviewQueueWidget } from './review-queue-widget'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockReviewData = {
  data: [
    { id: '4', number: 44, title: 'Login Flow', status: 'ready', priority: 'high', projectName: 'Claims Portal' },
    { id: '5', number: 45, title: 'Dashboard', status: 'ready', priority: 'medium', projectName: 'Claims Portal' },
  ],
  meta: { total: 2 },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ReviewQueueWidget', () => {
  it('shows loading skeleton initially', () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<ReviewQueueWidget />, { wrapper: createWrapper() })
    expect(screen.getAllByTestId('skeleton-row').length).toBeGreaterThan(0)
  })

  it('renders review stories with count badge', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockReviewData), { status: 200 })
    )
    render(<ReviewQueueWidget />, { wrapper: createWrapper() })
    expect(await screen.findByText(/Login Flow/)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
