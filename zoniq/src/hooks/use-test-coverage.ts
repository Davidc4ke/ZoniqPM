import { useQuery } from '@tanstack/react-query'
import type { ModuleCoverage, FeatureCoverage, TestItem } from '@/types/test-coverage'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useModuleCoverage(appId: string) {
  return useQuery<ModuleCoverage[]>({
    queryKey: ['test-coverage', appId],
    queryFn: () => fetchJson(`/api/apps/${appId}/test-coverage`),
    enabled: !!appId,
  })
}

export function useFeatureCoverage(appId: string, moduleId: string) {
  return useQuery<FeatureCoverage[]>({
    queryKey: ['feature-coverage', appId, moduleId],
    queryFn: () => fetchJson(`/api/apps/${appId}/test-coverage/modules/${moduleId}`),
    enabled: !!appId && !!moduleId,
  })
}

export function useFeatureTestItems(appId: string, featureId: string) {
  return useQuery<TestItem[]>({
    queryKey: ['feature-test-items', appId, featureId],
    queryFn: () => fetchJson(`/api/apps/${appId}/test-coverage/features/${featureId}`),
    enabled: !!appId && !!featureId,
  })
}
