'use client'

import type { ReactNode } from 'react'
import type { ContextItem } from '@/types/app-context'
import { format } from 'date-fns'

const typeConfig: Record<string, { label: string; color: string; icon: ReactNode }> = {
  note: {
    label: 'Note',
    color: 'bg-[#FEF3C7] text-[#D97706]',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  document: {
    label: 'Document',
    color: 'bg-[#DBEAFE] text-[#2563EB]',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  url: {
    label: 'URL',
    color: 'bg-[#D1FAE5] text-[#059669]',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
}

interface ContextCardProps {
  item: ContextItem
}

export function ContextCard({ item }: ContextCardProps) {
  const config = typeConfig[item.type] ?? typeConfig.note

  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white p-4 transition-colors hover:border-[#FF6B35]/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${config.color}`}>
            {config.icon}
            {config.label}
          </span>
        </div>
        <span className="text-[11px] text-[#9A948D]">
          {format(new Date(item.updatedAt), 'MMM d, yyyy')}
        </span>
      </div>

      <h3 className="mt-2 text-sm font-semibold text-[#2D1810]">{item.title}</h3>

      {item.type === 'url' ? (
        <a
          href={item.content}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block truncate text-sm text-[#2563EB] hover:underline"
        >
          {item.content}
        </a>
      ) : (
        <p className="mt-1 line-clamp-2 text-sm text-[#9A948D]">{item.content}</p>
      )}
    </div>
  )
}
