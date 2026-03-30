'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createModuleSchema } from '@/types/module'
import type { CreateModuleInput } from '@/types/module'

interface ModuleFormProps {
  defaultValues?: Partial<CreateModuleInput>
  onSubmit: (data: CreateModuleInput) => void
  isPending: boolean
  submitLabel: string
  onCancel: () => void
}

export function ModuleForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }: ModuleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateModuleInput>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="module-name" className="block text-sm font-medium text-[#2D1810]">
          Name <span className="text-[#DC2626]">*</span>
        </label>
        <input
          id="module-name"
          type="text"
          {...register('name')}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-[#2D1810] placeholder-[#9A948D] outline-none transition-colors focus:ring-2 focus:ring-[#FF6B35] ${
            errors.name ? 'border-[#DC2626]' : 'border-[#E8E4E0]'
          }`}
          placeholder="e.g., Authentication"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-[#DC2626]">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="module-description" className="block text-sm font-medium text-[#2D1810]">
          Description
        </label>
        <textarea
          id="module-description"
          {...register('description')}
          rows={3}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-[#2D1810] placeholder-[#9A948D] outline-none transition-colors focus:ring-2 focus:ring-[#FF6B35] ${
            errors.description ? 'border-[#DC2626]' : 'border-[#E8E4E0]'
          }`}
          placeholder="Brief description of this module's purpose"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-[#DC2626]">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#2D1810] px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#F5F2EF]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B] disabled:opacity-50"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
