'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLACEHOLDERS = [
  "Paste notes, or try 'What do I need to review?'",
  "Try: 'Open story 47' or 'How's Claims Portal?'",
  'Ask me anything about your projects...',
  "Create a story, or ask 'What's blocked?'",
]

const ROTATION_INTERVAL = 4500

interface UniversalInputProps {
  onSubmit: (query: string) => void
  isLoading?: boolean
}

export function UniversalInput({ onSubmit, isLoading = false }: UniversalInputProps) {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isFocused) return
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
    }, ROTATION_INTERVAL)
    return () => clearInterval(interval)
  }, [isFocused])

  const resetHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [])

  useEffect(() => {
    resetHeight()
  }, [value, resetHeight])

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSubmit(trimmed)
    setValue('')
  }, [value, isLoading, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className={cn(
          'relative flex items-start gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all duration-200',
          isFocused
            ? 'border-[#FF6B35] shadow-[0_0_0_3px_rgba(255,107,53,0.1)]'
            : 'border-[#E8E4E0] hover:border-[#FF6B35]/50'
        )}
      >
        <div className="mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8F5A] text-white">
          <Sparkles className="h-4 w-4" />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          aria-label="Ask me anything"
          disabled={isLoading}
          rows={1}
          className="min-h-[40px] flex-1 resize-none bg-transparent py-1.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] focus:outline-none disabled:opacity-50"
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          aria-label="Ask"
          className={cn(
            'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150',
            value.trim() && !isLoading
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
    </div>
  )
}
