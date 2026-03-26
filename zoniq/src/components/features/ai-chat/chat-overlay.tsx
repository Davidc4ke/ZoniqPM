'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { TypingIndicator } from './typing-indicator'

interface ChatOverlayProps {
  initialQuery?: string
  onClose: () => void
}

const chatTransport = new DefaultChatTransport({ api: '/api/ai/chat' })

export function ChatOverlay({ initialQuery, onClose }: ChatOverlayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasSubmittedInitial = useRef(false)

  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // Submit initial query on mount
  useEffect(() => {
    if (initialQuery && !hasSubmittedInitial.current) {
      hasSubmittedInitial.current = true
      sendMessage({ text: initialQuery })
    }
  }, [initialQuery, sendMessage])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = useCallback(
    (text: string) => {
      if (!isLoading) {
        sendMessage({ text })
      }
    },
    [isLoading, sendMessage]
  )

  const lastMessage = messages[messages.length - 1]
  const showTypingIndicator = isLoading && lastMessage?.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#E8E4E0]"
    >
      {/* Overlay Topbar */}
      <header className="sticky top-0 z-50 border-b border-[#E8E4E0] bg-white">
        <div className="flex h-14 items-center gap-4 px-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-[#E8E4E0] px-3 py-1.5 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-semibold text-white">
              AI
            </div>
            <span className="font-semibold text-[#2D1810]">
              Zoniq Assistant
            </span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#FAFAF9]">
        <div className="mx-auto max-w-[900px] space-y-6 px-8 py-8">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={
                status === 'streaming' &&
                message.role === 'assistant' &&
                message === lastMessage
              }
            />
          ))}

          {showTypingIndicator && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-semibold text-white">
                AI
              </div>
              <div
                className="rounded-[16px_16px_16px_4px] border border-[#FF6B35] px-5 py-4"
                style={{
                  background: 'linear-gradient(135deg, #FFF7F3, white)',
                }}
              >
                <TypingIndicator />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </motion.div>
  )
}
