import { NextResponse } from 'next/server'
import { eq, isNull, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { verifyAuth, verifyPMOrAdmin } from '@/lib/auth-helpers'
import { updateCustomerSchema } from '@/types/customers'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth()
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: authResult.error! } },
      { status: authResult.status }
    )
  }

  const { id } = await params

  const [customer] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, id),
        eq(customers.organizationId, authResult.organizationId!),
        isNull(customers.deletedAt)
      )
    )

  if (!customer) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 }
    )
  }

  // TODO: When apps table exists, include linked apps here
  return NextResponse.json({ data: { ...customer, apps: [] } })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyPMOrAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: authResult.error! } },
      { status: authResult.status }
    )
  }

  const { id } = await params
  const body = await request.json()
  const parsed = updateCustomerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues } },
      { status: 400 }
    )
  }

  const [existing] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, id),
        eq(customers.organizationId, authResult.organizationId!),
        isNull(customers.deletedAt)
      )
    )

  if (!existing) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 }
    )
  }

  const [updated] = await db
    .update(customers)
    .set({
      ...(parsed.data.name !== undefined && { name: parsed.data.name }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
    })
    .where(eq(customers.id, id))
    .returning()

  return NextResponse.json({ data: updated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyPMOrAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: authResult.error! } },
      { status: authResult.status }
    )
  }

  const { id } = await params

  const [existing] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, id),
        eq(customers.organizationId, authResult.organizationId!),
        isNull(customers.deletedAt)
      )
    )

  if (!existing) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 }
    )
  }

  // TODO: When apps table exists, check for linked apps
  // For now, always allow deletion since apps table doesn't exist yet
  // const linkedApps = await db.select().from(apps).where(eq(apps.customerId, id))
  // if (linkedApps.length > 0) {
  //   return NextResponse.json(
  //     { error: { code: 'CONFLICT', message: 'Cannot delete customer with linked apps. Remove all apps first.' } },
  //     { status: 409 }
  //   )
  // }

  const [deleted] = await db
    .update(customers)
    .set({ deletedAt: new Date() })
    .where(eq(customers.id, id))
    .returning()

  return NextResponse.json({ data: deleted })
}
