'use client'

import type { WorkflowNode } from '@/app/api/apps/[id]/workflows/route'

const statusColors: Record<string, string> = {
  Done: 'bg-[#ECFDF5] text-[#065F46]',
  'In Progress': 'bg-[#EFF6FF] text-[#1E40AF]',
  Ready: 'bg-[#FFF7ED] text-[#92400E]',
  Draft: 'bg-[#F5F5F4] text-[#78716C]',
}

const nodeTypeLabels: Record<string, string> = {
  start: 'Start',
  action: 'Action',
  decision: 'Decision',
  end: 'End',
}

interface NodeDetailsPanelProps {
  node: WorkflowNode
  onClose: () => void
}

export function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  return (
    <div className="w-[360px] shrink-0 rounded-xl border border-[#E5E2DD] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block rounded-md bg-[#F5F5F4] px-2 py-0.5 text-[11px] font-medium text-[#78716C] uppercase tracking-wide">
            {nodeTypeLabels[node.type] || node.type}
          </span>
          <h3 className="mt-2 text-base font-bold text-[#2D1810]">{node.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-[#9A948D] hover:bg-[#F5F5F4] hover:text-[#2D1810] transition-colors"
          aria-label="Close panel"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#78716C]">{node.description}</p>

      {node.linkedStories.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-[#9A948D] uppercase tracking-wide">
            Linked Stories ({node.linkedStories.length})
          </h4>
          <div className="mt-2 space-y-2">
            {node.linkedStories.map((story) => (
              <div
                key={story.id}
                className="flex items-center justify-between rounded-lg bg-[#FAFAF9] p-3"
              >
                <div>
                  <span className="text-xs font-medium text-[#9A948D]">{story.id}</span>
                  <p className="text-sm font-medium text-[#2D1810]">{story.title}</p>
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[story.status] || statusColors.Draft}`}
                >
                  {story.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.linkedStories.length === 0 && (
        <div className="mt-5 rounded-lg bg-[#FAFAF9] p-4 text-center">
          <p className="text-sm text-[#9A948D]">No linked stories</p>
        </div>
      )}
    </div>
  )
}
