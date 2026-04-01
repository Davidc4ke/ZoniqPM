import { auth } from '@clerk/nextjs/server'
import { updateEnvironment, deleteEnvironment } from '@/lib/environments/queries'
import { updateEnvironmentSchema } from '@/types/environment'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; envId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { envId } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const parsed = updateEnvironmentSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const env = await updateEnvironment(envId, parsed.data)
  if (!env) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Environment not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: env })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; envId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { envId } = await params

  const result = await deleteEnvironment(envId)
  if (!result.success) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: result.error! } },
      { status: 404 }
    )
  }

  return Response.json({ data: { success: true } })
}
