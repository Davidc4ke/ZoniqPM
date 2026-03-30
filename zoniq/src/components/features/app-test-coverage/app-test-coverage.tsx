'use client'

import { useModuleCoverage } from '@/hooks/use-test-coverage'
import { ModuleCoverageRow } from './module-coverage-row'

interface AppTestCoverageProps {
  appId: string
}

function CoverageSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-14 rounded-lg bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

export function AppTestCoverage({ appId }: AppTestCoverageProps) {
  const { data: moduleCoverage, isLoading, isError, error } = useModuleCoverage(appId)

  if (isLoading) return <CoverageSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load coverage'}
      </div>
    )
  }

  if (!moduleCoverage || moduleCoverage.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-[#9A948D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-3 text-sm text-[#9A948D]">No test coverage data available</p>
        <p className="mt-1 text-xs text-[#9A948D]">Test coverage will appear here once tests are configured for this app.</p>
      </div>
    )
  }

  const totalTests = moduleCoverage.reduce((sum, mc) => sum + mc.totalTests, 0)
  const totalPassed = moduleCoverage.reduce((sum, mc) => sum + mc.passedTests, 0)
  const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2D1810]">Test Coverage</h2>
        <p className="mt-1 text-sm text-[#9A948D]">
          {totalTests} total tests across {moduleCoverage.length} modules — {overallPercentage}% overall coverage
        </p>
      </div>

      <div className="space-y-3">
        {moduleCoverage.map((mc) => (
          <ModuleCoverageRow key={mc.moduleId} module={mc} appId={appId} />
        ))}
      </div>
    </div>
  )
}
