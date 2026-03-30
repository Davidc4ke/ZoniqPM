import { useQuery } from '@tanstack/react-query'
import type { Workflow, WorkflowDetail, WorkflowNodeDetail } from '@/types/workflow'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Failed to fetch ${url}: ${response.status}`)
  }
  const json = await response.json()
  return json.data as T
}

export function useWorkflows(appId: string) {
  return useQuery<Workflow[]>({
    queryKey: ['workflows', appId],
    queryFn: () => fetchJson(`/api/apps/${appId}/workflows`),
    enabled: !!appId,
  })
}

export function useWorkflowDetail(appId: string, workflowId: string) {
  return useQuery<WorkflowDetail>({
    queryKey: ['workflow-detail', appId, workflowId],
    queryFn: () => fetchJson(`/api/apps/${appId}/workflows/${workflowId}`),
    enabled: !!appId && !!workflowId,
  })
}

export function useNodeDetail(appId: string, workflowId: string, nodeId: string) {
  return useQuery<WorkflowNodeDetail>({
    queryKey: ['node-detail', appId, workflowId, nodeId],
    queryFn: () => fetchJson(`/api/apps/${appId}/workflows/${workflowId}/nodes/${nodeId}`),
    enabled: !!appId && !!workflowId && !!nodeId,
  })
}
