'use client'

import { useState } from 'react'
import { useContextItems } from '@/hooks/use-context-items'
import { ContextList } from './context-list'
import { ContextDialog } from './context-dialog'
import { DeleteContextDialog } from './delete-context-dialog'
import type { ContextItem } from '@/types/context-item'

function ContextSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 rounded-xl bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

interface AppContextProps {
  appId: string
}

export function AppContext({ appId }: AppContextProps) {
  const { data: items, isLoading, isError, error } = useContextItems(appId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<ContextItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<ContextItem | null>(null)

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

      <ContextList
        items={items ?? []}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(item) => setDeletingItem(item)}
      />

      <ContextDialog
        appId={appId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      <ContextDialog
        appId={appId}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        contextItem={editingItem}
      />

      <DeleteContextDialog
        appId={appId}
        contextItem={deletingItem}
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
      />
    </div>
  )
}
