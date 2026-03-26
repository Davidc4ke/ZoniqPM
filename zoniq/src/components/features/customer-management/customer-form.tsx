'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CustomerFormData {
  name: string;
  description: string;
}

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editCustomer?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
}

export function CustomerForm({
  isOpen,
  onClose,
  onSuccess,
  editCustomer,
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!editCustomer;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const descriptionValue = watch('description');

  useEffect(() => {
    if (isOpen && editCustomer) {
      reset({
        name: editCustomer.name,
        description: editCustomer.description || '',
      });
    } else if (isOpen) {
      reset({ name: '', description: '' });
    }
  }, [isOpen, editCustomer, reset]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
      reset({ name: '', description: '' });
    }
  }, [isSubmitting, onClose, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, handleClose]);

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      const url = isEditing
        ? `/api/customers/${editCustomer!.id}`
        : '/api/customers';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Failed to save customer',
        );
      }

      toast.success(
        isEditing ? 'Customer updated' : 'Customer created',
      );
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save customer. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-[480px] rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2D1810]">
            {isEditing ? 'Edit Customer' : 'New Customer'}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
            aria-label="Close"
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="customer-name"
              className="mb-1.5 block text-sm font-medium text-[#2D1810]"
            >
              Customer Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="e.g., Acme Insurance Corp"
              className="w-full rounded-lg border border-[#E8E4E0] px-3 py-2.5 text-sm text-[#2D1810] placeholder-[#9A948D] transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              {...register('name', {
                required: 'Customer name is required',
                maxLength: {
                  value: 100,
                  message:
                    'Customer name must be 100 characters or less',
                },
              })}
              aria-describedby={
                errors.name ? 'name-error' : undefined
              }
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-[#EF4444]"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customer-description"
              className="mb-1.5 block text-sm font-medium text-[#2D1810]"
            >
              Description
            </label>
            <textarea
              id="customer-description"
              placeholder="Brief overview of customer, industry, project focus"
              rows={3}
              className="w-full resize-none rounded-lg border border-[#E8E4E0] px-3 py-2.5 text-sm text-[#2D1810] placeholder-[#9A948D] transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message:
                    'Description must be 500 characters or less',
                },
              })}
              aria-describedby={
                errors.description ? 'desc-error' : undefined
              }
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.description ? (
                <p id="desc-error" className="text-sm text-[#EF4444]">
                  {errors.description.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-[#9A948D]">
                {descriptionValue?.length || 0}/500
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-[#E8E4E0] px-4 py-2.5 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#F5F2EF] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B] disabled:opacity-50"
            >
              {isSubmitting && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
