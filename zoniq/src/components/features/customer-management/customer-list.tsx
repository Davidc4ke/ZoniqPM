'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { CustomerCard } from './customer-card';
import { CustomerForm } from './customer-form';

interface Customer {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface CustomerListProps {
  canManage: boolean;
}

export function CustomerList({ canManage }: CustomerListProps) {
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [isFormOpen, setIsFormOpen] = useState(
    searchParams.get('create') === 'true',
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/customers?${params}`);
      if (!response.ok) throw new Error('Failed to fetch customers');

      const result = await response.json();
      setCustomers(result.data);
      setTotal(result.meta.total);
    } catch {
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A948D]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-[#E8E4E0] py-2.5 pl-10 pr-3 text-sm text-[#2D1810] placeholder-[#9A948D] transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-[#E8E4E0] px-3 py-2.5 text-sm text-[#2D1810] transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="">All</option>
        </select>
        {canManage && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B]"
          >
            <svg
              className="h-4 w-4"
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
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-[#E8E4E0] bg-white p-5"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#F5F2EF]" />
                <div className="h-4 w-32 rounded bg-[#F5F2EF]" />
              </div>
              <div className="mb-3 space-y-2">
                <div className="h-3 w-full rounded bg-[#F5F2EF]" />
                <div className="h-3 w-2/3 rounded bg-[#F5F2EF]" />
              </div>
              <div className="h-3 w-24 rounded bg-[#F5F2EF]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && customers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E4E0] bg-white py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5]">
            <svg
              className="h-8 w-8 text-[#10B981]"
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
          <h3 className="mb-1 text-base font-semibold text-[#2D1810]">
            No customers yet
          </h3>
          <p className="mb-5 text-sm text-[#9A948D]">
            {search
              ? 'No customers match your search'
              : 'Get started by adding your first customer'}
          </p>
          {canManage && !search && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B]"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Customer
            </button>
          )}
        </div>
      )}

      {/* Customer Grid */}
      {!isLoading && customers.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-[#9A948D]">
                Showing {(page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, total)} of {total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-[#E8E4E0] px-3 py-1.5 text-sm text-[#2D1810] transition-colors hover:bg-[#F5F2EF] disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                  className="rounded-lg border border-[#E8E4E0] px-3 py-1.5 text-sm text-[#2D1810] transition-colors hover:bg-[#F5F2EF] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Form Dialog */}
      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}
