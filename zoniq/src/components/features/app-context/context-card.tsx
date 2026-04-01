'use client'

import type { ContextItem } from '@/types/context-item'
import { formatDistanceToNow } from 'date-fns'

const typeConfig: Record<ContextItem['type'], { icon: string; color: string; bg: string; label: string }> = {
  note: { icon: 'N', color: '#2563EB', bg: 'bg-[#DBEAFE]', label: 'Note' },
  document: { icon: 'D', color: '#7C3AED', bg: 'bg-[#EDE9FE]', label: 'Document' },
  url: { icon: 'U', color: '#059669', bg: 'bg-[#ECFDF5]', label: 'URL' },
}

interface ContextCardProps {
  item: ContextItem
  onEdit: (item: ContextItem) => void
  onDelete: (item: ContextItem) => void
}

export function ContextCard({ item, onEdit, onDelete }: ContextCardProps) {
  const config = typeConfig[item.type]
  const updatedText = (() => {
    try {
      return formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })
    } catch {
      return item.updatedAt
    }
  })()

  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${config.bg}`}
            style={{ color: config.color }}
          >
            {config.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2D1810] line-clamp-1">{item.title}</h3>
            <span
              className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg}`}
              style={{ color: config.color }}
            >
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content preview */}
      <p className="mb-3 text-sm text-[#9A948D] line-clamp-2">{item.content}</p>

      {/* URL if present */}
      {item.url && (
        <p className="mb-3 truncate text-xs text-[#2563EB]">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {item.url}
          </a>
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#E8E4E0] pt-3">
        <p className="text-xs text-[#9A948D]">Updated {updatedText}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#2D1810] transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#DC2626] transition-colors hover:border-[#DC2626] hover:bg-[#FEF2F2]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
