import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/mock-data'
import { getWorkflowDetail } from '@/lib/workflows/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; workflowId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { id, workflowId } = await params
  const app = getAppById(id)
  if (!app) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'App not found' } },
      { status: 404 }
    )
  }

  const detail = getWorkflowDetail(workflowId)
  if (!detail) {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: 'Workflow not found' } },
      { status: 404 }
    )
  }

  return Response.json({ data: detail })
}
