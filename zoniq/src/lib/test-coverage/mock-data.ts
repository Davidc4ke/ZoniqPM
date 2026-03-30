import type { ModuleCoverage, FeatureCoverage, TestItem } from '@/types/test-coverage'
import { getCoverageHealth } from '@/types/test-coverage'

// TODO: Replace with Drizzle ORM database queries when PostgreSQL is configured

interface ModuleCoverageData {
  moduleName: string
  features: FeatureCoverageData[]
}

interface FeatureCoverageData {
  featureName: string
  testItems: TestItem[]
}

function generateTestItems(featureId: string, featureName: string): TestItem[] {
  const scripts: Array<{ name: string; type: 'test-script' | 'uat-step'; status: 'passed' | 'failed' | 'pending' }> = [
    { name: `Validate ${featureName} renders correctly`, type: 'test-script', status: 'passed' },
    { name: `Test ${featureName} error handling`, type: 'test-script', status: 'passed' },
    { name: `Verify ${featureName} user interaction`, type: 'uat-step', status: 'passed' },
    { name: `Check ${featureName} edge cases`, type: 'test-script', status: 'failed' },
    { name: `UAT: ${featureName} acceptance`, type: 'uat-step', status: 'pending' },
  ]
  return scripts.map((s, i) => ({
    id: `ti-${featureId}-${i + 1}`,
    name: s.name,
    type: s.type,
    status: s.status,
  }))
}

function generateModuleCoverageData(appId: string): Map<string, ModuleCoverageData> {
  const moduleConfigs: Array<{ idx: number; name: string; features: Array<{ idx: number; name: string; passRate: number }> }> = [
    {
      idx: 1,
      name: 'Authentication',
      features: [
        { idx: 1, name: 'Login Flow', passRate: 0.9 },
        { idx: 2, name: 'Data Validation', passRate: 0.7 },
      ],
    },
    {
      idx: 2,
      name: 'Dashboard',
      features: [
        { idx: 1, name: 'Login Flow', passRate: 0.6 },
        { idx: 2, name: 'Data Validation', passRate: 0.4 },
      ],
    },
    {
      idx: 3,
      name: 'Administration',
      features: [
        { idx: 1, name: 'Login Flow', passRate: 1.0 },
        { idx: 2, name: 'Data Validation', passRate: 0.8 },
      ],
    },
  ]

  const result = new Map<string, ModuleCoverageData>()

  for (const mc of moduleConfigs) {
    const moduleId = `mod-${appId}-${mc.idx}`
    const features: FeatureCoverageData[] = mc.features.map((fc) => {
      const featureId = `feat-${moduleId}-${fc.idx}`
      const items = generateTestItems(featureId, fc.name)
      // Adjust statuses based on passRate
      const passCount = Math.round(items.length * fc.passRate)
      items.forEach((item, i) => {
        if (i < passCount) {
          item.status = 'passed'
        } else if (i < passCount + 1) {
          item.status = 'failed'
        } else {
          item.status = 'pending'
        }
      })
      return { featureName: fc.name, testItems: items }
    })
    result.set(moduleId, { moduleName: mc.name, features })
  }

  return result
}

// Pre-seed coverage data for apps 1-5
function generateAllCoverageData(): Map<string, Map<string, ModuleCoverageData>> {
  const data = new Map<string, Map<string, ModuleCoverageData>>()
  for (let appId = 1; appId <= 5; appId++) {
    data.set(String(appId), generateModuleCoverageData(String(appId)))
  }
  return data
}

let coverageData = generateAllCoverageData()

export function getModuleCoverage(appId: string): ModuleCoverage[] {
  const appData = coverageData.get(appId)
  if (!appData) return []

  const result: ModuleCoverage[] = []
  for (const [moduleId, moduleData] of appData) {
    let totalTests = 0
    let passedTests = 0
    let failedTests = 0
    let pendingTests = 0

    for (const feature of moduleData.features) {
      for (const item of feature.testItems) {
        totalTests++
        if (item.status === 'passed') passedTests++
        else if (item.status === 'failed') failedTests++
        else pendingTests++
      }
    }

    const coveragePercentage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0

    result.push({
      moduleId,
      moduleName: moduleData.moduleName,
      totalTests,
      passedTests,
      failedTests,
      pendingTests,
      coveragePercentage,
      healthStatus: getCoverageHealth(coveragePercentage),
    })
  }

  return result
}

export function getFeatureCoverage(moduleId: string): FeatureCoverage[] {
  // Find the module across all apps
  for (const appData of coverageData.values()) {
    const moduleData = appData.get(moduleId)
    if (!moduleData) continue

    return moduleData.features.map((feature, idx) => {
      const featureId = `feat-${moduleId}-${idx + 1}`
      let totalTests = 0
      let passedTests = 0
      let failedTests = 0
      let pendingTests = 0

      for (const item of feature.testItems) {
        totalTests++
        if (item.status === 'passed') passedTests++
        else if (item.status === 'failed') failedTests++
        else pendingTests++
      }

      const coveragePercentage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0

      return {
        featureId,
        featureName: feature.featureName,
        totalTests,
        passedTests,
        failedTests,
        pendingTests,
        coveragePercentage,
      }
    })
  }

  return []
}

export function getFeatureTestItems(featureId: string): TestItem[] {
  for (const appData of coverageData.values()) {
    for (const [moduleId, moduleData] of appData) {
      for (let i = 0; i < moduleData.features.length; i++) {
        const expectedId = `feat-${moduleId}-${i + 1}`
        if (expectedId === featureId) {
          return moduleData.features[i].testItems
        }
      }
    }
  }
  return []
}

export function resetTestCoverage(): void {
  coverageData = generateAllCoverageData()
}
