'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCustomer } from '@/hooks/use-customers'
import { EditCustomerDialog } from './edit-customer-dialog'
import { DeleteCustomerDialog } from './delete-customer-dialog'
import { format } from 'date-fns'

interface CustomerDetailProps {
  customerId: string
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-[#E8E4E0]" />
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-[#E8E4E0]" />
          <div className="h-4 w-72 rounded bg-[#E8E4E0]" />
        </div>
      </div>
      <div className="h-32 rounded-xl bg-[#E8E4E0]" />
    </div>
  )
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const { data: customer, isLoading, isError, error } = useCustomer(customerId)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load customer'}
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="rounded-xl border border-[#E8E4E0] bg-white p-8 text-center">
        <p className="text-[#9A948D]">Customer not found</p>
        <Link href="/masterdata" className="mt-2 inline-block text-sm font-medium text-[#FF6B35] hover:underline">
          Back to customers
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/masterdata"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#9A948D] transition-colors hover:text-[#FF6B35]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to customers
      </Link>

      <div className="rounded-xl border border-[#E8E4E0] bg-white shadow-sm">
        <div className="border-b border-[#E8E4E0] bg-[#ECFDF5] p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#10B981] text-white text-xl font-bold">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2D1810]">{customer.name}</h1>
                {customer.description && (
                  <p className="mt-1 text-sm text-[#2D1810]/70">{customer.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm font-medium text-[#DC2626] transition-colors hover:border-[#DC2626] hover:bg-[#FEF2F2]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Created</h3>
              <p className="mt-1 text-sm text-[#2D1810]">
                {format(new Date(customer.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Last Updated</h3>
              <p className="mt-1 text-sm text-[#2D1810]">
                {format(new Date(customer.updatedAt), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Linked Apps</h3>
              <p className="mt-1 text-sm text-[#2D1810]">
                {customer.linkedAppsCount > 0
                  ? `${customer.linkedAppsCount} app${customer.linkedAppsCount !== 1 ? 's' : ''}`
                  : 'No apps linked'}
              </p>
            </div>
          </div>

          {customer.linkedAppsCount > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold text-[#2D1810]">Linked Apps</h3>
              <p className="text-sm text-[#9A948D]">
                {/* TODO: Replace with real app list when app data is available */}
                App management will be available in a future update.
              </p>
            </div>
          )}
        </div>
      </div>

      <EditCustomerDialog customer={customer} isOpen={showEdit} onClose={() => setShowEdit(false)} />
      <DeleteCustomerDialog customer={customer} isOpen={showDelete} onClose={() => setShowDelete(false)} />
    </div>
  )
}
