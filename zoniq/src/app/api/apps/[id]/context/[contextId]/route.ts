import { auth } from '@clerk/nextjs/server'
import { updateContext, deleteContext } from '@/lib/contexts/queries'
import { updateContextSchema } from '@/types/context'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; contextId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { contextId } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const parsed = updateContextSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const context = await updateContext(contextId, parsed.data)
  if (!context) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Context not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: context })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; contextId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { contextId } = await params

  const result = await deleteContext(contextId)
  if (!result.success) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: result.error! } },
      { status: 404 }
    )
  }

  return Response.json({ data: { success: true } })
}
