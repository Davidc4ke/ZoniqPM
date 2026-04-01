'use client'

import { useState, useMemo } from 'react'
import { useAppContext } from '@/hooks/use-app-context'
import { ContextCard } from './context-card'
import { ContextDialog } from './context-dialog'
import type { ContextItemType } from '@/types/app-context'

function ContextSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-xl bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

const filterOptions: { value: ContextItemType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'note', label: 'Notes' },
  { value: 'document', label: 'Documents' },
  { value: 'url', label: 'URLs' },
]

interface AppContextProps {
  appId: string
}

export function AppContext({ appId }: AppContextProps) {
  const { data: items, isLoading, isError, error } = useAppContext(appId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ContextItemType | 'all'>('all')

  const filtered = useMemo(() => {
    if (!items) return []
    return items.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [items, typeFilter, search])

  if (isLoading) return <ContextSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load context items'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2D1810]">Context</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
        >
          Add Context
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A948D]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search context items..."
            className="w-full rounded-lg border border-[#E8E4E0] py-2 pl-9 pr-3 text-sm text-[#2D1810] placeholder-[#9A948D] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
        <div className="flex gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                typeFilter === opt.value
                  ? 'bg-[#2563EB] text-white'
                  : 'border border-[#E8E4E0] text-[#9A948D] hover:bg-[#F5F2EF]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#E5E2DD] bg-white p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-[#9A948D]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="mt-4 text-base font-semibold text-[#2D1810]">
            {items && items.length > 0 ? 'No matching items' : 'No context items yet'}
          </h3>
          <p className="mt-1 text-sm text-[#9A948D]">
            {items && items.length > 0
              ? 'Try adjusting your search or filter criteria.'
              : 'Add notes, documents, or URLs to provide context for this app.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <ContextCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <ContextDialog appId={appId} isOpen={showAddDialog} onClose={() => setShowAddDialog(false)} />
    </div>
  )
}
