import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { UniversalInput } from './universal-input'

describe('UniversalInput', () => {
  it('renders with AI icon, textarea, and Ask button', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    expect(screen.getByLabelText('Ask me anything')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask' })).toBeInTheDocument()
  })

  it('displays initial placeholder text', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    const textarea = screen.getByLabelText('Ask me anything')
    expect(textarea).toHaveAttribute(
      'placeholder',
      "Paste notes, or try 'What do I need to review?'..."
    )
  })

  it('calls onSubmit with trimmed query text when Ask is clicked', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    const textarea = screen.getByLabelText('Ask me anything')
    fireEvent.change(textarea, { target: { value: '  What is blocked?  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))
    expect(onSubmit).toHaveBeenCalledWith('What is blocked?')
  })

  it('calls onSubmit when Enter is pressed (not Shift+Enter)', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    const textarea = screen.getByLabelText('Ask me anything')
    fireEvent.change(textarea, { target: { value: 'Open #47' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    expect(onSubmit).toHaveBeenCalledWith('Open #47')
  })

  it('does not submit on Shift+Enter', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    const textarea = screen.getByLabelText('Ask me anything')
    fireEvent.change(textarea, { target: { value: 'test' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit when input is empty', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('updates character count as user types', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    expect(screen.getByTestId('char-count')).toHaveTextContent('0 chars')
    fireEvent.change(screen.getByLabelText('Ask me anything'), {
      target: { value: 'Hello' },
    })
    expect(screen.getByTestId('char-count')).toHaveTextContent('5 chars')
  })

  it('clears input after submission', async () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    const textarea = screen.getByLabelText('Ask me anything')
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'test query' } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ask' }))
    })
    expect(textarea).toHaveValue('')
  })

  it('disables Ask button when input is empty', () => {
    const onSubmit = vi.fn()
    render(<UniversalInput onSubmit={onSubmit} />)
    expect(screen.getByRole('button', { name: 'Ask' })).toBeDisabled()
  })
})

describe('UniversalInput placeholder rotation', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('rotates placeholder text every 4 seconds', async () => {
    vi.useFakeTimers()
    const onSubmit = vi.fn()

    await act(async () => {
      render(<UniversalInput onSubmit={onSubmit} />)
    })
    const textarea = screen.getByLabelText('Ask me anything')

    await act(async () => {
      vi.advanceTimersByTime(4000)
    })
    expect(textarea).toHaveAttribute(
      'placeholder',
      "Try: 'Open story 47' or 'How's Claims Portal?'..."
    )

    await act(async () => {
      vi.advanceTimersByTime(4000)
    })
    expect(textarea).toHaveAttribute(
      'placeholder',
      'Ask me anything about your projects...'
    )
  })
})
