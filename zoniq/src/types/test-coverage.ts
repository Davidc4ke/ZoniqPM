export type CoverageHealthStatus = 'excellent' | 'good' | 'critical'

export interface ModuleCoverage {
  moduleId: string
  moduleName: string
  totalTests: number
  passedTests: number
  failedTests: number
  pendingTests: number
  coveragePercentage: number
  healthStatus: CoverageHealthStatus
}

export interface FeatureCoverage {
  featureId: string
  featureName: string
  totalTests: number
  passedTests: number
  failedTests: number
  pendingTests: number
  coveragePercentage: number
}

export type TestItemType = 'test-script' | 'uat-step'
export type TestItemStatus = 'passed' | 'failed' | 'pending'

export interface TestItem {
  id: string
  name: string
  type: TestItemType
  status: TestItemStatus
}

export function getCoverageHealth(percentage: number): CoverageHealthStatus {
  if (percentage >= 80) return 'excellent'
  if (percentage >= 50) return 'good'
  return 'critical'
}
