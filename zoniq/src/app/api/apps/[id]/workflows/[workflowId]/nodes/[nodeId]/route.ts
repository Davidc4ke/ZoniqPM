import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/mock-data'
import { getNodeDetail } from '@/lib/workflows/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; workflowId: string; nodeId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, nodeId } = await params
  const app = getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
    )
  }

  const detail = getNodeDetail(nodeId)
  if (!detail) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Node not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: detail })
}
