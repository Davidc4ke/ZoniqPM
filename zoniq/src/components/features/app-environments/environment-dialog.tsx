'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useCreateEnvironment, useUpdateEnvironment } from '@/hooks/use-environments'
import { EnvironmentForm } from './environment-form'
import type { Environment } from '@/types/environment'

interface EnvironmentDialogProps {
  appId: string
  isOpen: boolean
  onClose: () => void
  environment?: Environment | null
}

export function EnvironmentDialog({ appId, isOpen, onClose, environment }: EnvironmentDialogProps) {
  const createMutation = useCreateEnvironment(appId)
  const updateMutation = useUpdateEnvironment(appId)
  const isEdit = !!environment
  const isPending = createMutation.isPending || updateMutation.isPending

  const handleClose = useCallback(() => {
    if (!isPending) onClose()
  }, [isPending, onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const handleSubmit = (data: { name: string; url: string }) => {
    if (isEdit && environment) {
      updateMutation.mutate(
        { envId: environment.id, input: data },
        {
          onSuccess: () => {
            onClose()
            toast.success('Environment updated', {
              description: `${data.name} has been updated successfully`,
            })
          },
          onError: (err) => {
            toast.error('Failed to update environment', { description: err.message })
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose()
          toast.success('Environment created', {
            description: `${data.name} has been added successfully`,
          })
        },
        onError: (err) => {
          toast.error('Failed to create environment', { description: err.message })
        },
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="env-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="env-dialog-title" className="mb-4 text-xl font-bold text-[#2D1810]">
          {isEdit ? 'Edit Environment' : 'Add Environment'}
        </h2>
        <EnvironmentForm
          initialName={environment?.name}
          initialUrl={environment?.url}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isPending={isPending}
          submitLabel={isEdit ? 'Save Changes' : 'Add Environment'}
        />
      </div>
    </div>
  )
}
