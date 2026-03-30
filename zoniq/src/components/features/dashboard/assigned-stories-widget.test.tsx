import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { AssignedStoriesWidget } from './assigned-stories-widget'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockStories = [
  { id: '1', number: 47, title: 'Approval Workflow', status: 'in-progress', priority: 'high', projectName: 'Claims Portal', assignee: { id: '1', name: 'Aisha', initials: 'A' } },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AssignedStoriesWidget', () => {
  it('shows loading skeleton initially', () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<AssignedStoriesWidget />, { wrapper: createWrapper() })
    expect(screen.getAllByTestId('skeleton-row').length).toBeGreaterThan(0)
  })

  it('renders stories after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockStories }), { status: 200 })
    )
    render(<AssignedStoriesWidget />, { wrapper: createWrapper() })
    expect(await screen.findByText(/Approval Workflow/)).toBeInTheDocument()
  })

  it('navigates to story detail on click', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockStories }), { status: 200 })
    )
    render(<AssignedStoriesWidget />, { wrapper: createWrapper() })
    const card = await screen.findByText(/Approval Workflow/)
    fireEvent.click(card.closest('[data-testid="story-card"]')!)
    expect(mockPush).toHaveBeenCalledWith('/stories/1')
  })
})
