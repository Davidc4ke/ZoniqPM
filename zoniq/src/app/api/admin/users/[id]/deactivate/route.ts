import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'

export async function POST(
  _request: Request,
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

    if (targetUserId === authCheck.userId) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    const client = await clerkClient()
    await client.users.banUser(targetUserId)

    return NextResponse.json({
      data: { id: targetUserId, status: 'inactive' }
    })
  } catch (error) {
    console.error('Failed to deactivate user:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate user' },
      { status: 500 }
    )
  }
}
