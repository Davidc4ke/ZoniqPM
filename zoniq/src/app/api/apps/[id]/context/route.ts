import { auth } from '@clerk/nextjs/server'
import { getAppById } from '@/lib/apps/queries'
import type { ContextItem } from '@/types/app-context'
import { createContextItemSchema } from '@/types/app-context'

const mockContextItems: ContextItem[] = [
  {
    id: 'ctx-1',
    appId: 'mock-app',
    title: 'Claims Module Business Rules',
    type: 'note',
    content: 'All claims must be validated against the policy coverage limits before being assigned to an adjuster. Auto-reject claims older than 90 days from incident date.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'ctx-2',
    appId: 'mock-app',
    title: 'API Integration Spec v2.1',
    type: 'document',
    content: 'Integration specification for connecting to the external payment gateway. Covers authentication, request/response formats, and error handling procedures.',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
  },
  {
    id: 'ctx-3',
    appId: 'mock-app',
    title: 'Mendix Best Practices Wiki',
    type: 'url',
    content: 'https://docs.mendix.com/howto/best-practices',
    createdAt: '2026-03-05T16:00:00Z',
    updatedAt: '2026-03-05T16:00:00Z',
  },
  {
    id: 'ctx-4',
    appId: 'mock-app',
    title: 'Sprint 4 Retrospective Notes',
    type: 'note',
    content: 'Key takeaways: improve test coverage on microflow actions, reduce page load time on the dashboard, and standardize error handling across all REST endpoints.',
    createdAt: '2026-02-28T11:00:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
  },
  {
    id: 'ctx-5',
    appId: 'mock-app',
    title: 'Customer Onboarding Flow Diagram',
    type: 'document',
    content: 'Visual diagram of the customer onboarding process including identity verification, account setup, and initial policy configuration steps.',
    createdAt: '2026-02-20T13:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },
]

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

  const items = mockContextItems.map((item) => ({ ...item, appId: id }))
  return Response.json({ data: items, meta: { total: items.length } })
}

export async function POST(
  request: Request,
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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const parsed = createContextItemSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const now = new Date().toISOString()
  const newItem: ContextItem = {
    id: `ctx-${Date.now()}`,
    appId: id,
    title: parsed.data.title,
    type: parsed.data.type,
    content: parsed.data.content,
    createdAt: now,
    updatedAt: now,
  }

  mockContextItems.push(newItem)
  return Response.json({ data: newItem }, { status: 201 })
}
