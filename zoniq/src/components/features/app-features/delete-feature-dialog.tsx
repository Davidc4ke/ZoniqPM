'use client'

import { useEffect } from 'react'
import { useDeleteFeature } from '@/hooks/use-features'
import type { Feature } from '@/types/feature'

interface DeleteFeatureDialogProps {
  appId: string
  moduleId: string
  feature: Feature | null
  isOpen: boolean
  onClose: () => void
}

export function DeleteFeatureDialog({ appId, moduleId, feature, isOpen, onClose }: DeleteFeatureDialogProps) {
  const deleteMutation = useDeleteFeature(appId, moduleId)

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !feature) return null

  function handleDelete() {
    if (!feature) return
    deleteMutation.mutate(feature.id, { onSuccess: () => onClose() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[480px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#2D1810]">Delete Feature</h2>
        <p className="mt-2 text-sm text-[#9A948D]">
          Are you sure you want to delete <strong className="text-[#2D1810]">{feature.name}</strong>?
          This action cannot be undone.
        </p>
        {feature.linkedStoriesCount > 0 && (
          <p className="mt-2 text-sm text-[#DC2626]">
            This feature has {feature.linkedStoriesCount} linked {feature.linkedStoriesCount === 1 ? 'story' : 'stories'} and cannot be deleted.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#2D1810] px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#F5F2EF]"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending || feature.linkedStoriesCount > 0}
            className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#DC2626] disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Feature'}
          </button>
        </div>
      </div>
    </div>
  )
}
