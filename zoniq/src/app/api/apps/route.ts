import { auth } from '@clerk/nextjs/server'
import { getApps, createApp } from '@/lib/apps/queries'
import { createAppSchema } from '@/types/app'

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId') ?? undefined

  const apps = await getApps(customerId)
  return Response.json({ data: apps, meta: { total: apps.length } })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
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

  const parsed = createAppSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const result = await createApp(parsed.data, `org_${userId}`)
  if ('error' in result) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: result.error } },
      { status: 400 }
    )
  }

  return Response.json({ data: result }, { status: 201 })
}
