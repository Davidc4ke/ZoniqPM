import { describe, it, expect } from 'vitest'
import { getCoverageHealth } from './test-coverage'
import type { ModuleCoverage, FeatureCoverage, TestItem, CoverageHealthStatus } from './test-coverage'

describe('ModuleCoverage type', () => {
  it('should define ModuleCoverage interface shape', () => {
    const coverage: ModuleCoverage = {
      moduleId: 'mod-1-1',
      moduleName: 'Authentication',
      totalTests: 15,
      passedTests: 12,
      failedTests: 2,
      pendingTests: 1,
      coveragePercentage: 80,
      healthStatus: 'excellent',
    }
    expect(coverage.moduleId).toBe('mod-1-1')
    expect(coverage.moduleName).toBe('Authentication')
    expect(coverage.totalTests).toBe(15)
    expect(coverage.passedTests).toBe(12)
    expect(coverage.failedTests).toBe(2)
    expect(coverage.pendingTests).toBe(1)
    expect(coverage.coveragePercentage).toBe(80)
    expect(coverage.healthStatus).toBe('excellent')
  })
})

describe('FeatureCoverage type', () => {
  it('should define FeatureCoverage interface shape', () => {
    const coverage: FeatureCoverage = {
      featureId: 'feat-mod-1-1-1',
      featureName: 'Login Flow',
      totalTests: 5,
      passedTests: 4,
      failedTests: 1,
      pendingTests: 0,
      coveragePercentage: 80,
    }
    expect(coverage.featureId).toBe('feat-mod-1-1-1')
    expect(coverage.featureName).toBe('Login Flow')
    expect(coverage.totalTests).toBe(5)
    expect(coverage.coveragePercentage).toBe(80)
  })
})

describe('TestItem type', () => {
  it('should define test-script type', () => {
    const item: TestItem = {
      id: 'ti-1',
      name: 'Login validation test',
      type: 'test-script',
      status: 'passed',
    }
    expect(item.id).toBe('ti-1')
    expect(item.name).toBe('Login validation test')
    expect(item.type).toBe('test-script')
    expect(item.status).toBe('passed')
  })

  it('should define uat-step type', () => {
    const item: TestItem = {
      id: 'ti-2',
      name: 'Verify login page loads',
      type: 'uat-step',
      status: 'failed',
    }
    expect(item.type).toBe('uat-step')
    expect(item.status).toBe('failed')
  })

  it('should support pending status', () => {
    const item: TestItem = {
      id: 'ti-3',
      name: 'Check session timeout',
      type: 'test-script',
      status: 'pending',
    }
    expect(item.status).toBe('pending')
  })
})

describe('CoverageHealthStatus type', () => {
  it('should support excellent, good, and critical values', () => {
    const statuses: CoverageHealthStatus[] = ['excellent', 'good', 'critical']
    expect(statuses).toHaveLength(3)
    expect(statuses).toContain('excellent')
    expect(statuses).toContain('good')
    expect(statuses).toContain('critical')
  })
})

describe('getCoverageHealth', () => {
  it('should return excellent for 80%', () => {
    expect(getCoverageHealth(80)).toBe('excellent')
  })

  it('should return excellent for 100%', () => {
    expect(getCoverageHealth(100)).toBe('excellent')
  })

  it('should return excellent for 95%', () => {
    expect(getCoverageHealth(95)).toBe('excellent')
  })

  it('should return good for 50%', () => {
    expect(getCoverageHealth(50)).toBe('good')
  })

  it('should return good for 79%', () => {
    expect(getCoverageHealth(79)).toBe('good')
  })

  it('should return good for 65%', () => {
    expect(getCoverageHealth(65)).toBe('good')
  })

  it('should return critical for 49%', () => {
    expect(getCoverageHealth(49)).toBe('critical')
  })

  it('should return critical for 0%', () => {
    expect(getCoverageHealth(0)).toBe('critical')
  })

  it('should return critical for 25%', () => {
    expect(getCoverageHealth(25)).toBe('critical')
  })
})
