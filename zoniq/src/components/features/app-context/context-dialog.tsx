'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useCreateContextItem, useUpdateContextItem } from '@/hooks/use-context-items'
import { ContextForm } from './context-form'
import type { ContextItem, ContextItemType } from '@/types/context-item'

interface ContextDialogProps {
  appId: string
  isOpen: boolean
  onClose: () => void
  contextItem?: ContextItem | null
}

export function ContextDialog({ appId, isOpen, onClose, contextItem }: ContextDialogProps) {
  const createMutation = useCreateContextItem(appId)
  const updateMutation = useUpdateContextItem(appId)
  const isEdit = !!contextItem
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

  const handleSubmit = (data: { type: ContextItemType; title: string; content: string; url: string }) => {
    const payload = {
      type: data.type,
      title: data.title,
      content: data.content,
      url: data.url || undefined,
    }

    if (isEdit && contextItem) {
      updateMutation.mutate(
        { contextId: contextItem.id, input: payload },
        {
          onSuccess: () => {
            onClose()
            toast.success('Context item updated', {
              description: `${data.title} has been updated successfully`,
            })
          },
          onError: (err) => {
            toast.error('Failed to update context item', { description: err.message })
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onClose()
          toast.success('Context item created', {
            description: `${data.title} has been added successfully`,
          })
        },
        onError: (err) => {
          toast.error('Failed to create context item', { description: err.message })
        },
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ctx-dialog-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="ctx-dialog-title" className="mb-4 text-xl font-bold text-[#2D1810]">
          {isEdit ? 'Edit Context Item' : 'Add Context'}
        </h2>
        <ContextForm
          initialType={contextItem?.type}
          initialTitle={contextItem?.title}
          initialContent={contextItem?.content}
          initialUrl={contextItem?.url}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isPending={isPending}
          submitLabel={isEdit ? 'Save Changes' : 'Add Context'}
        />
      </div>
    </div>
  )
}
