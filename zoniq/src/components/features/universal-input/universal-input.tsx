'use client'

import { useRef, useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'

interface UniversalInputProps {
  onSubmit: (query: string) => void
}

const SUGGESTIONS = [
  'Open story 47',
  "What's blocked?",
  'Assign #52 to Aisha',
]

export function UniversalInput({ onSubmit }: UniversalInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [])

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, onSubmit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onSubmit(suggestion)
    },
    [onSubmit]
  )

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div
        className="flex items-start gap-3 rounded-2xl border-2 border-[#FF6B35] p-4 transition-shadow focus-within:shadow-[0_8px_32px_rgba(255,107,53,0.2)]"
        style={{
          background: 'linear-gradient(135deg, #FFF7F3, white)',
          boxShadow: '0 4px 24px rgba(255, 107, 53, 0.12)',
        }}
      >
        <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-[#FF6B35]" />

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Zoniq anything... paste notes, ask questions, or give commands"
          rows={1}
          className="flex-1 resize-none bg-transparent font-medium text-[#2D1810] placeholder:text-[#9A948D] focus:outline-none"
          style={{ lineHeight: '1.5', maxHeight: '200px' }}
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#FF6B35] px-5 py-2.5 font-semibold text-white transition-all hover:bg-[#E55A2B] hover:shadow-[0_4px_12px_rgba(255,107,53,0.3)] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Ask
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#E8E4E0] px-1 pt-3">
        <div className="flex items-center gap-1 text-sm text-[#9A948D]">
          <span>Try:</span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-md px-2 py-0.5 text-sm text-[#9A948D] transition-all hover:bg-[rgba(255,107,53,0.1)] hover:text-[#FF6B35]"
            >
              &ldquo;{suggestion}&rdquo;
            </button>
          ))}
        </div>
        <span className="text-xs text-[#9A948D]">{value.length} chars</span>
      </div>
    </div>
  )
}
