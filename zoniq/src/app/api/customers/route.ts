import { NextRequest, NextResponse } from 'next/server';
import { eq, and, ilike, count, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { verifyAuth, hasRole } from '@/lib/auth';
import { createCustomerSchema } from '@/lib/validations/customer';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth();
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: authResult.error! } },
      { status: authResult.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)),
  );
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status'); // 'active' | 'inactive' | null (all)

  const conditions = [];

  // Status filter
  if (status === 'active') {
    conditions.push(eq(customers.isActive, true));
  } else if (status === 'inactive') {
    conditions.push(eq(customers.isActive, false));
  } else {
    // Default: show only active customers
    conditions.push(eq(customers.isActive, true));
  }

  // Search filter
  if (search) {
    conditions.push(ilike(customers.name, `%${search}%`));
  }

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(whereClause)
      .orderBy(desc(customers.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: count() }).from(customers).where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return NextResponse.json({
    data,
    meta: { page, pageSize, total },
  });
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth();
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: authResult.error! } },
      { status: authResult.status },
    );
  }

  // Only PM and Admin can create customers
  if (!hasRole(authResult, 'admin', 'pm')) {
    return NextResponse.json(
      {
        error: {
          code: 'FORBIDDEN',
          message: 'Only PMs and Admins can create customers',
        },
      },
      { status: 403 },
    );
  }

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

  const result = createCustomerSchema.safeParse(body);
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

  const [customer] = await db
    .insert(customers)
    .values({
      name: result.data.name,
      description: result.data.description ?? null,
      createdBy: authResult.userId!,
    })
    .returning();

  return NextResponse.json({ data: customer }, { status: 201 });
}
