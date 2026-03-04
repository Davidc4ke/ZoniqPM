import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { USER_ROLES, type UserRole } from '@/lib/constants'

const updateRoleSchema = z.object({
  roles: z.array(z.enum(USER_ROLES)).min(1, 'At least one role is required'),
})

async function verifyAdmin() {
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

  return { authorized: true }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await verifyAdmin()
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  try {
    const { id: targetUserId } = await params
    const body = await request.json()
    const { roles } = updateRoleSchema.parse(body)

    const client = await clerkClient()

    const currentTargetUser = await client.users.getUser(targetUserId)
    const currentRoles = currentTargetUser.privateMetadata?.roles as UserRole[] | undefined

    if (currentTargetUser.banned) {
      return NextResponse.json(
        { error: 'Cannot change roles for a banned user. Please unban the user first.' },
        { status: 400 }
      )
    }

    if (currentRoles?.includes('admin') && !roles.includes('admin')) {
      let adminCount = 0
      let offset = 0
      const limit = 100
      
      while (true) {
        const usersResponse = await client.users.getUserList({ limit, offset })
        adminCount += usersResponse.data.filter(
          (u) => {
            const uRoles = u.privateMetadata?.roles as string[] | undefined
            const uRole = u.privateMetadata?.role as string | undefined
            return (uRoles && uRoles.includes('admin')) || uRole === 'admin'
          }
        ).length
        
        if (usersResponse.data.length < limit) break
        offset += limit
      }

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last admin role. At least one admin must exist.' },
          { status: 400 }
        )
      }
    }

    await client.users.updateUser(targetUserId, {
      privateMetadata: {
        ...currentTargetUser.privateMetadata,
        roles,
      },
    })

    return NextResponse.json({ data: { id: targetUserId, roles } })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    console.error('Failed to update role:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}
