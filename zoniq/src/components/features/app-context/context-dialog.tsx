'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useCreateContext, useUpdateContext } from '@/hooks/use-contexts'
import { ContextForm } from './context-form'
import type { ContextItem } from '@/types/context'

interface ContextDialogProps {
  appId: string
  isOpen: boolean
  onClose: () => void
  context?: ContextItem | null
}

export function ContextDialog({ appId, isOpen, onClose, context }: ContextDialogProps) {
  const createMutation = useCreateContext(appId)
  const updateMutation = useUpdateContext(appId)
  const isEdit = !!context
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

  const handleSubmit = (data: { name: string; type: 'note' | 'document' | 'url'; content: string }) => {
    if (isEdit && context) {
      updateMutation.mutate(
        { contextId: context.id, input: data },
        {
          onSuccess: () => {
            onClose()
            toast.success('Context updated', {
              description: `${data.name} has been updated successfully`,
            })
          },
          onError: (err) => {
            toast.error('Failed to update context', { description: err.message })
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose()
          toast.success('Context created', {
            description: `${data.name} has been added successfully`,
          })
        },
        onError: (err) => {
          toast.error('Failed to create context', { description: err.message })
        },
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="context-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="context-dialog-title" className="mb-4 text-xl font-bold text-[#2D1810]">
          {isEdit ? 'Edit Context' : 'Add Context'}
        </h2>
        <ContextForm
          initialName={context?.name}
          initialType={context?.type}
          initialContent={context?.content}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isPending={isPending}
          submitLabel={isEdit ? 'Save Changes' : 'Add Context'}
        />
      </div>
    </div>
  )
}
