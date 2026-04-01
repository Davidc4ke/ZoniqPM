'use client'

import type { ContextItem } from '@/types/context-item'
import { format } from 'date-fns'

const typeConfig: Record<ContextItem['type'], { label: string; icon: string; bg: string; color: string }> = {
  note: { label: 'Note', icon: '📝', bg: 'bg-[#FEF9C3]', color: 'text-[#A16207]' },
  document: { label: 'Document', icon: '📄', bg: 'bg-[#DBEAFE]', color: 'text-[#2563EB]' },
  url: { label: 'URL', icon: '🔗', bg: 'bg-[#ECFDF5]', color: 'text-[#059669]' },
}

interface ContextCardProps {
  item: ContextItem
}

export function ContextCard({ item }: ContextCardProps) {
  const config = typeConfig[item.type]

  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{config.icon}</span>
          <h3 className="text-sm font-semibold text-[#2D1810] line-clamp-1">{item.name}</h3>
        </div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}
        >
          {config.label}
        </span>
      </div>

      <p className="mb-3 text-sm text-[#9A948D] line-clamp-2">
        {item.type === 'url' ? (
          <a
            href={item.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:underline break-all"
          >
            {item.content}
          </a>
        ) : (
          item.content
        )}
      </p>

      <p className="text-xs text-[#9A948D]">
        Updated {format(new Date(item.updatedAt), 'MMM d, yyyy')}
      </p>
    </div>
  )
}
