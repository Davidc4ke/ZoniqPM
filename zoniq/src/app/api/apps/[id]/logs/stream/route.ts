import { auth } from '@clerk/nextjs/server'
import type { LogLevel } from '@/types/log'

const sources = ['AppController', 'AuthModule', 'DatabaseService', 'CacheLayer', 'APIGateway', 'Scheduler']
const levels: LogLevel[] = ['info', 'warn', 'error', 'debug']
const messages: Record<LogLevel, string[]> = {
  info: [
    'Request processed successfully',
    'User session started',
    'Cache refreshed',
    'Scheduled task completed',
    'Health check passed',
  ],
  warn: [
    'Slow query detected (>500ms)',
    'Rate limit threshold at 80%',
    'Deprecated API version used',
    'Memory usage above 70%',
  ],
  error: [
    'Connection timeout after 30s',
    'Failed to parse configuration',
    'Authentication token expired',
    'Unhandled exception in worker',
  ],
  debug: [
    'Entering request pipeline',
    'Cache miss for key user:session',
    'Retrying operation (attempt 2/3)',
    'GC pause: 12ms',
  ],
}

let logCounter = 0

export async function GET(
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

  await params

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(() => {
        const level = levels[Math.floor(Math.random() * levels.length)]
        const msgs = messages[level]
        const entry = {
          id: `log_stream_${Date.now()}_${++logCounter}`,
          timestamp: new Date().toISOString(),
          level,
          message: msgs[Math.floor(Math.random() * msgs.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
        }
        try {
          controller.enqueue(
            encoder.encode(`event: log\ndata: ${JSON.stringify(entry)}\n\n`)
          )
        } catch {
          clearInterval(interval)
        }
      }, 1500 + Math.random() * 2000)

      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        try {
          controller.close()
        } catch {
          // already closed
        }
      })
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
