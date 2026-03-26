'use client'

import { useState } from 'react'
import { CustomerCard } from './customer-card'
import { CreateCustomerDialog } from './create-customer-dialog'
import { Button } from '@/components/ui/button'
import type { CustomerWithAppCount } from '@/types/customers'

interface CustomerListProps {
  initialCustomers: CustomerWithAppCount[]
  canEdit: boolean
}

export function CustomerList({ initialCustomers, canEdit }: CustomerListProps) {
  const [customers, setCustomers] = useState<CustomerWithAppCount[]>(initialCustomers)
  const [createOpen, setCreateOpen] = useState(false)

  async function refreshCustomers() {
    const res = await fetch('/api/customers')
    if (res.ok) {
      const json = await res.json()
      setCustomers(json.data)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1810]">Customers</h1>
          <p className="mt-1 text-sm text-[#9A948D]">
            Manage your client organizations and their apps
          </p>
        </div>
        {canEdit && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#10B981] text-white hover:bg-[#059669]"
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Customer
          </Button>
        )}
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E4E0] bg-white p-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF9] text-[#10B981]">
            <svg
              className="h-6 w-6"
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
          <h3 className="text-lg font-semibold text-[#2D1810]">No customers yet</h3>
          <p className="mt-1 text-sm text-[#9A948D]">
            {canEdit
              ? 'Add your first customer to get started.'
              : 'No customers have been created yet.'}
          </p>
          {canEdit && (
            <Button
              onClick={() => setCreateOpen(true)}
              className="mt-4 bg-[#10B981] text-white hover:bg-[#059669]"
            >
              Add Customer
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}

      {canEdit && (
        <CreateCustomerDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={refreshCustomers}
        />
      )}
    </div>
  )
}
