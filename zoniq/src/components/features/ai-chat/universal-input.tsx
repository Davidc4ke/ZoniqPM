'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const PLACEHOLDER_MESSAGES = [
  "Paste notes, or try 'What do I need to review?'...",
  "Try: 'Open story 47' or 'How's Claims Portal?'...",
  'Ask me anything about your projects...',
  "Create a story, or ask 'What's blocked?'...",
]

const ROTATION_INTERVAL_MS = 4000

interface UniversalInputProps {
  onSubmit: (query: string) => void
}

export function UniversalInput({ onSubmit }: UniversalInputProps) {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const currentValue = useRef('')

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length)
    }, ROTATION_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    currentValue.current = newValue
    setValue(newValue)
  }

  const handleSubmit = useCallback(() => {
    const trimmed = currentValue.current.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    currentValue.current = ''
    setValue('')
  }, [onSubmit])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="mx-auto max-w-[1000px] animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_0.1s_both] px-8 pb-2 pt-6">
      <div
        className="rounded-2xl border-2 border-[#FF6B35] p-4 transition-shadow focus-within:shadow-[0_8px_32px_rgba(255,107,53,0.2)]"
        style={{
          background: 'linear-gradient(135deg, #FFF7F3 0%, white 100%)',
          boxShadow: '0 4px 24px rgba(255, 107, 53, 0.12)',
        }}
      >
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-6 w-6 shrink-0 text-[#FF6B35]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
          <textarea
            ref={textareaRef}
            aria-label="Ask me anything"
            className="min-h-[24px] flex-1 resize-none bg-transparent text-base font-medium leading-relaxed text-[#2D1810] placeholder:text-[#9A948D] focus:outline-none"
            placeholder={PLACEHOLDER_MESSAGES[placeholderIndex]}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="shrink-0 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#E55A2B] hover:shadow-[0_4px_12px_rgba(255,107,53,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E8E4E0] pt-2">
          <span className="text-xs text-[#9A948D]">
            Try: &apos;Open story 47&apos; &middot; &apos;What&apos;s blocked?&apos; &middot;
            &apos;Assign #52 to Aisha&apos;
          </span>
          <span className="text-xs text-[#9A948D]" data-testid="char-count">
            {value.length} chars
          </span>
        </div>
      </div>
    </div>
  )
}
