'use client'

import { useState } from 'react'
import { useModules } from '@/hooks/use-modules'
import { ModuleCard } from './module-card'
import { ModuleDialog } from './module-dialog'
import { DeleteModuleDialog } from './delete-module-dialog'
import { GenerateModulesPanel } from './generate-modules-panel'
import { AppFeatures } from '../app-features/app-features'
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
  appName?: string
  appDescription?: string
}

export function AppModules({ appId, appName = '', appDescription = '' }: AppModulesProps) {
  const { data: modules, isLoading, isError, error } = useModules(appId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showGeneratePanel, setShowGeneratePanel] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [deletingModule, setDeletingModule] = useState<Module | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  if (isLoading) return <ModulesSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load modules'}
      </div>
    )
  }

  if (selectedModule) {
    return (
      <AppFeatures
        appId={appId}
        moduleId={selectedModule.id}
        moduleName={selectedModule.name}
        onBack={() => setSelectedModule(null)}
      />
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2D1810]">Modules</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGeneratePanel(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF6B35] px-3 py-2 text-sm font-medium text-[#FF6B35] transition-colors hover:bg-[#FFF7ED]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Generate Modules
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="rounded-lg bg-[#FF6B35] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B]"
          >
            Add Module
          </button>
        </div>
      </div>

      {modules && modules.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              onEdit={(m) => setEditingModule(m)}
              onDelete={(m) => setDeletingModule(m)}
              onClick={(m) => setSelectedModule(m)}
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

      <GenerateModulesPanel
        appId={appId}
        appName={appName}
        appDescription={appDescription}
        existingModuleNames={modules?.map((m) => m.name) ?? []}
        isOpen={showGeneratePanel}
        onClose={() => setShowGeneratePanel(false)}
      />
    </div>
  )
}
