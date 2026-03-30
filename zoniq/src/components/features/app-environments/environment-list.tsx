'use client'

import type { Environment } from '@/types/environment'
import { EnvironmentCard } from './environment-card'

interface EnvironmentListProps {
  environments: Environment[]
  onEdit: (env: Environment) => void
  onDelete: (env: Environment) => void
}

export function EnvironmentList({ environments, onEdit, onDelete }: EnvironmentListProps) {
  if (environments.length === 0) {
    return (
      <div className="rounded-xl border border-[#E8E4E0] bg-[#F9FAFB] p-8 text-center">
        <p className="text-sm text-[#9A948D]">No environments configured</p>
        <p className="mt-1 text-xs text-[#9A948D]">Add your first environment to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {environments.map((env) => (
        <EnvironmentCard key={env.id} environment={env} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
