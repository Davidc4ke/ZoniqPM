'use client'

import type { ContextItem } from '@/types/context'
import { format } from 'date-fns'

const typeConfig: Record<ContextItem['type'], { icon: string; color: string; bg: string; label: string }> = {
  note: { icon: 'N', color: '#2563EB', bg: 'bg-[#DBEAFE]', label: 'Note' },
  document: { icon: 'D', color: '#7C3AED', bg: 'bg-[#EDE9FE]', label: 'Document' },
  url: { icon: 'U', color: '#059669', bg: 'bg-[#ECFDF5]', label: 'URL' },
}

interface ContextCardProps {
  context: ContextItem
  onEdit: (ctx: ContextItem) => void
  onDelete: (ctx: ContextItem) => void
}

export function ContextCard({ context, onEdit, onDelete }: ContextCardProps) {
  const config = typeConfig[context.type]
  const createdDate = (() => {
    try {
      return format(new Date(context.createdAt), 'MMM d, yyyy')
    } catch {
      return context.createdAt
    }
  })()

  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header with type badge */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#2D1810] truncate pr-2">{context.name}</h3>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg}`}
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      </div>

      {/* Content preview */}
      <div className="mb-3">
        {context.type === 'url' ? (
          <a
            href={context.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2563EB] hover:underline truncate block"
          >
            {context.content}
          </a>
        ) : (
          <p className="text-sm text-[#9A948D] line-clamp-3">{context.content}</p>
        )}
      </div>

      {/* Date */}
      <div className="mb-3">
        <p className="text-xs text-[#9A948D]">Created {createdDate}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-[#E8E4E0] pt-3">
        <button
          onClick={() => onEdit(context)}
          className="flex-1 rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#2D1810] transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(context)}
          className="flex-1 rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#DC2626] transition-colors hover:border-[#DC2626] hover:bg-[#FEF2F2]"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
