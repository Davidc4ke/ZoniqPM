'use client'

import type { Workflow } from '@/types/workflow'

const statusColors: Record<string, string> = {
  active: 'bg-[#DCFCE7] text-[#16A34A]',
  draft: 'bg-[#FEF3C7] text-[#D97706]',
  archived: 'bg-[#F3F4F6] text-[#6B7280]',
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  draft: 'Draft',
  archived: 'Archived',
}

interface WorkflowListProps {
  workflows: Workflow[]
  onSelect: (workflowId: string) => void
}

export function WorkflowList({ workflows, onSelect }: WorkflowListProps) {
  return (
    <div className="space-y-3">
      {workflows.map((wf) => (
        <button
          key={wf.id}
          onClick={() => onSelect(wf.id)}
          className="w-full rounded-xl border border-[#E8E4E0] bg-white p-4 text-left transition-colors hover:border-[#2563EB] hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#2D1810]">{wf.name}</h3>
              <p className="mt-1 text-xs text-[#9A948D]">{wf.description}</p>
            </div>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[wf.status] ?? ''}`}
            >
              {statusLabels[wf.status] ?? wf.status}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-[#9A948D]">
            <span>{wf.stepCount} steps</span>
          </div>
        </button>
      ))}
    </div>
  )
}
