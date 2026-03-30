'use client'

import { useState } from 'react'

interface EnvironmentFormProps {
  initialName?: string
  initialUrl?: string
  onSubmit: (data: { name: string; url: string }) => void
  onCancel: () => void
  isPending: boolean
  submitLabel: string
}

export function EnvironmentForm({
  initialName = '',
  initialUrl = '',
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: EnvironmentFormProps) {
  const [name, setName] = useState(initialName)
  const [url, setUrl] = useState(initialUrl)
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({})

  const validate = (): boolean => {
    const newErrors: { name?: string; url?: string } = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    else if (name.length > 100) newErrors.name = 'Name must be 100 characters or less'
    if (!url.trim()) newErrors.url = 'URL is required'
    else {
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
      onSubmit({ name: name.trim(), url: url.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="env-name" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            Name <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            id="env-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Development"
            maxLength={100}
            className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          />
          {errors.name && <p className="mt-1 text-xs text-[#DC2626]">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="env-url" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
            URL <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            id="env-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://app.example.com"
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
          disabled={isPending || !name.trim() || !url.trim()}
          className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e55a2b] hover:shadow-md hover:shadow-[#FF6B35]/30 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
