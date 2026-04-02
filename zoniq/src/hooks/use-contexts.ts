import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ContextItem, CreateContextInput, UpdateContextInput } from '@/types/context'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useContexts(appId: string) {
  return useQuery<ContextItem[]>({
    queryKey: ['contexts', appId],
    queryFn: () => fetchJson(`/api/apps/${appId}/context`),
    enabled: !!appId,
  })
}

export function useCreateContext(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateContextInput) => {
      const response = await fetch(`/api/apps/${appId}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to create context')
      }
      const json = await response.json()
      return json.data as ContextItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts', appId] })
    },
  })
}

export function useUpdateContext(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ contextId, input }: { contextId: string; input: UpdateContextInput }) => {
      const response = await fetch(`/api/apps/${appId}/context/${contextId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to update context')
      }
      const json = await response.json()
      return json.data as ContextItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts', appId] })
    },
  })
}

export function useDeleteContext(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (contextId: string) => {
      const response = await fetch(`/api/apps/${appId}/context/${contextId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to delete context')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts', appId] })
    },
  })
}
