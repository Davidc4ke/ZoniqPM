'use client'

import { useState } from 'react'
import type { FeatureCoverage } from '@/types/test-coverage'
import { useFeatureTestItems } from '@/hooks/use-test-coverage'
import { TestItemList } from './test-item-list'

interface FeatureCoverageRowProps {
  feature: FeatureCoverage
  appId: string
}

export function FeatureCoverageRow({ feature, appId }: FeatureCoverageRowProps) {
  const [expanded, setExpanded] = useState(false)
  const { data: testItems } = useFeatureTestItems(appId, expanded ? feature.featureId : '')

  return (
    <div className="border-b border-[#F5F2EF] last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#F9FAFB]"
      >
        <svg
          className={`h-3 w-3 text-[#9A948D] transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="flex-1 text-sm text-[#2D1810]">{feature.featureName}</span>
        <span className="text-xs text-[#9A948D]">{feature.totalTests} tests</span>
        <span className="min-w-[3rem] text-right text-sm font-semibold text-[#2D1810]">
          {feature.coveragePercentage}%
        </span>
      </button>
      {expanded && testItems && (
        <div className="px-8 pb-3">
          <TestItemList items={testItems} />
        </div>
      )}
    </div>
  )
}
