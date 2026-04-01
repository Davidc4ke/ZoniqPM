import { auth } from '@clerk/nextjs/server'
import type { LogEntry, LogLevel } from '@/types/log'

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

function generateMockLogs(count: number): LogEntry[] {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)]
    const msgs = messages[level]
    return {
      id: `log_${now}_${i}`,
      timestamp: new Date(now - (count - i) * 2000).toISOString(),
      level,
      message: msgs[Math.floor(Math.random() * msgs.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
    }
  })
}

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

  await params // validate route param exists

  const logs = generateMockLogs(30)
  return Response.json({ data: logs })
}
