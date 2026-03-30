'use client'

import type { WorkflowNodeDetail } from '@/types/workflow'

const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: '#DCFCE7', text: '#16A34A' },
  'in-progress': { bg: '#FEF3C7', text: '#D97706' },
  pending: { bg: '#E8E4E0', text: '#9A948D' },
}

const storyStatusColors: Record<string, string> = {
  done: 'bg-[#DCFCE7] text-[#16A34A]',
  'in-progress': 'bg-[#FEF3C7] text-[#D97706]',
  backlog: 'bg-[#F3F4F6] text-[#6B7280]',
}

interface NodeDetailPanelProps {
  nodeDetail: WorkflowNodeDetail
  isLoading: boolean
  onClose: () => void
}

export function NodeDetailPanel({ nodeDetail, isLoading, onClose }: NodeDetailPanelProps) {
  if (isLoading) {
    return (
      <div className="w-80 border-l border-[#E8E4E0] bg-white p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 rounded bg-[#E8E4E0]" />
          <div className="h-4 w-full rounded bg-[#E8E4E0]" />
          <div className="h-4 w-3/4 rounded bg-[#E8E4E0]" />
        </div>
      </div>
    )
  }

  const colors = statusColors[nodeDetail.status] ?? statusColors.pending

  return (
    <div className="w-80 border-l border-[#E8E4E0] bg-white p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#2D1810]">Node Details</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
          aria-label="Close panel"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-[#2D1810]">{nodeDetail.label}</h4>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {nodeDetail.status}
          </span>
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Description</h5>
          <p className="mt-1 text-sm text-[#2D1810]">{nodeDetail.description}</p>
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">
            Linked Stories ({nodeDetail.linkedStories.length})
          </h5>
          {nodeDetail.linkedStories.length === 0 ? (
            <p className="mt-1 text-sm text-[#9A948D]">No linked stories</p>
          ) : (
            <div className="mt-2 space-y-2">
              {nodeDetail.linkedStories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between rounded-lg bg-[#F5F2EF] p-2.5"
                >
                  <span className="text-sm text-[#2D1810]">{story.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${storyStatusColors[story.status] ?? 'bg-[#F3F4F6] text-[#6B7280]'}`}
                  >
                    {story.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
