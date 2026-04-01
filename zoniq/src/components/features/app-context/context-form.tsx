'use client'

import { useState } from 'react'
import type { ContextItemType } from '@/types/context-item'

interface ContextFormData {
  type: ContextItemType
  title: string
  content: string
  url: string
}

interface ContextFormProps {
  initialType?: ContextItemType
  initialTitle?: string
  initialContent?: string
  initialUrl?: string
  onSubmit: (data: ContextFormData) => void
  onCancel: () => void
  isPending: boolean
  submitLabel: string
}

export function ContextForm({
  initialType = 'note',
  initialTitle = '',
  initialContent = '',
  initialUrl = '',
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: ContextFormProps) {
  const [type, setType] = useState<ContextItemType>(initialType)
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [url, setUrl] = useState(initialUrl)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    else if (title.length > 200) newErrors.title = 'Title must be 200 characters or less'
    if (!content.trim()) newErrors.content = 'Content is required'
    else if (content.length > 5000) newErrors.content = 'Content must be 5000 characters or less'
    if (url.trim()) {
      try {
        new URL(url)
      } catch {
        newErrors.url = 'Must be a valid URL'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        type,
        title: title.trim(),
        content: content.trim(),
        url: url.trim(),
      })
    }
  }

  const typeOptions: { value: ContextItemType; label: string }[] = [
    { value: 'note', label: 'Note' },
    { value: 'document', label: 'Document' },
    { value: 'url', label: 'URL' },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Type selector */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Type <span className="text-[#DC2626]">*</span>
          </label>
          <div className="flex gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  type === opt.value
                    ? 'bg-[#2563EB] text-white'
                    : 'border border-[#E8E4E0] bg-white text-[#9A948D] hover:text-[#2D1810]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="ctx-title" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Title <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            id="ctx-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Architecture Notes"
            maxLength={200}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          />
          {errors.title && <p className="mt-1 text-xs text-[#DC2626]">{errors.title}</p>}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="ctx-content" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Content <span className="text-[#DC2626]">*</span>
          </label>
          <textarea
            id="ctx-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter details, notes, or description..."
            rows={4}
            maxLength={5000}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 resize-none"
          />
          {errors.content && <p className="mt-1 text-xs text-[#DC2626]">{errors.content}</p>}
        </div>

        {/* URL (optional, shown for all types but especially relevant for 'url') */}
        <div>
          <label htmlFor="ctx-url" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            URL {type === 'url' ? <span className="text-[#9A948D] text-xs">(recommended for URL type)</span> : <span className="text-[#9A948D] text-xs">(optional)</span>}
          </label>
          <input
            type="text"
            id="ctx-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/document"
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          />
          {errors.url && <p className="mt-1 text-xs text-[#DC2626]">{errors.url}</p>}
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
          disabled={isPending || !title.trim() || !content.trim()}
          className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e55a2b] hover:shadow-md hover:shadow-[#FF6B35]/30 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
