import { auth } from '@clerk/nextjs/server'
import { getProjects } from '@/lib/dashboard/mock-data'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  // TODO: Replace with database query for active projects
  const projects = getProjects()
  return Response.json({ data: projects })
}
