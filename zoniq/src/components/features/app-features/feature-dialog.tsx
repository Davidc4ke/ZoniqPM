'use client'

import { useEffect } from 'react'
import { useCreateFeature, useUpdateFeature } from '@/hooks/use-features'
import { FeatureForm } from './feature-form'
import type { Feature, CreateFeatureInput } from '@/types/feature'

interface FeatureDialogProps {
  appId: string
  moduleId: string
  isOpen: boolean
  onClose: () => void
  feature?: Feature | null
}

export function FeatureDialog({ appId, moduleId, isOpen, onClose, feature }: FeatureDialogProps) {
  const createMutation = useCreateFeature(appId, moduleId)
  const updateMutation = useUpdateFeature(appId, moduleId)

  const isEditing = !!feature
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(data: CreateFeatureInput) {
    if (isEditing && feature) {
      updateMutation.mutate(
        { featureId: feature.id, input: data },
        { onSuccess: () => onClose() }
      )
    } else {
      createMutation.mutate(data, { onSuccess: () => onClose() })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[480px] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D1810]">
            {isEditing ? 'Edit Feature' : 'Add Feature'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <FeatureForm
          defaultValues={feature ? { name: feature.name, description: feature.description ?? '' } : undefined}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={isEditing ? 'Save Changes' : 'Create Feature'}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
