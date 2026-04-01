'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useCreateContextItem } from '@/hooks/use-context-items'
import { ContextForm } from './context-form'
import type { ContextItemType } from '@/types/context-item'

interface ContextDialogProps {
  appId: string
  isOpen: boolean
  onClose: () => void
}

export function ContextDialog({ appId, isOpen, onClose }: ContextDialogProps) {
  const createMutation = useCreateContextItem(appId)
  const isPending = createMutation.isPending

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

  const handleSubmit = (data: { name: string; type: ContextItemType; content: string }) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        onClose()
        toast.success('Context added', {
          description: `${data.name} has been added successfully`,
        })
      },
      onError: (err) => {
        toast.error('Failed to add context', { description: err.message })
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ctx-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="ctx-dialog-title" className="mb-4 text-xl font-bold text-[#2D1810]">
          Add Context
        </h2>
        <ContextForm
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isPending={isPending}
        />
      </div>
    </div>
  )
}
