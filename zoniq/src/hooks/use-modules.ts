import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Module, CreateModuleInput, UpdateModuleInput } from '@/types/module'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useModules(appId: string) {
  return useQuery<Module[]>({
    queryKey: ['modules', appId],
    queryFn: () => fetchJson(`/api/apps/${appId}/modules`),
    enabled: !!appId,
  })
}

export function useCreateModule(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateModuleInput) => {
      const response = await fetch(`/api/apps/${appId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to create module')
      }
      const json = await response.json()
      return json.data as Module
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', appId] })
    },
  })
}

export function useUpdateModule(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ moduleId, input }: { moduleId: string; input: UpdateModuleInput }) => {
      const response = await fetch(`/api/apps/${appId}/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to update module')
      }
      const json = await response.json()
      return json.data as Module
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', appId] })
    },
  })
}

export function useDeleteModule(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (moduleId: string) => {
      const response = await fetch(`/api/apps/${appId}/modules/${moduleId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to delete module')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', appId] })
    },
  })
}
