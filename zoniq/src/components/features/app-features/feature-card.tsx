'use client'

import type { Feature } from '@/types/feature'

interface FeatureCardProps {
  feature: Feature
  onEdit: (feature: Feature) => void
  onDelete: (feature: Feature) => void
  onClick: (feature: Feature) => void
}

export function FeatureCard({ feature, onEdit, onDelete, onClick }: FeatureCardProps) {
  return (
    <div
      className="cursor-pointer rounded-xl border border-[#E8E4E0] bg-[#F5F2EF] p-5 transition-shadow hover:shadow-md"
      onClick={() => onClick(feature)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(feature)
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#2D1810]">{feature.name}</h3>
          {feature.description && (
            <p className="mt-1 line-clamp-2 text-sm text-[#9A948D]">{feature.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#9A948D]">
          {feature.linkedStoriesCount} {feature.linkedStoriesCount === 1 ? 'story' : 'stories'}
        </span>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(feature)}
            className="rounded-lg border border-[#E8E4E0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(feature)}
            className="rounded-lg border border-[#E8E4E0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#DC2626] transition-colors hover:border-[#DC2626] hover:bg-[#FEF2F2]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
