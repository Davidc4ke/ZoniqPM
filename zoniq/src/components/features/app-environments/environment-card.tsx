'use client'

import type { Environment } from '@/types/environment'
import { formatDistanceToNow } from 'date-fns'

const statusConfig: Record<Environment['status'], { color: string; bg: string; label: string; pulse: boolean }> = {
  online: { color: '#10B981', bg: 'bg-[#ECFDF5]', label: 'Online', pulse: false },
  offline: { color: '#EF4444', bg: 'bg-[#FEF2F2]', label: 'Offline', pulse: true },
  deploying: { color: '#F59E0B', bg: 'bg-[#FFFBEB]', label: 'Deploying', pulse: true },
}

interface EnvironmentCardProps {
  environment: Environment
  onEdit: (env: Environment) => void
  onDelete: (env: Environment) => void
}

export function EnvironmentCard({ environment, onEdit, onDelete }: EnvironmentCardProps) {
  const config = statusConfig[environment.status]
  const lastPingText = (() => {
    try {
      return formatDistanceToNow(new Date(environment.lastPing), { addSuffix: true })
    } catch {
      return environment.lastPing
    }
  })()

  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header with status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${config.pulse ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: config.color }}
            data-testid={`status-dot-${environment.status}`}
          />
          <h3 className="text-sm font-semibold text-[#2D1810]">{environment.name}</h3>
        </div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.bg}`}
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-[#9A948D]">URL</p>
          <p className="truncate text-sm text-[#2D1810]">{environment.url}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#9A948D]">Version</p>
            <p className="text-sm font-mono text-[#2D1810]">{environment.version}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-[#9A948D]">Last Ping</p>
            <p className="text-sm text-[#2D1810]">{lastPingText}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-[#E8E4E0] pt-3">
        <button
          onClick={() => onEdit(environment)}
          className="flex-1 rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#2D1810] transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(environment)}
          className="flex-1 rounded-lg border border-[#E8E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#DC2626] transition-colors hover:border-[#DC2626] hover:bg-[#FEF2F2]"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
