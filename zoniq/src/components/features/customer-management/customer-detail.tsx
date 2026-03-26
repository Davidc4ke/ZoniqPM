'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
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

interface CustomerDetailProps {
  customer: Customer;
  canManage: boolean;
}

export function CustomerDetail({
  customer: initialCustomer,
  canManage,
}: CustomerDetailProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState(initialCustomer);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshCustomer = useCallback(async () => {
    const response = await fetch(`/api/customers/${customer.id}`);
    if (response.ok) {
      const result = await response.json();
      setCustomer(result.data);
    }
  }, [customer.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Failed to delete customer',
        );
      }

      toast.success('Customer deleted');
      router.push('/masterdata');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete customer. Please try again.',
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 rounded-xl border border-[#E8E4E0] bg-[#ECFDF5] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80">
              <svg
                className="h-6 w-6 text-[#10B981]"
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
            <div>
              <h1 className="text-2xl font-extrabold text-[#2D1810]">
                {customer.name}
              </h1>
              {customer.description && (
                <p className="mt-1 text-sm text-[#2D1810]/70">
                  {customer.description}
                </p>
              )}
            </div>
          </div>

          {canManage && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="rounded-lg border border-[#2D1810]/20 px-3 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:bg-white/50"
              >
                Edit
              </button>
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="rounded-lg border border-[#EF4444]/30 px-3 py-2 text-sm font-medium text-[#EF4444] transition-colors hover:bg-[#EF4444]/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <span className="text-xs font-medium text-[#2D1810]/50">
              Status
            </span>
            <div className="mt-1">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  customer.isActive
                    ? 'bg-white/80 text-[#10B981]'
                    : 'bg-white/50 text-[#9A948D]'
                }`}
              >
                {customer.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-[#2D1810]/50">
              Created
            </span>
            <p className="mt-1 text-sm text-[#2D1810]">
              {format(new Date(customer.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-[#2D1810]/50">
              Updated
            </span>
            <p className="mt-1 text-sm text-[#2D1810]">
              {format(new Date(customer.updatedAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-[#2D1810]/50">
              Linked Apps
            </span>
            <p className="mt-1 text-sm text-[#2D1810]">0</p>
          </div>
        </div>
      </div>

      {/* Apps Section (placeholder for Story 2.2) */}
      <div className="rounded-xl border border-[#E8E4E0] bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-[#2D1810]">
          Linked Apps
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F2EF]">
            <svg
              className="h-6 w-6 text-[#9A948D]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M3 9h6" />
              <path d="M3 15h6" />
            </svg>
          </div>
          <p className="text-sm text-[#9A948D]">
            No apps linked to this customer yet
          </p>
        </div>
      </div>

      {/* Edit Form Dialog */}
      <CustomerForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={refreshCustomer}
        editCustomer={customer}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isDeleting && setIsDeleteOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[400px] rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-[#2D1810]">
              Delete Customer?
            </h2>
            <p className="mb-5 text-sm text-[#9A948D]">
              This action cannot be undone. The customer will be
              deactivated and removed from the list.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="rounded-lg border border-[#E8E4E0] px-4 py-2.5 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#F5F2EF] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#DC2626] disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
