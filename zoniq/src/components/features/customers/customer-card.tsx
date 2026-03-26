'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { CustomerWithAppCount } from '@/types/customers'

interface CustomerCardProps {
  customer: CustomerWithAppCount
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link
      href={`/customers/${customer.id}`}
      className="group block rounded-xl border border-[#E8E4E0] bg-white p-5 transition-all hover:border-[#10B981] hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
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
          <h3 className="text-base font-semibold text-[#2D1810] group-hover:text-[#10B981]">
            {customer.name}
          </h3>
        </div>
        <span className="rounded-full bg-[#F0FDF9] px-2.5 py-0.5 text-xs font-medium text-[#10B981]">
          {customer.appCount} {customer.appCount === 1 ? 'app' : 'apps'}
        </span>
      </div>

      {customer.description && (
        <p className="mb-3 line-clamp-2 text-sm text-[#9A948D]">{customer.description}</p>
      )}

      <div className="text-xs text-[#9A948D]">
        Created {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
      </div>
    </Link>
  )
}
