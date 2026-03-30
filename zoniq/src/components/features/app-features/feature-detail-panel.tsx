'use client'

import type { Feature, LinkedStory } from '@/types/feature'

interface FeatureDetailPanelProps {
  feature: Feature
  linkedStories: LinkedStory[]
  onClose: () => void
  onEdit: (feature: Feature) => void
}

const statusColors: Record<string, string> = {
  backlog: 'bg-[#F3F4F6] text-[#6B7280]',
  'in-progress': 'bg-[#DBEAFE] text-[#2563EB]',
  review: 'bg-[#FEF3C7] text-[#D97706]',
  done: 'bg-[#DCFCE7] text-[#16A34A]',
}

export function FeatureDetailPanel({ feature, linkedStories, onClose, onEdit }: FeatureDetailPanelProps) {
  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#2D1810]">{feature.name}</h3>
          {feature.description && (
            <p className="mt-1 text-sm text-[#9A948D]">{feature.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(feature)}
            className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-[#2D1810]">
          Linked Stories ({linkedStories.length})
        </h4>
        {linkedStories.length > 0 ? (
          <div className="mt-3 space-y-2">
            {linkedStories.map((story) => (
              <div
                key={story.id}
                className="flex items-center justify-between rounded-lg border border-[#E8E4E0] bg-[#F5F2EF] px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#2D1810]">{story.title}</p>
                  <p className="mt-0.5 text-xs text-[#9A948D]">{story.projectName}</p>
                </div>
                <span className={`ml-3 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[story.status] ?? 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                  {story.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#9A948D]">No stories linked to this feature yet.</p>
        )}
      </div>
    </div>
  )
}
