'use client'

import { useState } from 'react'
import { useCreateContextItem } from '@/hooks/use-app-context'
import type { ContextItemType } from '@/types/app-context'

interface ContextDialogProps {
  appId: string
  isOpen: boolean
  onClose: () => void
}

const typeOptions: { value: ContextItemType; label: string }[] = [
  { value: 'note', label: 'Note' },
  { value: 'document', label: 'Document' },
  { value: 'url', label: 'URL' },
]

export function ContextDialog({ appId, isOpen, onClose }: ContextDialogProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ContextItemType>('note')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const createMutation = useCreateContextItem(appId)

  if (!isOpen) return null

  function validate() {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (title.length > 200) errs.title = 'Title must be 200 characters or less'
    if (!content.trim()) errs.content = 'Content is required'
    if (type === 'url') {
      try {
        new URL(content)
      } catch {
        errs.content = 'Must be a valid URL'
      }
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    try {
      await createMutation.mutateAsync({ title: title.trim(), type, content: content.trim() })
      setTitle('')
      setType('note')
      setContent('')
      onClose()
    } catch {
      // error handled by mutation state
    }
  }

  function handleClose() {
    setTitle('')
    setType('note')
    setContent('')
    setErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#2D1810]">Add Context</h2>
        <p className="mt-1 text-sm text-[#9A948D]">Add a note, document, or URL to this app.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="ctx-title" className="block text-sm font-medium text-[#2D1810]">
              Title
            </label>
            <input
              id="ctx-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E8E4E0] px-3 py-2 text-sm text-[#2D1810] placeholder-[#9A948D] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              placeholder="Enter a title"
            />
            {errors.title && <p className="mt-1 text-xs text-[#DC2626]">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="ctx-type" className="block text-sm font-medium text-[#2D1810]">
              Type
            </label>
            <select
              id="ctx-type"
              value={type}
              onChange={(e) => setType(e.target.value as ContextItemType)}
              className="mt-1 w-full rounded-lg border border-[#E8E4E0] px-3 py-2 text-sm text-[#2D1810] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ctx-content" className="block text-sm font-medium text-[#2D1810]">
              {type === 'url' ? 'URL' : 'Content'}
            </label>
            {type === 'url' ? (
              <input
                id="ctx-content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E8E4E0] px-3 py-2 text-sm text-[#2D1810] placeholder-[#9A948D] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                placeholder="https://example.com"
              />
            ) : (
              <textarea
                id="ctx-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-[#E8E4E0] px-3 py-2 text-sm text-[#2D1810] placeholder-[#9A948D] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                placeholder="Enter content..."
              />
            )}
            {errors.content && <p className="mt-1 text-xs text-[#DC2626]">{errors.content}</p>}
          </div>

          {createMutation.isError && (
            <p className="text-sm text-[#DC2626]">
              {createMutation.error?.message || 'Failed to create context item'}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#E8E4E0] px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#F5F2EF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {createMutation.isPending ? 'Adding...' : 'Add Context'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
