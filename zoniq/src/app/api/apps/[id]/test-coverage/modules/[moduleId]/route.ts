import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/queries'
import { getFeatureCoverage } from '@/lib/test-coverage/mock-data'

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
  const app = await getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
    )
  }

  const coverage = getFeatureCoverage(moduleId)
  return Response.json({ data: coverage, meta: { total: coverage.length } })
}
