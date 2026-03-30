import { auth } from '@clerk/nextjs/server'
import { getCustomerById, updateCustomer, deleteCustomer } from '@/lib/customers/mock-data'
import { updateCustomerSchema } from '@/types/customer'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id } = await params
  const customer = getCustomerById(id)
  if (!customer) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: customer })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const parsed = updateCustomerSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  // TODO: Replace with database update
  const customer = updateCustomer(id, parsed.data)
  if (!customer) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Customer not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: customer })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id } = await params

  // TODO: Replace with database soft-delete
  const result = deleteCustomer(id)
  if (!result.success) {
    const isNotFound = result.error?.includes('not found')
    return Response.json(
      {
        error: {
          code: isNotFound ? 'NOT_FOUND' : 'DELETE_BLOCKED',
          message: result.error!,
        },
      },
      { status: isNotFound ? 404 : 409 }
    )
  }

  return Response.json({ data: { success: true } })
}
