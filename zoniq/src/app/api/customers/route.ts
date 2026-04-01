import { NextResponse } from 'next/server'
import { eq, isNull, and, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { verifyAuth, verifyPMOrAdmin } from '@/lib/auth-helpers'
import { createCustomerSchema } from '@/types/customers'

export async function GET() {
  const authResult = await verifyAuth()
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: authResult.error! } },
      { status: authResult.status }
    )
  }

  const results = await db
    .select({
      id: customers.id,
      organizationId: customers.organizationId,
      name: customers.name,
      description: customers.description,
      createdAt: customers.createdAt,
      updatedAt: customers.updatedAt,
      deletedAt: customers.deletedAt,
      appCount: sql<number>`0`,
    })
    .from(customers)
    .where(
      and(
        eq(customers.organizationId, authResult.organizationId!),
        isNull(customers.deletedAt)
      )
    )
    .orderBy(customers.name)

  return NextResponse.json({ data: results })
}

export async function POST(request: Request) {
  const authResult = await verifyPMOrAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: authResult.error! } },
      { status: authResult.status }
    )
  }

  const body = await request.json()
  const parsed = createCustomerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues } },
      { status: 400 }
    )
  }

  const [created] = await db
    .insert(customers)
    .values({
      organizationId: authResult.organizationId!,
      name: parsed.data.name,
      description: parsed.data.description || null,
    })
    .returning()

  return NextResponse.json({ data: created }, { status: 201 })
}
