import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ChatOverlay } from './chat-overlay'
import type { ChatMessage } from '@/types/ai'

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: "What's blocked?",
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Here are the blocked stories...',
    timestamp: new Date().toISOString(),
  },
]

describe('ChatOverlay', () => {
  const defaultProps = {
    isOpen: true,
    messages: mockMessages,
    isLoading: false,
    onClose: vi.fn(),
    onSendMessage: vi.fn(),
    userInitials: 'D',
  }

  it('renders nothing when not open', () => {
    render(<ChatOverlay {...defaultProps} isOpen={false} />)
    expect(screen.queryByTestId('chat-overlay')).not.toBeInTheDocument()
  })

  it('renders overlay with messages when open', () => {
    render(<ChatOverlay {...defaultProps} />)
    expect(screen.getByTestId('chat-overlay')).toBeInTheDocument()
    expect(screen.getByText("What's blocked?")).toBeInTheDocument()
    expect(screen.getByText('Here are the blocked stories...')).toBeInTheDocument()
  })

  it('renders user and AI messages with correct styling', () => {
    render(<ChatOverlay {...defaultProps} />)
    expect(screen.getByTestId('chat-message-user')).toBeInTheDocument()
    expect(screen.getByTestId('chat-message-assistant')).toBeInTheDocument()
  })

  it('shows typing indicator when loading', () => {
    render(<ChatOverlay {...defaultProps} isLoading={true} />)
    expect(screen.getByTestId('typing-indicator')).toBeInTheDocument()
  })

  it('does not show typing indicator when not loading', () => {
    render(<ChatOverlay {...defaultProps} isLoading={false} />)
    expect(screen.queryByTestId('typing-indicator')).not.toBeInTheDocument()
  })

  it('calls onClose when Back to Dashboard button is clicked', () => {
    const onClose = vi.fn()
    render(<ChatOverlay {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByTestId('back-button'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<ChatOverlay {...defaultProps} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onSendMessage when Send button is clicked', () => {
    const onSendMessage = vi.fn()
    render(<ChatOverlay {...defaultProps} onSendMessage={onSendMessage} />)
    const input = screen.getByLabelText('Chat message input')
    fireEvent.change(input, { target: { value: 'Hello AI' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSendMessage).toHaveBeenCalledWith('Hello AI')
  })

  it('calls onSendMessage on Enter key (not Shift+Enter)', async () => {
    const onSendMessage = vi.fn()
    render(<ChatOverlay {...defaultProps} onSendMessage={onSendMessage} />)
    const input = screen.getByLabelText('Chat message input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } })
    })
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: false })
    })
    expect(onSendMessage).toHaveBeenCalledWith('test')
  })

  it('does not send on Shift+Enter', async () => {
    const onSendMessage = vi.fn()
    render(<ChatOverlay {...defaultProps} onSendMessage={onSendMessage} />)
    const input = screen.getByLabelText('Chat message input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } })
    })
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    })
    expect(onSendMessage).not.toHaveBeenCalled()
  })

  it('clears input after sending', async () => {
    render(<ChatOverlay {...defaultProps} />)
    const input = screen.getByLabelText('Chat message input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test query' } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    })
    expect(input).toHaveValue('')
  })

  it('displays Zoniq Assistant header', () => {
    render(<ChatOverlay {...defaultProps} />)
    expect(screen.getByText('Zoniq Assistant')).toBeInTheDocument()
  })
})
