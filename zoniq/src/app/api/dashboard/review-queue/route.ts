import { auth } from '@clerk/nextjs/server'
import { getReviewQueue } from '@/lib/dashboard/mock-data'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  // TODO: Replace with database query for ready/review stories
  const stories = getReviewQueue()
  return Response.json({ data: stories, meta: { total: stories.length } })
}
