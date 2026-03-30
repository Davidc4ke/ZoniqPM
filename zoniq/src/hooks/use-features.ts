import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Feature, CreateFeatureInput, UpdateFeatureInput } from '@/types/feature'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useFeatures(appId: string, moduleId: string) {
  return useQuery<Feature[]>({
    queryKey: ['features', moduleId],
    queryFn: () => fetchJson(`/api/apps/${appId}/modules/${moduleId}/features`),
    enabled: !!moduleId,
  })
}

export function useCreateFeature(appId: string, moduleId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateFeatureInput) => {
      const response = await fetch(`/api/apps/${appId}/modules/${moduleId}/features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to create feature')
      }
      const json = await response.json()
      return json.data as Feature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', moduleId] })
    },
  })
}

export function useUpdateFeature(appId: string, moduleId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ featureId, input }: { featureId: string; input: UpdateFeatureInput }) => {
      const response = await fetch(`/api/apps/${appId}/modules/${moduleId}/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to update feature')
      }
      const json = await response.json()
      return json.data as Feature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', moduleId] })
    },
  })
}

export function useDeleteFeature(appId: string, moduleId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (featureId: string) => {
      const response = await fetch(`/api/apps/${appId}/modules/${moduleId}/features/${featureId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to delete feature')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', moduleId] })
    },
  })
}
