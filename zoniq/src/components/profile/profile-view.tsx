'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { toast } from 'sonner'
import { USER_ROLE_LABELS, getUserRoles, type AdminUser } from '@/lib/constants'

const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  admin: ['Full system access', 'User management', 'Access all projects'],
  pm: ['Create/manage customers', 'Create/manage apps', 'Create/manage projects', 'Create/manage stories'],
  consultant: ['View assigned projects', 'Update assigned stories'],
}

function ProfileSkeleton() {
  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white shadow-sm p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-[#E8E4E0] rounded" />
        <div className="h-4 w-32 bg-[#E8E4E0] rounded" />
        <div className="space-y-3 mt-6">
          <div className="h-10 w-full bg-[#E8E4E0] rounded" />
          <div className="h-10 w-full bg-[#E8E4E0] rounded" />
          <div className="h-10 w-full bg-[#E8E4E0] rounded" />
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const badgeStyles: Record<string, string> = {
    admin: 'bg-[#FF6B35] text-white',
    pm: 'bg-[#3B82F6] text-white',
    consultant: 'bg-[#E8E4E0] text-[#2D1810]',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${badgeStyles[role] || badgeStyles.consultant}`}>
      {USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS] || role}
    </span>
  )
}

interface ProfileViewProps {
  initialUser: AdminUser
}

export function ProfileView({ initialUser }: ProfileViewProps) {
  const { user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(initialUser.firstName || '')
  const [lastName, setLastName] = useState(initialUser.lastName || '')
  const [isSaving, setIsSaving] = useState(false)

  const roles = getUserRoles(initialUser)

  const handleSave = async () => {
    if (!user) return

    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()

    if (!trimmedFirstName && !trimmedLastName) {
      toast.error('Please enter at least a first or last name')
      return
    }

    if (trimmedFirstName.length > 100 || trimmedLastName.length > 100) {
      toast.error('Names must be 100 characters or less')
      return
    }

    setIsSaving(true)
    try {
      await user.update({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
      })
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFirstName(initialUser.firstName || '')
    setLastName(initialUser.lastName || '')
    setIsEditing(false)
  }

  if (!isLoaded) {
    return <ProfileSkeleton />
  }

  return (
    <div className="mx-auto max-w-2xl py-6 px-4">
      <div className="rounded-xl border border-[#E8E4E0] bg-white shadow-sm">
        <div className="border-b border-[#E8E4E0] px-6 py-4">
          <h1 className="text-2xl font-extrabold text-[#2D1810]">My Profile</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-[#FFF7F3] flex items-center justify-center text-2xl font-bold text-[#FF6B35]">
              {(firstName?.[0] || '?').toUpperCase()}
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2D1810] mb-1.5">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.slice(0, 100))}
                  className="w-full rounded-lg border border-[#E8E4E0] px-3 py-2 text-[#2D1810] focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  placeholder="Enter first name"
                />
              ) : (
                <div className="rounded-lg border border-[#E8E4E0] bg-[#FAFAF9] px-3 py-2 text-[#2D1810]">
                  {firstName || <span className="text-[#9A948D]">Not set</span>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2D1810] mb-1.5">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.slice(0, 100))}
                  className="w-full rounded-lg border border-[#E8E4E0] px-3 py-2 text-[#2D1810] focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  placeholder="Enter last name"
                />
              ) : (
                <div className="rounded-lg border border-[#E8E4E0] bg-[#FAFAF9] px-3 py-2 text-[#2D1810]">
                  {lastName || <span className="text-[#9A948D]">Not set</span>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2D1810] mb-1.5">
                Email
              </label>
              <div className="rounded-lg border border-[#E8E4E0] bg-[#FAFAF9] px-3 py-2 text-[#9A948D] flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {initialUser.emailAddress || 'No email'}
                <span className="text-xs">(read-only)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2D1810] mb-1.5">
                Role(s)
              </label>
              <div className="rounded-lg border border-[#E8E4E0] bg-[#FAFAF9] px-3 py-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-[#9A948D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="flex flex-wrap gap-1">
                  {roles.map((role) => (
                    <span key={role} className="text-[#9A948D] text-sm">
                      {USER_ROLE_LABELS[role]}
                      {roles.indexOf(role) < roles.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-[#9A948D]">(read-only)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E8E4E0] pt-6">
            <h2 className="text-sm font-semibold text-[#2D1810] mb-3">Permissions Summary</h2>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role} className="rounded-lg border border-[#E8E4E0] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <RoleBadge role={role} />
                  </div>
                  <ul className="text-sm text-[#9A948D] space-y-1">
                    {(PERMISSIONS_BY_ROLE[role] || []).map((permission, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E4E0]">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-lg border border-[#E8E4E0] px-4 py-2 text-sm font-semibold text-[#2D1810] hover:bg-[#FAFAF9] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E55A2B] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E55A2B] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
