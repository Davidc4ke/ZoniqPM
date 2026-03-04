'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { USER_ROLES, USER_ROLE_LABELS, DEFAULT_ROLES, type UserRole } from '@/lib/constants'

interface AddUserDialogProps {
  onUserAdded?: () => void
}

interface FormData {
  email: string
  name: string
  roles: UserRole[]
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    roles: [...DEFAULT_ROLES],
  })

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError(null)
    setFormData({ email: '', name: '', roles: [...DEFAULT_ROLES] })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, handleClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.roles.length === 0) {
      setError('Please select at least one role')
      return
    }
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create user')
        return
      }

      setIsOpen(false)
      setFormData({ email: '', name: '', roles: [...DEFAULT_ROLES] })
      toast.success('Invitation sent', {
        description: `An invitation email has been sent to ${formData.email}`,
      })
      onUserAdded?.()
    } catch (err) {
      console.error('Unexpected error creating user:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleToggle = (role: UserRole) => {
    setFormData((prev) => {
      const hasRole = prev.roles.includes(role)
      if (hasRole) {
        return { ...prev, roles: prev.roles.filter((r) => r !== role) }
      }
      return { ...prev, roles: [...prev.roles, role] }
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#E55A2B] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#FF6B35] focus-visible:outline-offset-2"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add User
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="dialog-title" className="text-xl font-bold text-[#2D1810] mb-4">Add New User</h2>

        {error && (
          <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2D1810] mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-colors"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#2D1810] mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-[#E8E4E0] bg-white px-3 py-2.5 text-sm text-[#2D1810] placeholder:text-[#9A948D] focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D1810] mb-2">
                Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {USER_ROLES.map((role) => {
                  const isSelected = formData.roles.includes(role)
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleToggle(role)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-[#FF6B35] text-white shadow-sm'
                          : 'bg-[#F5F2EF] text-[#2D1810] hover:bg-[#E8E4E0]'
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {USER_ROLE_LABELS[role]}
                    </button>
                  )
                })}
              </div>
              <p className="mt-1.5 text-xs text-[#9A948D]">Select one or more roles</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35] transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || formData.roles.length === 0}
              className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55a2b] hover:shadow-md hover:shadow-[#FF6B35]/30 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
