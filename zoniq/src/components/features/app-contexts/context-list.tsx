'use client'

import type { ContextItem } from '@/types/context-item'
import { ContextCard } from './context-card'

interface ContextListProps {
  items: ContextItem[]
}

export function ContextList({ items }: ContextListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[#E8E4E0] bg-[#F9FAFB] p-8 text-center">
        <p className="text-sm text-[#9A948D]">No context items yet</p>
        <p className="mt-1 text-xs text-[#9A948D]">Add notes, documents, or URLs to provide context for this app</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContextCard key={item.id} item={item} />
      ))}
    </div>
  )
}
