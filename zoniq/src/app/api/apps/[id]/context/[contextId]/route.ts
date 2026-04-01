import { auth } from '@clerk/nextjs/server'
import { updateContextItem, deleteContextItem } from '@/lib/context-items/queries'
import { updateContextItemSchema } from '@/types/context-item'

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

  const parsed = updateContextItemSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const item = await updateContextItem(contextId, parsed.data)
  if (!item) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Context item not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: item })
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

  const result = await deleteContextItem(contextId)
  if (!result.success) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: result.error! } },
      { status: 404 }
    )
  }

  return Response.json({ data: { success: true } })
}
