'use client'

import { useState } from 'react'
import type { ContextType } from '@/types/context'

const contextTypes: { value: ContextType; label: string }[] = [
  { value: 'note', label: 'Note' },
  { value: 'document', label: 'Document' },
  { value: 'url', label: 'URL' },
]

interface ContextFormProps {
  initialName?: string
  initialType?: ContextType
  initialContent?: string
  onSubmit: (data: { name: string; type: ContextType; content: string }) => void
  onCancel: () => void
  isPending: boolean
  submitLabel: string
}

export function ContextForm({
  initialName = '',
  initialType = 'note',
  initialContent = '',
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: ContextFormProps) {
  const [name, setName] = useState(initialName)
  const [type, setType] = useState<ContextType>(initialType)
  const [content, setContent] = useState(initialContent)
  const [errors, setErrors] = useState<{ name?: string; content?: string }>({})

  const validate = (): boolean => {
    const newErrors: { name?: string; content?: string } = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    else if (name.length > 100) newErrors.name = 'Name must be 100 characters or less'
    if (!content.trim()) newErrors.content = 'Content is required'
    else if (content.length > 5000) newErrors.content = 'Content must be 5000 characters or less'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ name: name.trim(), type, content: content.trim() })
    }
  }

  const contentPlaceholder = type === 'url'
    ? 'https://example.com/documentation'
    : type === 'document'
    ? 'Paste document content or reference...'
    : 'Enter your notes here...'

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="context-name" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Name <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            id="context-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., API Documentation"
            maxLength={100}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          />
          {errors.name && <p className="mt-1 text-xs text-[#DC2626]">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="context-type" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Type <span className="text-[#DC2626]">*</span>
          </label>
          <select
            id="context-type"
            value={type}
            onChange={(e) => setType(e.target.value as ContextType)}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          >
            {contextTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="context-content" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Content <span className="text-[#DC2626]">*</span>
          </label>
          <textarea
            id="context-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={contentPlaceholder}
            rows={4}
            maxLength={5000}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 resize-none"
          />
          {errors.content && <p className="mt-1 text-xs text-[#DC2626]">{errors.content}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35] disabled:opacity-50"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !name.trim() || !content.trim()}
          className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e55a2b] hover:shadow-md hover:shadow-[#FF6B35]/30 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
