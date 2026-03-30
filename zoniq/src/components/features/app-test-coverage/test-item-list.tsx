'use client'

import type { TestItem } from '@/types/test-coverage'

const statusIcons: Record<string, { icon: string; color: string }> = {
  passed: { icon: '\u2713', color: 'text-[#16A34A]' },
  failed: { icon: '\u2717', color: 'text-[#DC2626]' },
  pending: { icon: '\u25CB', color: 'text-[#D97706]' },
}

const typeBadgeColors: Record<string, string> = {
  'test-script': 'bg-[#DBEAFE] text-[#2563EB]',
  'uat-step': 'bg-[#F3E8FF] text-[#7C3AED]',
}

const typeLabels: Record<string, string> = {
  'test-script': 'Test Script',
  'uat-step': 'UAT Step',
}

interface TestItemListProps {
  items: TestItem[]
}

export function TestItemList({ items }: TestItemListProps) {
  if (items.length === 0) {
    return (
      <p className="py-2 text-xs text-[#9A948D]">No test items found</p>
    )
  }

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const status = statusIcons[item.status]
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg bg-[#F9FAFB] px-3 py-2"
          >
            <span className={`text-sm font-bold ${status.color}`}>{status.icon}</span>
            <span className="flex-1 text-sm text-[#2D1810]">{item.name}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeBadgeColors[item.type]}`}>
              {typeLabels[item.type]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
