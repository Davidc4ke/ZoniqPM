'use client'

import type { CoverageHealthStatus } from '@/types/test-coverage'

const healthColors: Record<CoverageHealthStatus, string> = {
  excellent: 'bg-[#DCFCE7] text-[#16A34A]',
  good: 'bg-[#FEF3C7] text-[#D97706]',
  critical: 'bg-[#FEF2F2] text-[#DC2626]',
}

const healthLabels: Record<CoverageHealthStatus, string> = {
  excellent: 'Excellent',
  good: 'Good',
  critical: 'Critical',
}

interface CoverageHealthBadgeProps {
  status: CoverageHealthStatus
}

export function CoverageHealthBadge({ status }: CoverageHealthBadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${healthColors[status]}`}>
      {healthLabels[status]}
    </span>
  )
}
