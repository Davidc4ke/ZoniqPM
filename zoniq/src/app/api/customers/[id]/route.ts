import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { verifyAuth, hasRole } from '@/lib/auth';
import { updateCustomerSchema } from '@/lib/validations/customer';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await verifyAuth();
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: authResult.error! } },
      { status: authResult.status },
    );
  }

  const { id } = await params;

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);

  if (!customer) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: customer });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await verifyAuth();
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: authResult.error! } },
      { status: authResult.status },
    );
  }

  if (!hasRole(authResult, 'admin', 'pm')) {
    return NextResponse.json(
      {
        error: {
          code: 'FORBIDDEN',
          message: 'Only PMs and Admins can update customers',
        },
      },
      { status: 403 },
    );
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_JSON',
          message: 'Request body must be valid JSON',
        },
      },
      { status: 400 },
    );
  }

  const result = updateCustomerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: result.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  // Check customer exists
  const [existing] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 },
    );
  }

  const [updated] = await db
    .update(customers)
    .set({
      ...result.data,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, id))
    .returning();

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await verifyAuth();
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: authResult.error! } },
      { status: authResult.status },
    );
  }

  if (!hasRole(authResult, 'admin', 'pm')) {
    return NextResponse.json(
      {
        error: {
          code: 'FORBIDDEN',
          message: 'Only PMs and Admins can delete customers',
        },
      },
      { status: 403 },
    );
  }

  const { id } = await params;

  // Check customer exists
  const [existing] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 },
    );
  }

  // TODO: Check for linked apps when apps table exists (Story 2.2)
  // For now, soft-delete is always allowed since no apps table exists yet

  // Soft-delete: set isActive to false
  const [deleted] = await db
    .update(customers)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, id))
    .returning();

  return NextResponse.json({ data: deleted });
}
