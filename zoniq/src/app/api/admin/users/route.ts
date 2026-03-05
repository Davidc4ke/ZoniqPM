import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { USER_ROLES, DEFAULT_REDIRECT_URL } from '@/lib/constants'
import { verifyAdmin } from '@/lib/admin-auth'

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100),
  roles: z.array(z.enum(USER_ROLES)).min(1, 'At least one role is required'),
})

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_REDIRECT_URL
}

const USERS_PAGE_SIZE = 100

export async function GET(request: Request) {
  const authCheck = await verifyAdmin()
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(USERS_PAGE_SIZE), 10),
      500
    )
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const client = await clerkClient()
    const [usersResponse, invitationsResponse] = await Promise.all([
      client.users.getUserList({ limit, offset }),
      client.invitations.getInvitationList(),
    ])

    const users = usersResponse.data.map((user) => ({
      id: user.id,
      emailAddress: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      privateMetadata: user.privateMetadata,
      banned: user.banned,
      status: user.banned ? 'inactive' as const : 'active' as const,
      createdAt: user.createdAt,
    }))

    const pendingInvitations = invitationsResponse.data.map((invitation) => ({
      id: invitation.id,
      emailAddress: invitation.emailAddress,
      firstName: (invitation.publicMetadata?.firstName as string) || undefined,
      lastName: (invitation.publicMetadata?.lastName as string) || undefined,
      publicMetadata: { 
        roles: invitation.publicMetadata?.roles as string[] | undefined,
        role: invitation.publicMetadata?.role as string | undefined,
      },
      banned: false,
      status: 'pending' as const,
      createdAt: invitation.createdAt,
    }))

    const allUsers = [...users, ...pendingInvitations]

    const pendingCount = pendingInvitations.length
    const totalActiveCount = typeof usersResponse.totalCount === 'number' 
      ? usersResponse.totalCount 
      : users.length
    
    return NextResponse.json({
      users: allUsers,
      totalCount: totalActiveCount + pendingCount,
      hasMore: usersResponse.data.length === limit,
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const authCheck = await verifyAdmin()
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    )
  }

  try {
    const body = await request.json()
    const { email, name, roles } = createUserSchema.parse(body)

    const client = await clerkClient()

    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || undefined

    const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${getAppUrl()}/sign-in`,
      publicMetadata: {
        roles,
        firstName,
        lastName,
      },
    })

    return NextResponse.json({ data: invitation })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const clerkError = error as { errors?: Array<{ message?: string; code?: string }> }
    const errorCode = clerkError.errors?.[0]?.code
    const errorMessage = clerkError.errors?.[0]?.message

    const duplicateCodes = ['duplicate_record', 'form_identifier_exists']
    const duplicatePatterns = ['already', 'taken', 'duplicate', 'exists']

    if (errorCode && duplicateCodes.includes(errorCode)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    if (errorMessage) {
      const lower = errorMessage.toLowerCase()
      if (duplicatePatterns.some((p) => lower.includes(p))) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
    }

    console.error('Failed to create user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
