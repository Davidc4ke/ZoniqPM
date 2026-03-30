'use client'

import { useState, useCallback, useRef } from 'react'
import type { ChatMessage } from '@/types/ai'

let messageIdCounter = 0
function generateMessageId(): string {
  return `msg_${Date.now()}_${++messageIdCounter}`
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messagesRef.current,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || 'Failed to get AI response')
      }

      // Parse SSE stream
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let assembledText = ''
      const assistantId = generateMessageId()

      // Add empty assistant message that we'll update
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        },
      ])

      let done = false
      while (!done) {
        const result = await reader.read()
        done = result.done
        if (result.value) {
          const chunk = decoder.decode(result.value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('event: text')) continue
            if (line.startsWith('event: meta')) continue
            if (line.startsWith('event: done')) continue
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '{}') continue
              try {
                const parsed = JSON.parse(data)
                if (typeof parsed === 'string') {
                  assembledText += parsed
                  const currentText = assembledText
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId ? { ...msg, content: currentText } : msg
                    )
                  )
                }
              } catch {
                // Skip non-JSON data lines
              }
            }
          }
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content:
          error instanceof Error
            ? `Sorry, something went wrong: ${error.message}`
            : 'Sorry, an unexpected error occurred. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendMessageRef = useRef(sendMessage)
  sendMessageRef.current = sendMessage

  const openChat = useCallback((initialQuery?: string) => {
    setIsOverlayOpen(true)
    if (initialQuery) {
      sendMessageRef.current(initialQuery)
    }
  }, [])

  const closeChat = useCallback(() => {
    setIsOverlayOpen(false)
  }, [])

  return {
    messages,
    isLoading,
    isOverlayOpen,
    openChat,
    closeChat,
    sendMessage,
  }
}
