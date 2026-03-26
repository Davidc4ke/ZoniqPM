'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { EditCustomerDialog } from './edit-customer-dialog'
import { DeleteCustomerDialog } from './delete-customer-dialog'
import type { Customer } from '@/types/customers'

interface CustomerDetailProps {
  customer: Customer
  apps: Array<{ id: string; name: string }>
  canEdit: boolean
}

export function CustomerDetail({ customer: initialCustomer, apps, canEdit }: CustomerDetailProps) {
  const router = useRouter()
  const [customer, setCustomer] = useState(initialCustomer)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function refreshCustomer() {
    const res = await fetch(`/api/customers/${customer.id}`)
    if (res.ok) {
      const json = await res.json()
      setCustomer(json.data)
    }
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/customers')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF9] text-[#10B981]">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2D1810]">{customer.name}</h1>
              <p className="text-sm text-[#9A948D]">
                Created {format(new Date(customer.createdAt), 'PPP')}
              </p>
            </div>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E8E4E0] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#2D1810]">Details</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-[#9A948D]">Name</dt>
              <dd className="mt-1 text-[#2D1810]">{customer.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[#9A948D]">Description</dt>
              <dd className="mt-1 text-[#2D1810]">{customer.description || 'No description'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[#9A948D]">Last Updated</dt>
              <dd className="mt-1 text-[#2D1810]">
                {format(new Date(customer.updatedAt), 'PPP p')}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-[#E8E4E0] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#2D1810]">
            Linked Apps ({apps.length})
          </h2>
          {apps.length === 0 ? (
            <p className="text-sm text-[#9A948D]">No apps linked to this customer yet.</p>
          ) : (
            <ul className="space-y-2">
              {apps.map((app) => (
                <li
                  key={app.id}
                  className="rounded-lg border border-[#E8E4E0] p-3 text-sm text-[#2D1810]"
                >
                  {app.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {canEdit && (
        <>
          <EditCustomerDialog
            customer={customer}
            open={editOpen}
            onOpenChange={setEditOpen}
            onUpdated={refreshCustomer}
          />
          <DeleteCustomerDialog
            customerId={customer.id}
            customerName={customer.name}
            hasLinkedApps={apps.length > 0}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </div>
  )
}
