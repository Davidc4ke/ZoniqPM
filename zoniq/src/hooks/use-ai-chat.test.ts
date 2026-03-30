import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAIChat } from './use-ai-chat'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

function createMockSSEResponse(text: string) {
  const encoder = new TextEncoder()
  const chunks = [
    `event: meta\ndata: ${JSON.stringify({ intent: 'query' })}\n\n`,
    ...text.split('').map((char) => `event: text\ndata: ${JSON.stringify(char)}\n\n`),
    'event: done\ndata: {}\n\n',
  ]

  let chunkIndex = 0
  const stream = new ReadableStream({
    pull(controller) {
      if (chunkIndex < chunks.length) {
        controller.enqueue(encoder.encode(chunks[chunkIndex]))
        chunkIndex++
      } else {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

describe('useAIChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useAIChat())
    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isOverlayOpen).toBe(false)
  })

  it('opens and closes overlay', () => {
    const { result } = renderHook(() => useAIChat())

    act(() => {
      result.current.openChat()
    })
    expect(result.current.isOverlayOpen).toBe(true)

    act(() => {
      result.current.closeChat()
    })
    expect(result.current.isOverlayOpen).toBe(false)
  })

  it('sends message and receives streamed response', async () => {
    mockFetch.mockResolvedValueOnce(createMockSSEResponse('Hello!'))

    const { result } = renderHook(() => useAIChat())

    await act(async () => {
      await result.current.sendMessage('Hi')
    })

    // Should have user message and assistant response
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[0].content).toBe('Hi')
    expect(result.current.messages[1].role).toBe('assistant')
    expect(result.current.messages[1].content).toBe('Hello!')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { message: 'Server error' } }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const { result } = renderHook(() => useAIChat())

    await act(async () => {
      await result.current.sendMessage('test')
    })

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].role).toBe('assistant')
    expect(result.current.messages[1].content).toContain('Server error')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'))

    const { result } = renderHook(() => useAIChat())

    await act(async () => {
      await result.current.sendMessage('test')
    })

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].content).toContain('Network failure')
    expect(result.current.isLoading).toBe(false)
  })
})
