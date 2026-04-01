import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { clerkClient } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  const webhook = new Webhook(WEBHOOK_SECRET)

  let event
  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as {
      type: string
      data: {
        id: string
        email_addresses?: Array<{ email_address: string }>
        first_name?: string
        last_name?: string
        public_metadata?: { roles?: string[]; role?: string }
        private_metadata?: { roles?: string[] }
      }
    }
  } catch {
    console.error('Webhook verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, public_metadata } = event.data
    const email = email_addresses?.[0]?.email_address ?? ''
    const roles = public_metadata?.roles || (public_metadata?.role ? [public_metadata.role] : [])

    // Upsert user to database
    const now = new Date()
    await db
      .insert(users)
      .values({
        clerkId: id,
        email,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        roles,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          roles,
          updatedAt: now,
        },
      })

    if (public_metadata?.roles || public_metadata?.role) {
      try {
        const client = await clerkClient()
        await client.users.updateUser(id, {
          privateMetadata: {
            roles: public_metadata.roles || (public_metadata.role ? [public_metadata.role] : undefined),
          },
        })
        console.log(`[Webhook] Migrated roles to privateMetadata for user ${id}`)
      } catch (error) {
        console.error(`[Webhook] CRITICAL: Failed to migrate roles for user ${id}:`, error)
        console.error(`[Webhook] Manual intervention required - user ${id} has roles in publicMetadata but migration failed`)
      }
    }
  }

  if (event.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, private_metadata } = event.data
    const email = email_addresses?.[0]?.email_address ?? ''
    const roles = private_metadata?.roles ?? []

    await db
      .update(users)
      .set({
        email,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        roles,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, id))
  }

  if (event.type === 'user.deleted') {
    const { id } = event.data
    await db
      .update(users)
      .set({ status: 'deleted', updatedAt: new Date() })
      .where(eq(users.clerkId, id))
  }

  return NextResponse.json({ received: true })
}
