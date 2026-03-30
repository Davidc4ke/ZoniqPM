import { useQuery } from '@tanstack/react-query'
import type {
  AssignedStory,
  ReviewStory,
  ProjectSummary,
  AppSummary,
  TeamActivity,
} from '@/types/dashboard'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useAssignedStories() {
  return useQuery<AssignedStory[]>({
    queryKey: ['dashboard', 'assigned-stories'],
    queryFn: () => fetchJson('/api/dashboard/assigned-stories'),
  })
}

export function useReviewQueue() {
  return useQuery<{ data: ReviewStory[]; meta: { total: number } }>({
    queryKey: ['dashboard', 'review-queue'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/review-queue')
      if (!response.ok) throw new Error('Failed to fetch review queue')
      return response.json()
    },
  })
}

export function useProjects() {
  return useQuery<ProjectSummary[]>({
    queryKey: ['dashboard', 'projects'],
    queryFn: () => fetchJson('/api/dashboard/projects'),
  })
}

export function useApps() {
  return useQuery<AppSummary[]>({
    queryKey: ['dashboard', 'apps'],
    queryFn: () => fetchJson('/api/dashboard/apps'),
  })
}

export function useTeamActivity() {
  return useQuery<TeamActivity[]>({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => fetchJson('/api/dashboard/activity'),
  })
}
