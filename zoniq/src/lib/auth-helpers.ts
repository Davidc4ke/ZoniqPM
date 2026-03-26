import { auth, clerkClient } from '@clerk/nextjs/server'

export interface AuthResult {
  authorized: boolean
  userId?: string
  organizationId?: string
  roles?: string[]
  error?: string
  status?: number
}

export async function verifyAuth(): Promise<AuthResult> {
  const { userId, orgId } = await auth()
  if (!userId) {
    return { authorized: false, error: 'Not authenticated', status: 401 }
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const roles = (user.privateMetadata?.roles as string[]) || ['consultant']

  return {
    authorized: true,
    userId,
    organizationId: orgId || 'default',
    roles,
  }
}

export async function verifyPMOrAdmin(): Promise<AuthResult> {
  const result = await verifyAuth()
  if (!result.authorized) return result

  const canWrite = result.roles!.includes('admin') || result.roles!.includes('pm')
  if (!canWrite) {
    return { authorized: false, error: 'PM or Admin role required', status: 403 }
  }

  return result
}
