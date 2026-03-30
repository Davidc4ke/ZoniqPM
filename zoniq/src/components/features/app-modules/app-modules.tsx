'use client'

import { useState } from 'react'
import { useModules } from '@/hooks/use-modules'
import { ModuleCard } from './module-card'
import { ModuleDialog } from './module-dialog'
import { DeleteModuleDialog } from './delete-module-dialog'
import type { Module } from '@/types/module'

function ModulesSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 rounded-xl bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

interface AppModulesProps {
  appId: string
}

export function AppModules({ appId }: AppModulesProps) {
  const { data: modules, isLoading, isError, error } = useModules(appId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [deletingModule, setDeletingModule] = useState<Module | null>(null)

  if (isLoading) return <ModulesSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load modules'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2D1810]">Modules</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="rounded-lg bg-[#FF6B35] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B]"
        >
          Add Module
        </button>
      </div>

      {modules && modules.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              onEdit={(m) => setEditingModule(m)}
              onDelete={(m) => setDeletingModule(m)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E8E4E0] bg-[#F5F2EF] py-12 text-center">
          <p className="text-sm text-[#9A948D]">No modules yet</p>
          <p className="mt-1 text-xs text-[#9A948D]">Add a module to organize app functionality</p>
        </div>
      )}

      <ModuleDialog
        appId={appId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      <ModuleDialog
        appId={appId}
        isOpen={!!editingModule}
        onClose={() => setEditingModule(null)}
        module={editingModule}
      />

      <DeleteModuleDialog
        appId={appId}
        module={deletingModule}
        isOpen={!!deletingModule}
        onClose={() => setDeletingModule(null)}
      />
    </div>
  )
}
