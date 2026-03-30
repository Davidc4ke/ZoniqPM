import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/mock-data'
import { getModuleById } from '@/lib/modules/mock-data'
import { getFeaturesByModuleId, createFeature } from '@/lib/features/mock-data'
import { createFeatureSchema } from '@/types/feature'

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

  const features = getFeaturesByModuleId(moduleId)
  return Response.json({ data: features, meta: { total: features.length } })
}

export async function POST(
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

  const mod = getModuleById(moduleId)
  if (!mod || mod.appId !== id) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Module not found' } },
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

  const parsed = createFeatureSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const feat = createFeature(moduleId, id, parsed.data)
  return Response.json({ data: feat }, { status: 201 })
}
