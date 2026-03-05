'use client'

import { useState } from 'react'
import { AddUserDialog } from '@/components/admin/add-user-dialog'
import { EditRoleDialog } from '@/components/admin/edit-role-dialog'
import { DeactivateConfirmDialog, ReactivateConfirmDialog } from '@/components/admin/confirm-dialog'
import { USER_ROLE_LABELS, type AdminUser, getUserRoles, type UserRole } from '@/lib/constants'

interface RoleDisplayProps {
  user: AdminUser
  onClick: () => void
}

function RoleDisplay({ user, onClick }: RoleDisplayProps) {
  const roles = getUserRoles(user)
  const isPending = user.status === 'pending'
  const isBanned = user.banned

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending || isBanned}
      className={`flex flex-wrap gap-1 ${(isPending || isBanned) ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80 transition-opacity'}`}
    >
      {roles.map((role) => (
        <span
          key={role}
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPending
              ? 'bg-[#FEF3C7] text-[#D97706]'
              : isBanned
              ? 'bg-[#FEE2E2] text-[#DC2626]'
              : 'bg-[#FFF7F3] text-[#FF6B35]'
          }`}
        >
          {USER_ROLE_LABELS[role]}
        </span>
      ))}
      {!isPending && !isBanned && (
        <svg className="h-4 w-4 text-[#9A948D] self-center ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )}
    </button>
  )
}

interface UserListProps {
  users: AdminUser[]
  isLoading: boolean
  totalCount?: number
  currentUserId: string
  onRoleChange: (userId: string, roles: UserRole[]) => Promise<void>
  onUserClick: (user: AdminUser) => void
  onDeactivate: (user: AdminUser) => void
  onReactivate: (user: AdminUser) => void
}

function UserListSkeleton() {
  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E4E0] bg-[#FAFAF9]">
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Name</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Email</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Role</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Status</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-[#E8E4E0]">
                <td className="px-4 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-[#E8E4E0]" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-[#E8E4E0]" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-[#E8E4E0]" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-[#E8E4E0]" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-20 animate-pulse rounded bg-[#E8E4E0]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserList({ users, isLoading, currentUserId, onUserClick, onDeactivate, onReactivate }: UserListProps) {
  const getDisplayName = (user: AdminUser) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.firstName || user.lastName || 'No name'
  }

  const getEmail = (user: AdminUser) => {
    return user.emailAddress || 'No email'
  }

  const getStatus = (user: AdminUser) => {
    if (user.status === 'pending') {
      return { label: 'Pending', className: 'bg-[#FEF3C7] text-[#D97706]' }
    }
    if (user.banned) {
      return { label: 'Inactive', className: 'bg-[#FEE2E2] text-[#DC2626]' }
    }
    return { label: 'Active', className: 'bg-[#D1FAE5] text-[#059669]' }
  }

  if (isLoading) {
    return <UserListSkeleton />
  }

  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E4E0] bg-[#FAFAF9]">
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Name</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Email</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Role</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Status</th>
              <th className="h-12 px-4 text-left font-semibold text-[#2D1810]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="h-24 text-center text-[#9A948D]">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const status = getStatus(user)
                const isCurrentUser = user.id === currentUserId
                const isBanned = user.banned
                const isPending = user.status === 'pending'
                
                return (
                  <tr key={user.id} className="border-b border-[#E8E4E0] transition-colors hover:bg-[#FFF7F3]">
                    <td className="px-4 py-3 font-medium text-[#2D1810]">{getDisplayName(user)}</td>
                    <td className="px-4 py-3 text-[#9A948D]">{getEmail(user)}</td>
                    <td className="px-4 py-3">
                      <RoleDisplay user={user} onClick={() => onUserClick(user)} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!isPending && (
                        isBanned ? (
                          <button
                            type="button"
                            onClick={() => onReactivate(user)}
                            className="text-xs font-medium text-[#059669] hover:text-[#047857] transition-colors"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDeactivate(user)}
                            disabled={isCurrentUser}
                            className={`text-xs font-medium transition-colors ${
                              isCurrentUser 
                                ? 'text-[#D1D5DB] cursor-not-allowed' 
                                : 'text-[#DC2626] hover:text-[#B91C1C]'
                            }`}
                            title={isCurrentUser ? 'Cannot deactivate your own account' : undefined}
                          >
                            Deactivate
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface UsersPageClientProps {
  initialUsers: AdminUser[]
  totalCount?: number
  currentUserId: string
}

export function UsersPageClient({ initialUsers, totalCount, currentUserId }: UsersPageClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [totalUserCount, setTotalUserCount] = useState(totalCount ?? initialUsers.length)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deactivateUser, setDeactivateUser] = useState<AdminUser | null>(null)
  const [reactivateUser, setReactivateUser] = useState<AdminUser | null>(null)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const refreshUsers = async () => {
    setIsRefreshing(true)
    setRefreshError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to refresh users')
      }
      const data = await response.json()
      setUsers(data.users)
      setTotalUserCount(data.totalCount ?? data.users.length)
    } catch (error) {
      console.error('Failed to refresh users:', error)
      setRefreshError('Failed to refresh user list. Please try again.')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleUserAdded = async () => {
    await refreshUsers()
  }

  const handleUserClick = (user: AdminUser) => {
    if (user.status !== 'pending' && !user.banned) {
      setEditingUser(user)
      setIsDialogOpen(true)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
  }

  const handleRoleChange = async (userId: string, roles: UserRole[]) => {
    const userIndex = users.findIndex(u => u.id === userId)
    const previousUser = userIndex !== -1 ? users[userIndex] : null

    if (userIndex !== -1) {
      const updatedUsers = [...users]
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], privateMetadata: { ...updatedUsers[userIndex].privateMetadata, roles } }
      setUsers(updatedUsers)
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (previousUser && userIndex !== -1) {
          const updatedUsers = [...users]
          updatedUsers[userIndex] = previousUser
          setUsers(updatedUsers)
        }
        throw new Error(data.error || 'Failed to update role')
      }

      await refreshUsers()
    } catch (error) {
      throw error
    }
  }

  const getDisplayName = (user: AdminUser) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.firstName || user.lastName || 'this user'
  }

  const handleDeactivate = (user: AdminUser) => {
    setDeactivateUser(user)
  }

  const handleReactivate = (user: AdminUser) => {
    setReactivateUser(user)
  }

  const confirmDeactivate = async () => {
    if (!deactivateUser) return

    setIsDeactivating(true)
    try {
      const response = await fetch(`/api/admin/users/${deactivateUser.id}/deactivate`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to deactivate user')
      }

      await refreshUsers()
      setDeactivateUser(null)
      setSuccessMessage(`${getDisplayName(deactivateUser)} has been deactivated`)
    } catch (error) {
      console.error('Failed to deactivate user:', error)
      const message = error instanceof Error ? error.message : 'Failed to deactivate user'
      setRefreshError(message)
    } finally {
      setIsDeactivating(false)
    }
  }

  const confirmReactivate = async () => {
    if (!reactivateUser) return

    setIsReactivating(true)
    try {
      const response = await fetch(`/api/admin/users/${reactivateUser.id}/reactivate`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reactivate user')
      }

      await refreshUsers()
      setReactivateUser(null)
      setSuccessMessage(`${getDisplayName(reactivateUser)} has been reactivated`)
    } catch (error) {
      console.error('Failed to reactivate user:', error)
      const message = error instanceof Error ? error.message : 'Failed to reactivate user'
      setRefreshError(message)
    } finally {
      setIsReactivating(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-[#2D1810]">User Management</h1>
          <span className="rounded-full bg-[#FFF7F3] px-3 py-1 text-xs font-semibold text-[#FF6B35]">({totalUserCount} users)</span>
        </div>
        <AddUserDialog onUserAdded={handleUserAdded} />
      </div>
      {successMessage && (
        <div className="mb-4 rounded-xl border border-[#6EE7B7] bg-[#D1FAE5] p-4 text-sm text-[#059669]">
          {successMessage}
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="ml-2 font-medium hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}
      {refreshError && (
        <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
          <span className="font-medium">Error:</span> {refreshError}
          <button
            type="button"
            onClick={() => setRefreshError(null)}
            className="ml-2 font-medium hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}
      <UserList 
        users={users} 
        isLoading={isRefreshing}
        currentUserId={currentUserId}
        onRoleChange={handleRoleChange}
        onUserClick={handleUserClick}
        onDeactivate={handleDeactivate}
        onReactivate={handleReactivate}
      />
      <EditRoleDialog
        user={editingUser}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleRoleChange}
      />
      <DeactivateConfirmDialog
        isOpen={deactivateUser !== null}
        userName={deactivateUser ? getDisplayName(deactivateUser) : ''}
        onConfirm={confirmDeactivate}
        onCancel={() => setDeactivateUser(null)}
        isLoading={isDeactivating}
      />
      <ReactivateConfirmDialog
        isOpen={reactivateUser !== null}
        userName={reactivateUser ? getDisplayName(reactivateUser) : ''}
        onConfirm={confirmReactivate}
        onCancel={() => setReactivateUser(null)}
        isLoading={isReactivating}
      />
    </div>
  )
}
