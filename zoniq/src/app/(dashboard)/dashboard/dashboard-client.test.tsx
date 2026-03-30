import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { DashboardClient } from './dashboard-client'

// Mock the child components to isolate integration testing
vi.mock('@/components/features/dashboard/assigned-stories-widget', () => ({
  AssignedStoriesWidget: () => <div data-testid="assigned-stories-widget">Assigned Stories</div>,
}))
vi.mock('@/components/features/dashboard/review-queue-widget', () => ({
  ReviewQueueWidget: () => <div data-testid="review-queue-widget">Review Queue</div>,
}))
vi.mock('@/components/features/dashboard/projects-widget', () => ({
  ProjectsWidget: () => <div data-testid="projects-widget">Projects</div>,
}))
vi.mock('@/components/features/dashboard/apps-widget', () => ({
  AppsWidget: () => <div data-testid="apps-widget">Apps</div>,
}))
vi.mock('@/components/features/dashboard/team-activity-widget', () => ({
  TeamActivityWidget: () => <div data-testid="team-activity-widget">Team Activity</div>,
}))

// Mock fetch for AI chat
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('DashboardClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero input above dashboard widgets', () => {
    render(<DashboardClient userInitials="D" />)
    expect(screen.getByLabelText('Ask me anything')).toBeInTheDocument()
    expect(screen.getByTestId('assigned-stories-widget')).toBeInTheDocument()
    expect(screen.getByTestId('review-queue-widget')).toBeInTheDocument()
    expect(screen.getByTestId('projects-widget')).toBeInTheDocument()
    expect(screen.getByTestId('apps-widget')).toBeInTheDocument()
    expect(screen.getByTestId('team-activity-widget')).toBeInTheDocument()
  })

  it('opens chat overlay when hero input is submitted', () => {
    // Mock a successful response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('event: meta\ndata: {"intent":"query"}\n\n'))
        controller.enqueue(encoder.encode('event: text\ndata: "H"\n\n'))
        controller.enqueue(encoder.encode('event: text\ndata: "i"\n\n'))
        controller.enqueue(encoder.encode('event: done\ndata: {}\n\n'))
        controller.close()
      },
    })
    mockFetch.mockResolvedValueOnce(
      new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      })
    )

    render(<DashboardClient userInitials="D" />)

    // Chat overlay should NOT be visible initially
    expect(screen.queryByTestId('chat-overlay')).not.toBeInTheDocument()

    // Type and submit
    const textarea = screen.getByLabelText('Ask me anything')
    fireEvent.change(textarea, { target: { value: "What's blocked?" } })
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))

    // Chat overlay should now be visible
    expect(screen.getByTestId('chat-overlay')).toBeInTheDocument()
  })

  it('closes chat overlay when back button is clicked', () => {
    mockFetch.mockResolvedValueOnce(
      new Response(
        new ReadableStream({
          start(c) {
            c.enqueue(new TextEncoder().encode('event: done\ndata: {}\n\n'))
            c.close()
          },
        }),
        { status: 200, headers: { 'Content-Type': 'text/event-stream' } }
      )
    )

    render(<DashboardClient userInitials="D" />)

    // Open chat
    fireEvent.change(screen.getByLabelText('Ask me anything'), {
      target: { value: 'test' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))
    expect(screen.getByTestId('chat-overlay')).toBeInTheDocument()

    // Close chat
    fireEvent.click(screen.getByTestId('back-button'))
    expect(screen.queryByTestId('chat-overlay')).not.toBeInTheDocument()
  })

  it('opens chat overlay via custom event from topbar', () => {
    render(<DashboardClient userInitials="D" />)
    expect(screen.queryByTestId('chat-overlay')).not.toBeInTheDocument()

    // Dispatch the custom event the topbar button sends
    act(() => {
      window.dispatchEvent(new CustomEvent('zoniq:open-chat'))
    })
    expect(screen.getByTestId('chat-overlay')).toBeInTheDocument()
  })
})
