export const USER_ROLES = ['admin', 'pm', 'consultant'] as const

export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  pm: 'PM',
  consultant: 'Consultant',
}

export const DEFAULT_REDIRECT_URL = 'http://localhost:3000'

export const DEFAULT_ROLES: UserRole[] = ['consultant']

export interface AdminUser {
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
  status: 'active' | 'pending' | 'inactive'
  createdAt?: number
}

export function getUserRoles(user: AdminUser): UserRole[] {
  const roles = user.privateMetadata?.roles || user.publicMetadata?.roles
  if (roles && Array.isArray(roles) && roles.length > 0) {
    return roles as UserRole[]
  }
  const legacyRole = (user.privateMetadata?.role || user.publicMetadata?.role) as UserRole | undefined
  return legacyRole ? [legacyRole] : ['consultant']
}
