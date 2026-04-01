'use client'

import { useState } from 'react'
import type { ContextItemType } from '@/types/context-item'

interface ContextFormProps {
  onSubmit: (data: { name: string; type: ContextItemType; content: string }) => void
  onCancel: () => void
  isPending: boolean
}

const typeOptions: { value: ContextItemType; label: string }[] = [
  { value: 'note', label: 'Note' },
  { value: 'document', label: 'Document' },
  { value: 'url', label: 'URL' },
]

export function ContextForm({ onSubmit, onCancel, isPending }: ContextFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ContextItemType>('note')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{ name?: string; content?: string }>({})

  const validate = (): boolean => {
    const newErrors: { name?: string; content?: string } = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    else if (name.length > 200) newErrors.name = 'Name must be 200 characters or less'
    if (!content.trim()) newErrors.content = 'Content is required'
    if (type === 'url' && content.trim()) {
      try {
        new URL(content.trim())
      } catch {
        newErrors.content = 'Must be a valid URL'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ name: name.trim(), type, content: content.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="ctx-name" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Name <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            id="ctx-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Architecture Decision Record"
            maxLength={200}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          />
          {errors.name && <p className="mt-1 text-xs text-[#DC2626]">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="ctx-type" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Type <span className="text-[#DC2626]">*</span>
          </label>
          <select
            id="ctx-type"
            value={type}
            onChange={(e) => setType(e.target.value as ContextItemType)}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ctx-content" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            {type === 'url' ? 'URL' : 'Content'} <span className="text-[#DC2626]">*</span>
          </label>
          {type === 'url' ? (
            <input
              type="text"
              id="ctx-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://example.com/resource"
              className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
            />
          ) : (
            <textarea
              id="ctx-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'note' ? 'Enter your notes...' : 'Enter document content or summary...'}
              rows={4}
              className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 resize-none"
            />
          )}
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
          {isPending ? 'Adding...' : 'Add Context'}
        </button>
      </div>
    </form>
  )
}
