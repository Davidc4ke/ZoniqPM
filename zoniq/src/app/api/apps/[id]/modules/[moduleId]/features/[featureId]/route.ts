import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/mock-data'
import { getModuleById } from '@/lib/modules/mock-data'
import { getFeatureById, updateFeature, deleteFeature, getLinkedStoriesByFeatureId } from '@/lib/features/mock-data'
import { updateFeatureSchema } from '@/types/feature'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string; featureId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, moduleId, featureId } = await params
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

  const feat = getFeatureById(featureId)
  if (!feat || feat.moduleId !== moduleId) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Feature not found' } },
      { status: 404 }
    )
  }

  const linkedStories = getLinkedStoriesByFeatureId(featureId)
  return Response.json({ data: { ...feat, linkedStories } })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string; featureId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, moduleId, featureId } = await params
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

  const parsed = updateFeatureSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const feat = updateFeature(featureId, parsed.data)
  if (!feat || feat.moduleId !== moduleId) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Feature not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: feat })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string; featureId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, moduleId, featureId } = await params
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

  const result = deleteFeature(featureId)
  if (!result.success) {
    if (result.error?.includes('linked stories')) {
      return Response.json(
        { error: { code: 'HAS_DEPENDENCIES', message: result.error } },
        { status: 400 }
      )
    }
    return Response.json(
      { error: { code: 'NOT_FOUND', message: result.error || 'Feature not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: { success: true } })
}
