'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useDeleteContextItem } from '@/hooks/use-context-items'
import type { ContextItem } from '@/types/context-item'

interface DeleteContextDialogProps {
  appId: string
  contextItem: ContextItem | null
  isOpen: boolean
  onClose: () => void
}

export function DeleteContextDialog({ appId, contextItem, isOpen, onClose }: DeleteContextDialogProps) {
  const deleteMutation = useDeleteContextItem(appId)

  const handleClose = useCallback(() => {
    if (!deleteMutation.isPending) onClose()
  }, [deleteMutation.isPending, onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen || !contextItem) return null

  const handleDelete = () => {
    deleteMutation.mutate(contextItem.id, {
      onSuccess: () => {
        onClose()
        toast.success('Context item deleted', {
          description: `${contextItem.title} has been removed`,
        })
      },
      onError: (err) => {
        toast.error('Failed to delete context item', { description: err.message })
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-ctx-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="delete-ctx-title" className="mb-2 text-xl font-bold text-[#2D1810]">
          Delete Context Item
        </h2>
        <p className="mb-6 text-sm text-[#9A948D]">
          Are you sure you want to delete <strong className="text-[#2D1810]">{contextItem.title}</strong>?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35] disabled:opacity-50"
            disabled={deleteMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#B91C1C] disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
