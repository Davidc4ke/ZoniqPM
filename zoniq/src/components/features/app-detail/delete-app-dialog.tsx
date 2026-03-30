'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useDeleteApp } from '@/hooks/use-apps'
import type { App } from '@/types/app'

interface DeleteAppDialogProps {
  app: App
  isOpen: boolean
  onClose: () => void
}

export function DeleteAppDialog({ app, isOpen, onClose }: DeleteAppDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const deleteApp = useDeleteApp()
  const router = useRouter()
  const hasLinkedProjects = app.linkedProjectsCount > 0

  const handleClose = useCallback(() => {
    if (!deleteApp.isPending) {
      setError(null)
      onClose()
    }
  }, [deleteApp.isPending, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const handleDelete = () => {
    setError(null)
    deleteApp.mutate(app.id, {
      onSuccess: () => {
        onClose()
        toast.success('App deleted', {
          description: `${app.name} has been removed`,
        })
        router.push(`/masterdata/customers/${app.customerId}`)
      },
      onError: (err) => {
        setError(err.message)
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-app-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="delete-app-title" className="mb-2 text-xl font-bold text-[#2D1810]">
          Delete App
        </h2>

        {hasLinkedProjects ? (
          <>
            <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#DC2626]">
              Cannot delete <strong>{app.name}</strong> because it has{' '}
              {app.linkedProjectsCount} linked project{app.linkedProjectsCount !== 1 ? 's' : ''}.
              Remove all projects first.
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35]"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-[#9A948D]">
              Are you sure you want to delete <strong className="text-[#2D1810]">{app.name}</strong>?
              This action cannot be undone.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#DC2626]">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35] disabled:opacity-50"
                disabled={deleteApp.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteApp.isPending}
                className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#B91C1C] disabled:opacity-50"
              >
                {deleteApp.isPending ? 'Deleting...' : 'Delete App'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
