'use client'

import { useState } from 'react'
import { useWorkflows, useWorkflowDetail, useNodeDetail } from '@/hooks/use-workflows'
import { WorkflowList } from './workflow-list'
import { WorkflowDiagram } from './workflow-diagram'
import { NodeDetailPanel } from './node-detail-panel'

interface AppWorkflowsProps {
  appId: string
}

function WorkflowsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-24 rounded-xl bg-[#E8E4E0]" />
      <div className="h-24 rounded-xl bg-[#E8E4E0]" />
      <div className="h-24 rounded-xl bg-[#E8E4E0]" />
    </div>
  )
}

export function AppWorkflows({ appId }: AppWorkflowsProps) {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('')
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')

  const { data: workflows, isLoading, isError, error } = useWorkflows(appId)
  const { data: workflowDetail } = useWorkflowDetail(appId, selectedWorkflowId)
  const { data: nodeDetail, isLoading: nodeLoading } = useNodeDetail(appId, selectedWorkflowId, selectedNodeId)

  if (isLoading) return <WorkflowsSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load workflows'}
      </div>
    )
  }

  if (!workflows || workflows.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8E4E0]">
          <svg className="h-8 w-8 text-[#9A948D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <p className="text-sm text-[#9A948D]">No workflows available for this app</p>
      </div>
    )
  }

  // Workflow list view
  if (!selectedWorkflowId) {
    return (
      <div>
        <h2 className="mb-4 text-sm font-semibold text-[#2D1810]">
          Workflows ({workflows.length})
        </h2>
        <WorkflowList workflows={workflows} onSelect={setSelectedWorkflowId} />
      </div>
    )
  }

  // Diagram view
  const currentWorkflow = workflows.find((w) => w.id === selectedWorkflowId)

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => {
            setSelectedWorkflowId('')
            setSelectedNodeId('')
          }}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to workflows
        </button>
        {currentWorkflow && (
          <h2 className="text-sm font-semibold text-[#2D1810]">{currentWorkflow.name}</h2>
        )}
      </div>

      <div className="flex">
        <div className="flex-1">
          {workflowDetail ? (
            <WorkflowDiagram
              nodes={workflowDetail.nodes}
              edges={workflowDetail.edges}
              onNodeClick={setSelectedNodeId}
            />
          ) : (
            <div className="animate-pulse h-[500px] rounded-xl bg-[#E8E4E0]" />
          )}
        </div>

        {selectedNodeId && nodeDetail && (
          <NodeDetailPanel
            nodeDetail={nodeDetail}
            isLoading={nodeLoading}
            onClose={() => setSelectedNodeId('')}
          />
        )}
      </div>
    </div>
  )
}
