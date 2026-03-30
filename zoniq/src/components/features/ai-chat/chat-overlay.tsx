'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ChatMessage as ChatMessageType } from '@/types/ai'
import { ChatMessage } from './chat-message'
import { TypingIndicator } from './typing-indicator'

interface ChatOverlayProps {
  isOpen: boolean
  messages: ChatMessageType[]
  isLoading: boolean
  onClose: () => void
  onSendMessage: (message: string) => void
  userInitials?: string
}

export function ChatOverlay({
  isOpen,
  messages,
  isLoading,
  onClose,
  onSendMessage,
  userInitials = 'U',
}: ChatOverlayProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentInputValue = useRef('')

  // Focus chat input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // Escape key handler
  const handleKeyDownGlobal = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDownGlobal)
      return () => document.removeEventListener('keydown', handleKeyDownGlobal)
    }
  }, [isOpen, handleKeyDownGlobal])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    currentInputValue.current = newValue
    setInputValue(newValue)
  }

  const handleSend = useCallback(() => {
    const trimmed = currentInputValue.current.trim()
    if (!trimmed || isLoading) return
    onSendMessage(trimmed)
    currentInputValue.current = ''
    setInputValue('')
  }, [isLoading, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col animate-[fadeIn_0.3s_ease-out] bg-[#E8E4E0]"
      data-testid="chat-overlay"
      role="dialog"
      aria-label="AI Chat"
    >
      {/* Topbar */}
      <div className="flex items-center justify-between border-b border-[#E8E4E0] bg-white px-6 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-sm text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
          data-testid="back-button"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-semibold text-white">
            AI
          </div>
          <span className="text-sm font-medium text-[#2D1810]">Zoniq Assistant</span>
        </div>
        <div className="w-[160px]" /> {/* Spacer for centering */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 pt-8">
        <div className="mx-auto max-w-[900px] space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]"
            >
              <ChatMessage message={msg} userInitials={userInitials} />
            </div>
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#E8E4E0] bg-white px-8 py-6">
        <div className="mx-auto max-w-[900px]">
          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-xl border border-[#E8E4E0] bg-[#FAFAF9] p-3 transition-all focus-within:border-[#FF6B35]">
              <textarea
                ref={inputRef}
                className="w-full resize-none bg-transparent text-sm text-[#2D1810] placeholder:text-[#9A948D] focus:outline-none"
                placeholder="Continue conversation... or try 'Open #47' · 'What's blocked?'"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                aria-label="Chat message input"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="shrink-0 rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#E55A2B] hover:shadow-[0_4px_12px_rgba(255,107,53,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-xs text-[#9A948D]">
              Try: &apos;Open #44&apos; &middot; &apos;Assign #47 to Aisha&apos; &middot;
              &apos;What&apos;s blocked?&apos;
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
