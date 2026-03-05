import { auth, clerkClient } from '@clerk/nextjs/server'

export interface AdminAuthResult {
  authorized: boolean
  userId?: string
  error?: string
  status?: number
}

export async function verifyAdmin(): Promise<AdminAuthResult> {
  const { userId } = await auth()
  if (!userId) {
    return { authorized: false, error: 'Unauthorized', status: 401 }
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const roles = user.privateMetadata?.roles as string[] | undefined
  const role = user.privateMetadata?.role as string | undefined

  const isAdmin = (roles && roles.includes('admin')) || role === 'admin'
  if (!isAdmin) {
    return { authorized: false, error: 'Admin access required', status: 403 }
  }

  return { authorized: true, userId }
}
