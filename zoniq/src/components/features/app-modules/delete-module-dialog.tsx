'use client'

import { useEffect } from 'react'
import { useDeleteModule } from '@/hooks/use-modules'
import type { Module } from '@/types/module'

interface DeleteModuleDialogProps {
  appId: string
  module: Module | null
  isOpen: boolean
  onClose: () => void
}

export function DeleteModuleDialog({ appId, module, isOpen, onClose }: DeleteModuleDialogProps) {
  const deleteMutation = useDeleteModule(appId)

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !module) return null

  function handleDelete() {
    if (!module) return
    deleteMutation.mutate(module.id, { onSuccess: () => onClose() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[480px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#2D1810]">Delete Module</h2>
        <p className="mt-2 text-sm text-[#9A948D]">
          Are you sure you want to delete <strong className="text-[#2D1810]">{module.name}</strong>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#2D1810] px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#F5F2EF]"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#DC2626] disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Module'}
          </button>
        </div>
      </div>
    </div>
  )
}
