import { auth } from '@clerk/nextjs/server'
import { getAssignedStories } from '@/lib/dashboard/mock-data'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  // TODO: Replace with database query filtered by userId
  const stories = getAssignedStories()
  return Response.json({ data: stories })
}
