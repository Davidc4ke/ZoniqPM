'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useCreateCustomer } from '@/hooks/use-customers'

interface AddCustomerDialogProps {
  onCustomerAdded?: () => void
}

export function AddCustomerDialog({ onCustomerAdded }: AddCustomerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createCustomer = useCreateCustomer()

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError(null)
    setName('')
    setDescription('')
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !createCustomer.isPending) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, createCustomer.isPending, handleClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    createCustomer.mutate(
      { name, description: description || undefined },
      {
        onSuccess: () => {
          handleClose()
          toast.success('Customer created', {
            description: `${name} has been added successfully`,
          })
          onCustomerAdded?.()
        },
        onError: (err) => {
          setError(err.message)
        },
      }
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#E55A2B] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#FF6B35] focus-visible:outline-offset-2"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Customer
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-customer-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="add-customer-title" className="mb-4 text-xl font-bold text-[#2D1810]">
          Add New Customer
        </h2>

        {error && (
          <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
                Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                id="customer-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Customer name"
              />
            </div>

            <div>
              <label htmlFor="customer-description" className="mb-1.5 block text-sm font-medium text-[#2D1810]">
                Description
              </label>
              <textarea
                id="customer-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] transition-colors focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Brief description of the customer"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35] disabled:opacity-50"
              disabled={createCustomer.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCustomer.isPending || !name.trim()}
              className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e55a2b] hover:shadow-md hover:shadow-[#FF6B35]/30 disabled:opacity-50"
            >
              {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
