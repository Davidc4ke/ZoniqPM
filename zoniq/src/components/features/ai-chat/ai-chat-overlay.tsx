'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { TextStreamChatTransport } from 'ai'
import { ArrowLeft, ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage, TypingIndicator } from './chat-message'
import { toast } from 'sonner'

interface AIChatOverlayProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

export function AIChatOverlay({ isOpen, onClose, initialMessage }: AIChatOverlayProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initialSentRef = useRef(false)

  const transport = useMemo(
    () => new TextStreamChatTransport({ api: '/api/ai/chat' }),
    []
  )

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: () => {
      toast.error('AI generation failed. Please try again.')
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // Send initial message when overlay opens
  useEffect(() => {
    if (isOpen && initialMessage && !initialSentRef.current) {
      initialSentRef.current = true
      sendMessage({ text: initialMessage })
    }
  }, [isOpen, initialMessage, sendMessage])

  // Reset when overlay closes
  useEffect(() => {
    if (!isOpen) {
      initialSentRef.current = false
    }
  }, [isOpen])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const submitMessage = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    sendMessage({ text: trimmed })
    setInput('')
  }, [input, isLoading, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submitMessage()
      }
    },
    [submitMessage]
  )

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      submitMessage()
    },
    [submitMessage]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAFAF9]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#E8E4E0] bg-white px-6 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] space-y-4 px-6 py-6">
          {messages.length === 0 && (
            <div className="py-20 text-center text-sm text-[#9A948D]">
              Ask me anything about your projects, stories, or team.
            </div>
          )}

          {messages.map((message) => {
            const text = message.parts
              ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('') ?? ''
            return (
              <ChatMessage
                key={message.id}
                role={message.role as 'user' | 'assistant'}
                content={text}
              />
            )
          })}

          {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}

          {error && (
            <div className="rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/5 px-4 py-3 text-sm text-[#EF4444]">
              Something went wrong. Please try again.
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-[#E8E4E0] bg-white px-6 py-4">
        <form onSubmit={handleFormSubmit} className="mx-auto max-w-[720px]">
          <div
            className={cn(
              'flex items-end gap-3 rounded-xl border bg-white p-3 transition-all',
              'border-[#E8E4E0] focus-within:border-[#FF6B35] focus-within:shadow-[0_0_0_3px_rgba(255,107,53,0.1)]'
            )}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              aria-label="Chat message"
              disabled={isLoading}
              rows={1}
              className="min-h-[40px] max-h-[120px] flex-1 resize-none bg-transparent py-1.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150',
                input.trim() && !isLoading
                  ? 'bg-[#FF6B35] text-white hover:bg-[#e55f2f] active:scale-95'
                  : 'bg-[#E8E4E0] text-[#9A948D]'
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
