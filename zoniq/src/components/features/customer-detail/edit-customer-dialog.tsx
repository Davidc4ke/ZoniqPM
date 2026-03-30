'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useUpdateCustomer } from '@/hooks/use-customers'
import type { Customer } from '@/types/customer'

interface EditCustomerDialogProps {
  customer: Customer
  isOpen: boolean
  onClose: () => void
}

function EditCustomerForm({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [name, setName] = useState(customer.name)
  const [description, setDescription] = useState(customer.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const updateCustomer = useUpdateCustomer(customer.id)

  const handleClose = useCallback(() => {
    if (!updateCustomer.isPending) onClose()
  }, [updateCustomer.isPending, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    updateCustomer.mutate(
      { name, description: description || null },
      {
        onSuccess: () => {
          onClose()
          toast.success('Customer updated', {
            description: `${name} has been updated successfully`,
          })
        },
        onError: (err) => {
          setError(err.message)
        },
      }
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-customer-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="edit-customer-title" className="mb-4 text-xl font-bold text-[#2D1810]">
          Edit Customer
        </h2>

        {error && (
          <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
                Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
                Description
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35] disabled:opacity-50"
              disabled={updateCustomer.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateCustomer.isPending || !name.trim()}
              className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e55a2b] hover:shadow-md hover:shadow-[#FF6B35]/30 disabled:opacity-50"
            >
              {updateCustomer.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditCustomerDialog({ customer, isOpen, onClose }: EditCustomerDialogProps) {
  if (!isOpen) return null
  return <EditCustomerForm key={customer.id} customer={customer} onClose={onClose} />
}
