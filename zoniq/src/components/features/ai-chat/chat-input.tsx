'use client'

import { useRef, useState, useCallback, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSubmit: (text: string) => void
  isLoading: boolean
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      const textarea = e.target
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    },
    []
  )

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (trimmed && !isLoading) {
      onSubmit(trimmed)
      setValue('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [value, isLoading, onSubmit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  return (
    <div className="border-t border-[#E8E4E0] bg-white px-8 py-6">
      <div className="mx-auto max-w-[900px]">
        <div className="flex items-end gap-3 rounded-xl border border-[#E8E4E0] bg-[#FAFAF9] p-3 transition-colors focus-within:border-[#FF6B35]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Continue conversation... or try 'Open #47' · 'What's blocked?'"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[#2D1810] placeholder:text-[#9A948D] focus:outline-none"
            style={{ lineHeight: '1.5', maxHeight: '200px' }}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !value.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FF6B35] text-white transition-all hover:bg-[#E55A2B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
