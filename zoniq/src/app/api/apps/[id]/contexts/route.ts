import { NextResponse } from 'next/server'
import type { ContextItem } from '@/types/context-item'
import { createContextItemSchema } from '@/types/context-item'

const mockContextItems: ContextItem[] = [
  {
    id: 'ctx-1',
    appId: 'app-1',
    name: 'Business Requirements Document',
    type: 'document',
    content: 'Full BRD for the Claims Management module covering all user stories and acceptance criteria.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'ctx-2',
    appId: 'app-1',
    name: 'Architecture Decision: Microflow vs Nanoflow',
    type: 'note',
    content: 'After evaluation, we decided to use Microflows for server-side logic and Nanoflows for client-side validation only. This keeps the architecture clean and testable.',
    createdAt: '2026-03-18T09:15:00Z',
    updatedAt: '2026-03-18T09:15:00Z',
  },
  {
    id: 'ctx-3',
    appId: 'app-1',
    name: 'Mendix Marketplace Widget Reference',
    type: 'url',
    content: 'https://marketplace.mendix.com/link/component/12345',
    createdAt: '2026-03-22T11:00:00Z',
    updatedAt: '2026-03-22T11:00:00Z',
  },
  {
    id: 'ctx-4',
    appId: 'app-1',
    name: 'Sprint 3 Retrospective Notes',
    type: 'note',
    content: 'Key takeaways: Need better test coverage for domain model changes. Team agreed to add UAT steps before moving stories to Done.',
    createdAt: '2026-03-25T16:00:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
  },
]

// In-memory store for mock CRUD
let contextItems = [...mockContextItems]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  void id
  return NextResponse.json({ data: contextItems, meta: { total: contextItems.length } })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const parsed = createContextItemSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ')
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  const now = new Date().toISOString()
  const newItem: ContextItem = {
    id: `ctx-${Date.now()}`,
    appId: id,
    name: parsed.data.name,
    type: parsed.data.type,
    content: parsed.data.content,
    createdAt: now,
    updatedAt: now,
  }

  contextItems = [newItem, ...contextItems]
  return NextResponse.json({ data: newItem }, { status: 201 })
}
