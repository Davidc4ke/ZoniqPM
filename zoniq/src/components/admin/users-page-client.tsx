'use client'

import { useState } from 'react'
import { AddUserDialog } from '@/components/admin/add-user-dialog'
import { USER_ROLE_LABELS, type UserRole } from '@/lib/constants'

interface User {
  id: string
  emailAddress?: string
  firstName?: string | null
  lastName?: string | null
  privateMetadata?: {
    role?: string
    roles?: string[]
  }
  publicMetadata?: {
    role?: string
    roles?: string[]
  }
  banned?: boolean
  status: 'active' | 'pending'
  createdAt?: number
}

interface UserListProps {
  users: User[]
  isLoading: boolean
  totalCount?: number
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserList({ users, isLoading }: UserListProps) {
  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.firstName || user.lastName || 'No name'
  }

  const getEmail = (user: User) => {
    return user.emailAddress || 'No email'
  }

  const getRoles = (user: User): UserRole[] => {
    const roles = user.privateMetadata?.roles || user.publicMetadata?.roles
    if (roles && Array.isArray(roles) && roles.length > 0) {
      return roles as UserRole[]
    }
    const legacyRole = (user.privateMetadata?.role || user.publicMetadata?.role) as UserRole | undefined
    if (legacyRole) {
      return [legacyRole]
    }
    return ['consultant']
  }

  const getStatus = (user: User) => {
    if (user.status === 'pending') {
      return { label: 'Pending', className: 'bg-[#FEF3C7] text-[#D97706]' }
    }
    if (user.banned) {
      return { label: 'Banned', className: 'bg-[#FEE2E2] text-[#DC2626]' }
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
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-24 text-center text-[#9A948D]">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const status = getStatus(user)
                return (
                  <tr key={user.id} className="border-b border-[#E8E4E0] transition-colors hover:bg-[#FFF7F3]">
                    <td className="px-4 py-3 font-medium text-[#2D1810]">{getDisplayName(user)}</td>
                    <td className="px-4 py-3 text-[#9A948D]">{getEmail(user)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {getRoles(user).map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center rounded-full bg-[#F5F2EF] px-2 py-0.5 text-xs font-medium text-[#2D1810]"
                          >
                            {USER_ROLE_LABELS[role]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${status.className}`}>
                        {status.label}
                      </span>
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
  initialUsers: User[]
  totalCount?: number
}

export function UsersPageClient({ initialUsers, totalCount }: UsersPageClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [totalUserCount, setTotalUserCount] = useState(totalCount ?? initialUsers.length)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)

  const handleUserAdded = async () => {
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

  return (
    <div className="mx-auto max-w-6xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-[#2D1810]">User Management</h1>
          <span className="rounded-full bg-[#FFF7F3] px-3 py-1 text-xs font-semibold text-[#FF6B35]">({totalUserCount} users)</span>
        </div>
        <AddUserDialog onUserAdded={handleUserAdded} />
      </div>
      {refreshError && (
        <div className="mb-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
          <span className="font-medium">Error:</span> {refreshError}
        </div>
      )}
      <UserList users={users} isLoading={isRefreshing} />
    </div>
  )
}
