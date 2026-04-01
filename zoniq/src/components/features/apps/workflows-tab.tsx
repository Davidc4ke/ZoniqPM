'use client'

import { useState, useEffect, useCallback } from 'react'
import { WorkflowDiagram } from './workflow-diagram'
import { NodeDetailsPanel } from './node-details-panel'
import type { Workflow } from '@/app/api/apps/[id]/workflows/route'
import type { WorkflowNode } from '@/app/api/apps/[id]/workflows/route'

interface WorkflowsTabProps {
  appId: string
}

export function WorkflowsTab({ appId }: WorkflowsTabProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch(`/api/apps/${appId}/workflows`)
        if (res.ok) {
          const data: Workflow[] = await res.json()
          setWorkflows(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchWorkflows()
  }, [appId])

  const handleWorkflowClick = useCallback((workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setSelectedNode(null)
  }, [])

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (!selectedWorkflow) return
      const node = selectedWorkflow.nodes.find((n) => n.id === nodeId)
      if (node) setSelectedNode(node)
    },
    [selectedWorkflow]
  )

  const handleBackToList = useCallback(() => {
    setSelectedWorkflow(null)
    setSelectedNode(null)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6B35] border-t-transparent" />
      </div>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="rounded-xl border border-[#E5E2DD] bg-white p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        <h3 className="mt-4 text-base font-semibold text-[#2D1810]">No workflows yet</h3>
        <p className="mt-1 text-sm text-[#9A948D]">Workflows will appear here once defined for this app.</p>
      </div>
    )
  }

  // Workflow list view
  if (!selectedWorkflow) {
    return (
      <div className="space-y-3">
        {workflows.map((wf) => (
          <button
            key={wf.id}
            onClick={() => handleWorkflowClick(wf)}
            className="flex w-full items-center justify-between rounded-xl border border-[#E5E2DD] bg-white p-4 text-left transition-colors hover:border-[#FF6B35]/40 hover:bg-[#FFF7ED]"
          >
            <div>
              <h3 className="text-sm font-bold text-[#2D1810]">{wf.name}</h3>
              <p className="mt-0.5 text-xs text-[#9A948D]">{wf.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-xs font-medium text-[#2D1810]">
                  {wf.nodeCount} steps
                </span>
                <span className="block text-[11px] text-[#9A948D]">
                  Updated {wf.updatedAt}
                </span>
              </div>
              <svg className="h-5 w-5 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    )
  }

  // Workflow diagram view
  return (
    <div>
      <button
        onClick={handleBackToList}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-[#9A948D] hover:text-[#2D1810] transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to workflows
      </button>

      <div className="mb-4">
        <h3 className="text-base font-bold text-[#2D1810]">{selectedWorkflow.name}</h3>
        <p className="text-sm text-[#9A948D]">{selectedWorkflow.description}</p>
      </div>

      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <WorkflowDiagram
            nodes={selectedWorkflow.nodes}
            edges={selectedWorkflow.edges}
            onNodeClick={handleNodeClick}
          />
        </div>
        {selectedNode && (
          <NodeDetailsPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  )
}
