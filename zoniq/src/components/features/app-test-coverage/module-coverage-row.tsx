'use client'

import { useState } from 'react'
import type { ModuleCoverage } from '@/types/test-coverage'
import { useFeatureCoverage } from '@/hooks/use-test-coverage'
import { CoverageHealthBadge } from './coverage-health-badge'
import { FeatureCoverageRow } from './feature-coverage-row'

interface ModuleCoverageRowProps {
  module: ModuleCoverage
  appId: string
}

export function ModuleCoverageRow({ module: mc, appId }: ModuleCoverageRowProps) {
  const [expanded, setExpanded] = useState(false)
  const { data: featureCoverage } = useFeatureCoverage(appId, expanded ? mc.moduleId : '')

  return (
    <div className="rounded-lg border border-[#E8E4E0] bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[#F5F2EF]"
      >
        <svg
          className={`h-4 w-4 text-[#9A948D] transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="flex-1 text-sm font-semibold text-[#2D1810]">{mc.moduleName}</span>
        <span className="text-xs text-[#9A948D]">{mc.totalTests} tests</span>
        <span className="min-w-[3rem] text-right text-sm font-bold text-[#2D1810]">
          {mc.coveragePercentage}%
        </span>
        <CoverageHealthBadge status={mc.healthStatus} />
      </button>
      {expanded && featureCoverage && (
        <div className="border-t border-[#E8E4E0] bg-[#FAFAF9]">
          {featureCoverage.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[#9A948D]">No features found</p>
          ) : (
            featureCoverage.map((fc) => (
              <FeatureCoverageRow key={fc.featureId} feature={fc} appId={appId} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
