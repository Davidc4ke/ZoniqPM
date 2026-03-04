export const USER_ROLES = ['admin', 'pm', 'consultant'] as const

export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  pm: 'PM',
  consultant: 'Consultant',
}

export const DEFAULT_REDIRECT_URL = 'http://localhost:3000'

export const DEFAULT_ROLES: UserRole[] = ['consultant']
