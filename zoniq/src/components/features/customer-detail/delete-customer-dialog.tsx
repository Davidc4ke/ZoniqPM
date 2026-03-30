'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useDeleteCustomer } from '@/hooks/use-customers'
import type { Customer } from '@/types/customer'

interface DeleteCustomerDialogProps {
  customer: Customer
  isOpen: boolean
  onClose: () => void
}

export function DeleteCustomerDialog({ customer, isOpen, onClose }: DeleteCustomerDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const deleteCustomer = useDeleteCustomer()
  const router = useRouter()
  const hasLinkedApps = customer.linkedAppsCount > 0

  const handleClose = useCallback(() => {
    if (!deleteCustomer.isPending) {
      setError(null)
      onClose()
    }
  }, [deleteCustomer.isPending, onClose])

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
    deleteCustomer.mutate(customer.id, {
      onSuccess: () => {
        onClose()
        toast.success('Customer deleted', {
          description: `${customer.name} has been removed`,
        })
        router.push('/masterdata')
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
      aria-labelledby="delete-customer-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="delete-customer-title" className="mb-2 text-xl font-bold text-[#2D1810]">
          Delete Customer
        </h2>

        {hasLinkedApps ? (
          <>
            <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#DC2626]">
              Cannot delete <strong>{customer.name}</strong> because it has{' '}
              {customer.linkedAppsCount} linked app{customer.linkedAppsCount !== 1 ? 's' : ''}.
              Remove all apps first.
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
              Are you sure you want to delete <strong className="text-[#2D1810]">{customer.name}</strong>?
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
                disabled={deleteCustomer.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteCustomer.isPending}
                className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#B91C1C] disabled:opacity-50"
              >
                {deleteCustomer.isPending ? 'Deleting...' : 'Delete Customer'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
