import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/queries'
import { getFeatureTestItems } from '@/lib/test-coverage/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; featureId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, featureId } = await params
  const app = await getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
    )
  }

  const items = getFeatureTestItems(featureId)
  return Response.json({ data: items, meta: { total: items.length } })
}
