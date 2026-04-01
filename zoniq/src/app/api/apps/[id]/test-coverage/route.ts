import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/queries'
import { getModuleCoverage } from '@/lib/test-coverage/mock-data'

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
  const app = await getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
    )
  }

  const coverage = getModuleCoverage(id)
  return Response.json({ data: coverage, meta: { total: coverage.length } })
}
