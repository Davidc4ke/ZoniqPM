import { auth } from '@clerk/nextjs/server'
import { generateMockResponse } from '@/lib/ai/chat-service'
import type { ChatMessage } from '@/types/ai'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  let body: { message?: string; history?: ChatMessage[] }
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  const message = body.message?.trim()
  if (!message) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Message is required and cannot be empty' } },
      { status: 400 }
    )
  }

  const history = body.history ?? []

  // TODO: Replace with real AI provider (Vercel AI SDK + Chinese Big Model / Anthropic)
  const { text, meta } = generateMockResponse(message, history)

  // Simulate streaming by emitting response character-by-character
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Send meta event first
      controller.enqueue(encoder.encode(`event: meta\ndata: ${JSON.stringify(meta)}\n\n`))

      // Stream text character by character with small delays
      const chars = text.split('')
      for (let i = 0; i < chars.length; i++) {
        controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify(chars[i])}\n\n`))
        // Add small delay for streaming effect (skip in test env for speed)
        if (typeof globalThis.process === 'undefined' || process.env.NODE_ENV !== 'test') {
          await new Promise((resolve) => setTimeout(resolve, 15))
        }
      }

      // Send done event
      controller.enqueue(encoder.encode('event: done\ndata: {}\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
