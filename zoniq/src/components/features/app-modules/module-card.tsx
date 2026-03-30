'use client'

import type { Module } from '@/types/module'

interface ModuleCardProps {
  module: Module
  onEdit: (module: Module) => void
  onDelete: (module: Module) => void
}

export function ModuleCard({ module, onEdit, onDelete }: ModuleCardProps) {
  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-[#F5F2EF] p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#2D1810]">{module.name}</h3>
          {module.description && (
            <p className="mt-1 line-clamp-2 text-sm text-[#9A948D]">{module.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#9A948D]">
          {module.featuresCount} feature{module.featuresCount !== 1 ? 's' : ''}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(module)}
            className="rounded-lg border border-[#E8E4E0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(module)}
            className="rounded-lg border border-[#E8E4E0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#DC2626] transition-colors hover:border-[#DC2626] hover:bg-[#FEF2F2]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
