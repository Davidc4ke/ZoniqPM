'use client'

import { useState, useMemo } from 'react'
import { useContextItems } from '@/hooks/use-context-items'
import { ContextList } from './context-list'
import { ContextDialog } from './context-dialog'
import type { ContextItemType } from '@/types/context-item'

function ContextsSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 rounded-xl bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

interface AppContextsProps {
  appId: string
}

const filterOptions: { value: '' | ContextItemType; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'note', label: 'Notes' },
  { value: 'document', label: 'Documents' },
  { value: 'url', label: 'URLs' },
]

export function AppContexts({ appId }: AppContextsProps) {
  const { data: items, isLoading, isError, error } = useContextItems(appId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'' | ContextItemType>('')

  const filteredItems = useMemo(() => {
    if (!items) return []
    let result = items
    if (typeFilter) {
      result = result.filter((item) => item.type === typeFilter)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
      )
    }
    return result
  }, [items, typeFilter, searchQuery])

  if (isLoading) return <ContextsSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load context items'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#2D1810]">Context</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="rounded-lg bg-[#FF6B35] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#e55a2b]"
        >
          Add Context
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search context items..."
          className="flex-1 rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as '' | ContextItemType)}
          className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm text-[#2D1810] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <ContextList items={filteredItems} />

      <ContextDialog
        appId={appId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  )
}
