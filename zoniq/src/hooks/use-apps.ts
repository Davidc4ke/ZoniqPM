import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { App, CreateAppInput, UpdateAppInput } from '@/types/app'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useApps(customerId?: string) {
  const url = customerId ? `/api/apps?customerId=${customerId}` : '/api/apps'
  return useQuery<App[]>({
    queryKey: customerId ? ['apps', { customerId }] : ['apps'],
    queryFn: () => fetchJson(url),
  })
}

export function useApp(id: string) {
  return useQuery<App>({
    queryKey: ['apps', id],
    queryFn: () => fetchJson(`/api/apps/${id}`),
    enabled: !!id,
  })
}

export function useCreateApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateAppInput) => {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to create app')
      }
      const json = await response.json()
      return json.data as App
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateApp(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateAppInput) => {
      const response = await fetch(`/api/apps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to update app')
      }
      const json = await response.json()
      return json.data as App
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      queryClient.invalidateQueries({ queryKey: ['apps', id] })
    },
  })
}

export function useDeleteApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/apps/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error?.message || 'Failed to delete app')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
