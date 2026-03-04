'use client'

import { useState, useEffect, useCallback } from 'react'
import { USER_ROLES, USER_ROLE_LABELS, type AdminUser, getUserRoles, type UserRole } from '@/lib/constants'

interface EditRoleDialogProps {
  user: AdminUser | null
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, roles: UserRole[]) => Promise<void>
}

export function EditRoleDialog({ user, isOpen, onClose, onSave }: EditRoleDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getDisplayName = (u: AdminUser) => {
    if (u.firstName && u.lastName) {
      return `${u.firstName} ${u.lastName}`
    }
    return u.firstName || u.lastName || 'No name'
  }

  useEffect(() => {
    if (user && isOpen) {
      setSelectedRoles(getUserRoles(user))
      setError(null)
    }
  }, [user, isOpen])

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose()
      setError(null)
    }
  }, [isLoading, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, handleClose])

  const handleRoleToggle = (role: UserRole) => {
    setSelectedRoles((prev) => {
      const hasRole = prev.includes(role)
      if (hasRole) {
        return prev.filter((r) => r !== role)
      }
      return [...prev, role]
    })
  }

  const handleSave = async () => {
    if (!user) return
    
    if (selectedRoles.length === 0) {
      setError('Please select at least one role')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await onSave(user.id, selectedRoles)
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update roles'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !user) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="edit-role-dialog-title">
      <div className="w-full max-w-md rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-xl">
        <h2 id="edit-role-dialog-title" className="text-xl font-bold text-[#2D1810] mb-2">
          Edit Roles
        </h2>
        <p className="text-sm text-[#9A948D] mb-4">
          {getDisplayName(user)} {'\u00b7'} {user.emailAddress || 'No email'}
          {user.status === 'pending' && (
            <span className="ml-2 inline-flex items-center rounded-full bg-[#FEF3C7] px-2 py-0.5 text-xs font-medium text-[#D97706]">
              Pending
            </span>
          )}
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2D1810] mb-2">
            Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {USER_ROLES.map((role) => {
              const isSelected = selectedRoles.includes(role)
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleToggle(role)}
                  disabled={user.status === 'pending'}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-[#FF6B35] text-white shadow-sm'
                      : 'bg-[#F5F2EF] text-[#2D1810] hover:bg-[#E8E4E0]'
                  } ${user.status === 'pending' ? 'cursor-not-allowed opacity-60' : ''}`}
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

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] hover:border-[#FF6B35] hover:bg-[#FFF7F3] hover:text-[#FF6B35] transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || selectedRoles.length === 0 || user.status === 'pending'}
            className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55a2b] hover:shadow-md hover:shadow-[#FF6B35]/30 disabled:opacity-50 transition-all"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
