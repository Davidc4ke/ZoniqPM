import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Environment, CreateEnvironmentInput, UpdateEnvironmentInput } from '@/types/environment'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useEnvironments(appId: string) {
  return useQuery<Environment[]>({
    queryKey: ['environments', appId],
    queryFn: () => fetchJson(`/api/apps/${appId}/environments`),
    enabled: !!appId,
  })
}

export function useCreateEnvironment(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateEnvironmentInput) => {
      const response = await fetch(`/api/apps/${appId}/environments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to create environment')
      }
      const json = await response.json()
      return json.data as Environment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments', appId] })
    },
  })
}

export function useUpdateEnvironment(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ envId, input }: { envId: string; input: UpdateEnvironmentInput }) => {
      const response = await fetch(`/api/apps/${appId}/environments/${envId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to update environment')
      }
      const json = await response.json()
      return json.data as Environment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments', appId] })
    },
  })
}

export function useDeleteEnvironment(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (envId: string) => {
      const response = await fetch(`/api/apps/${appId}/environments/${envId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to delete environment')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments', appId] })
    },
  })
}
