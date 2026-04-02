'use client'

import { useState, useMemo } from 'react'
import { useContexts } from '@/hooks/use-contexts'
import { ContextList } from './context-list'
import { ContextDialog } from './context-dialog'
import { DeleteContextDialog } from './delete-context-dialog'
import type { ContextItem, ContextType } from '@/types/context'

function ContextsSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 rounded-xl bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

const typeFilters: { value: 'all' | ContextType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'note', label: 'Notes' },
  { value: 'document', label: 'Documents' },
  { value: 'url', label: 'URLs' },
]

interface AppContextProps {
  appId: string
}

export function AppContext({ appId }: AppContextProps) {
  const { data: contexts, isLoading, isError, error } = useContexts(appId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCtx, setEditingCtx] = useState<ContextItem | null>(null)
  const [deletingCtx, setDeletingCtx] = useState<ContextItem | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | ContextType>('all')

  const filtered = useMemo(() => {
    if (!contexts) return []
    let result = contexts
    if (typeFilter !== 'all') {
      result = result.filter((c) => c.type === typeFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.content.toLowerCase().includes(q)
      )
    }
    return result
  }, [contexts, typeFilter, search])

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

      {/* Search and filter bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search context items..."
          className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 sm:max-w-xs"
        />
        <div className="flex gap-1">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                typeFilter === f.value
                  ? 'bg-[#FF6B35] text-white'
                  : 'border border-[#E8E4E0] bg-white text-[#9A948D] hover:border-[#FF6B35] hover:text-[#FF6B35]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ContextList
        contexts={filtered}
        onEdit={(ctx) => setEditingCtx(ctx)}
        onDelete={(ctx) => setDeletingCtx(ctx)}
      />

      <ContextDialog
        appId={appId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      <ContextDialog
        appId={appId}
        isOpen={!!editingCtx}
        onClose={() => setEditingCtx(null)}
        context={editingCtx}
      />

      <DeleteContextDialog
        appId={appId}
        context={deletingCtx}
        isOpen={!!deletingCtx}
        onClose={() => setDeletingCtx(null)}
      />
    </div>
  )
}
