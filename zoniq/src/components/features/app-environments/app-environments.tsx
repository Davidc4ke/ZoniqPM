'use client'

import { useState } from 'react'
import { useEnvironments } from '@/hooks/use-environments'
import { EnvironmentList } from './environment-list'
import { EnvironmentDialog } from './environment-dialog'
import { DeleteEnvironmentDialog } from './delete-environment-dialog'
import type { Environment } from '@/types/environment'

function EnvironmentsSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-48 rounded-xl bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

interface AppEnvironmentsProps {
  appId: string
}

export function AppEnvironments({ appId }: AppEnvironmentsProps) {
  const { data: environments, isLoading, isError, error } = useEnvironments(appId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null)
  const [deletingEnv, setDeletingEnv] = useState<Environment | null>(null)

  if (isLoading) return <EnvironmentsSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load environments'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2D1810]">Environments</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
        >
          Add Environment
        </button>
      </div>

      <EnvironmentList
        environments={environments ?? []}
        onEdit={(env) => setEditingEnv(env)}
        onDelete={(env) => setDeletingEnv(env)}
      />

      <EnvironmentDialog
        appId={appId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      <EnvironmentDialog
        appId={appId}
        isOpen={!!editingEnv}
        onClose={() => setEditingEnv(null)}
        environment={editingEnv}
      />

      <DeleteEnvironmentDialog
        appId={appId}
        environment={deletingEnv}
        isOpen={!!deletingEnv}
        onClose={() => setDeletingEnv(null)}
      />
    </div>
  )
}
