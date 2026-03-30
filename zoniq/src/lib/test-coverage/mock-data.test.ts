import { describe, it, expect, beforeEach } from 'vitest'
import {
  getModuleCoverage,
  getFeatureCoverage,
  getFeatureTestItems,
  resetTestCoverage,
} from './mock-data'

beforeEach(() => {
  resetTestCoverage()
})

describe('getModuleCoverage', () => {
  it('should return module coverage data for a valid appId', () => {
    const coverage = getModuleCoverage('1')
    expect(coverage.length).toBeGreaterThan(0)
    coverage.forEach((mc) => {
      expect(mc.moduleId).toBeDefined()
      expect(mc.moduleName).toBeDefined()
      expect(typeof mc.totalTests).toBe('number')
      expect(typeof mc.passedTests).toBe('number')
      expect(typeof mc.failedTests).toBe('number')
      expect(typeof mc.pendingTests).toBe('number')
      expect(typeof mc.coveragePercentage).toBe('number')
      expect(['excellent', 'good', 'critical']).toContain(mc.healthStatus)
    })
  })

  it('should return empty array for unknown appId', () => {
    const coverage = getModuleCoverage('unknown-app')
    expect(coverage).toEqual([])
  })

  it('should return coverage for multiple modules', () => {
    const coverage = getModuleCoverage('1')
    expect(coverage.length).toBe(3) // 3 default modules per app
  })

  it('should have consistent test counts', () => {
    const coverage = getModuleCoverage('1')
    coverage.forEach((mc) => {
      expect(mc.passedTests + mc.failedTests + mc.pendingTests).toBe(mc.totalTests)
    })
  })

  it('should have valid coverage percentages', () => {
    const coverage = getModuleCoverage('1')
    coverage.forEach((mc) => {
      expect(mc.coveragePercentage).toBeGreaterThanOrEqual(0)
      expect(mc.coveragePercentage).toBeLessThanOrEqual(100)
    })
  })

  it('should have correct health status based on percentage', () => {
    const coverage = getModuleCoverage('1')
    coverage.forEach((mc) => {
      if (mc.coveragePercentage >= 80) {
        expect(mc.healthStatus).toBe('excellent')
      } else if (mc.coveragePercentage >= 50) {
        expect(mc.healthStatus).toBe('good')
      } else {
        expect(mc.healthStatus).toBe('critical')
      }
    })
  })
})

describe('getFeatureCoverage', () => {
  it('should return feature coverage for a valid moduleId', () => {
    const moduleCoverage = getModuleCoverage('1')
    const moduleId = moduleCoverage[0].moduleId
    const featureCoverage = getFeatureCoverage(moduleId)
    expect(featureCoverage.length).toBeGreaterThan(0)
    featureCoverage.forEach((fc) => {
      expect(fc.featureId).toBeDefined()
      expect(fc.featureName).toBeDefined()
      expect(typeof fc.totalTests).toBe('number')
      expect(typeof fc.passedTests).toBe('number')
      expect(typeof fc.failedTests).toBe('number')
      expect(typeof fc.pendingTests).toBe('number')
      expect(typeof fc.coveragePercentage).toBe('number')
    })
  })

  it('should return empty array for unknown moduleId', () => {
    const featureCoverage = getFeatureCoverage('unknown-module')
    expect(featureCoverage).toEqual([])
  })

  it('should have consistent test counts', () => {
    const moduleCoverage = getModuleCoverage('1')
    const featureCoverage = getFeatureCoverage(moduleCoverage[0].moduleId)
    featureCoverage.forEach((fc) => {
      expect(fc.passedTests + fc.failedTests + fc.pendingTests).toBe(fc.totalTests)
    })
  })

  it('should have valid coverage percentages', () => {
    const moduleCoverage = getModuleCoverage('1')
    const featureCoverage = getFeatureCoverage(moduleCoverage[0].moduleId)
    featureCoverage.forEach((fc) => {
      expect(fc.coveragePercentage).toBeGreaterThanOrEqual(0)
      expect(fc.coveragePercentage).toBeLessThanOrEqual(100)
    })
  })
})

describe('getFeatureTestItems', () => {
  it('should return test items for a valid featureId', () => {
    const moduleCoverage = getModuleCoverage('1')
    const featureCoverage = getFeatureCoverage(moduleCoverage[0].moduleId)
    const featureId = featureCoverage[0].featureId
    const items = getFeatureTestItems(featureId)
    expect(items.length).toBeGreaterThan(0)
    items.forEach((item) => {
      expect(item.id).toBeDefined()
      expect(item.name).toBeDefined()
      expect(['test-script', 'uat-step']).toContain(item.type)
      expect(['passed', 'failed', 'pending']).toContain(item.status)
    })
  })

  it('should return empty array for unknown featureId', () => {
    const items = getFeatureTestItems('unknown-feature')
    expect(items).toEqual([])
  })

  it('should contain both test-script and uat-step types', () => {
    const moduleCoverage = getModuleCoverage('1')
    const featureCoverage = getFeatureCoverage(moduleCoverage[0].moduleId)
    // Check across all features to find both types
    let hasTestScript = false
    let hasUatStep = false
    for (const fc of featureCoverage) {
      const items = getFeatureTestItems(fc.featureId)
      for (const item of items) {
        if (item.type === 'test-script') hasTestScript = true
        if (item.type === 'uat-step') hasUatStep = true
      }
    }
    expect(hasTestScript).toBe(true)
    expect(hasUatStep).toBe(true)
  })
})

describe('resetTestCoverage', () => {
  it('should reset data to initial state', () => {
    const before = getModuleCoverage('1')
    expect(before.length).toBeGreaterThan(0)
    resetTestCoverage()
    const after = getModuleCoverage('1')
    expect(after.length).toBe(before.length)
  })
})
