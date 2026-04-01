'use client'

import { useState, useMemo } from 'react'
import type { ContextItem, ContextItemType } from '@/types/context-item'
import { ContextCard } from './context-card'

const filterOptions: { key: 'all' | ContextItemType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'note', label: 'Notes' },
  { key: 'document', label: 'Documents' },
  { key: 'url', label: 'URLs' },
]

interface ContextListProps {
  items: ContextItem[]
  onEdit: (item: ContextItem) => void
  onDelete: (item: ContextItem) => void
}

export function ContextList({ items, onEdit, onDelete }: ContextListProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | ContextItemType>('all')

  const filtered = useMemo(() => {
    let result = items
    if (typeFilter !== 'all') {
      result = result.filter((item) => item.type === typeFilter)
    }
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
      )
    }
    return result
  }, [items, search, typeFilter])

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[#E8E4E0] bg-[#F9FAFB] p-8 text-center">
        <p className="text-sm text-[#9A948D]">No context items yet</p>
        <p className="mt-1 text-xs text-[#9A948D]">Add notes, documents, or URLs to get started</p>
      </div>
    )
  }

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search context items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 sm:max-w-xs"
        />
        <div className="flex gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTypeFilter(opt.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                typeFilter === opt.key
                  ? 'bg-[#2563EB] text-white'
                  : 'border border-[#E8E4E0] bg-white text-[#9A948D] hover:text-[#2D1810]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#E8E4E0] bg-[#F9FAFB] p-8 text-center">
          <p className="text-sm text-[#9A948D]">No items match your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ContextCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
