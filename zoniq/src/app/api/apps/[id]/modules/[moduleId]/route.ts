import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/mock-data'
import { getModuleById, updateModule, deleteModule } from '@/lib/modules/mock-data'
import { updateModuleSchema } from '@/types/module'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, moduleId } = await params
  const app = getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
    )
  }

  const mod = getModuleById(moduleId)
  if (!mod || mod.appId !== id) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Module not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: mod })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, moduleId } = await params
  const app = getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
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

  const parsed = updateModuleSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const mod = updateModule(moduleId, parsed.data)
  if (!mod || mod.appId !== id) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Module not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: mod })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, moduleId } = await params
  const app = getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
    )
  }

  const result = deleteModule(moduleId)
  if (!result.success) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: result.error || 'Module not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: { success: true } })
}
