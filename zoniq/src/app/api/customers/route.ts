import { auth } from '@clerk/nextjs/server'
import { getCustomers, createCustomer } from '@/lib/customers/mock-data'
import { createCustomerSchema } from '@/types/customer'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  // TODO: Replace with database query filtered by organization
  const customers = getCustomers()
  return Response.json({ data: customers, meta: { total: customers.length } })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const parsed = createCustomerSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  // TODO: Replace with database insert, use real organizationId from Clerk
  const customer = createCustomer(parsed.data, `org_${userId}`)
  return Response.json({ data: customer }, { status: 201 })
}
