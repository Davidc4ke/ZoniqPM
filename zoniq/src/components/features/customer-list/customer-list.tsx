'use client'

import Link from 'next/link'
import { useCustomers } from '@/hooks/use-customers'
import { AddCustomerDialog } from './add-customer-dialog'
import type { Customer } from '@/types/customer'

function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <Link
      href={`/masterdata/customers/${customer.id}`}
      className="block rounded-xl border border-[#E8E4E0] bg-[#F0FDF9] p-5 transition-all hover:border-[#10B981] hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981] text-white font-semibold text-sm">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-[#2D1810]">{customer.name}</h3>
            {customer.description && (
              <p className="mt-0.5 text-sm text-[#9A948D] line-clamp-1">{customer.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {customer.linkedAppsCount > 0 && (
            <span className="rounded-full bg-[#E8E4E0] px-2 py-1 text-xs font-semibold text-[#2D1810]">
              {customer.linkedAppsCount} app{customer.linkedAppsCount !== 1 ? 's' : ''}
            </span>
          )}
          <svg className="h-4 w-4 text-[#9A948D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

function CustomerListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-[#E8E4E0] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E8E4E0]" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-[#E8E4E0]" />
              <div className="h-3 w-60 rounded bg-[#E8E4E0]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CustomerList() {
  const { data: customers, isLoading, isError, error } = useCustomers()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1810]">Customers</h1>
          <p className="mt-1 text-sm text-[#9A948D]">Manage your client organizations</p>
        </div>
        <AddCustomerDialog />
      </div>

      {isLoading && <CustomerListSkeleton />}

      {isError && (
        <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
          {error?.message || 'Failed to load customers'}
        </div>
      )}

      {customers && customers.length === 0 && (
        <div className="rounded-xl border border-[#E8E4E0] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5]">
            <svg className="h-6 w-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#2D1810]">No customers yet</h3>
          <p className="mt-1 text-sm text-[#9A948D]">Get started by adding your first customer</p>
        </div>
      )}

      {customers && customers.length > 0 && (
        <div className="space-y-3">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  )
}
