'use client';

import Link from 'next/link';
import { format } from 'date-fns';

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
  };
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link
      href={`/masterdata/customers/${customer.id}`}
      className="group block rounded-xl border border-[#E8E4E0] bg-white p-5 transition-all duration-200 hover:border-[#10B981] hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECFDF5]">
            <svg
              className="h-4 w-4 text-[#10B981]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-[#2D1810] group-hover:text-[#10B981]">
            {customer.name}
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            customer.isActive
              ? 'bg-[#ECFDF5] text-[#10B981]'
              : 'bg-[#F5F2EF] text-[#9A948D]'
          }`}
        >
          {customer.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {customer.description && (
        <p className="mb-3 line-clamp-2 text-sm text-[#9A948D]">
          {customer.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-[#9A948D]">
        <span>
          Created{' '}
          {format(new Date(customer.createdAt), 'MMM d, yyyy')}
        </span>
      </div>
    </Link>
  );
}
