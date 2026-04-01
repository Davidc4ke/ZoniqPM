import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ContextItem, CreateContextItemInput } from '@/types/app-context'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useAppContext(appId: string) {
  return useQuery<ContextItem[]>({
    queryKey: ['app-context', appId],
    queryFn: () => fetchJson(`/api/apps/${appId}/context`),
    enabled: !!appId,
  })
}

export function useCreateContextItem(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateContextItemInput) => {
      const response = await fetch(`/api/apps/${appId}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to create context item')
      }
      const json = await response.json()
      return json.data as ContextItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-context', appId] })
    },
  })
}
