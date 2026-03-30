import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

import { POST } from './route'
import { auth } from '@clerk/nextjs/server'

const mockedAuth = vi.mocked(auth)

async function readStreamedText(res: Response): Promise<string> {
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let raw = ''
  let done = false
  while (!done) {
    const result = await reader.read()
    done = result.done
    if (result.value) {
      raw += decoder.decode(result.value, { stream: true })
    }
  }
  // Parse SSE text events and reassemble the text
  const textChars = raw
    .split('\n')
    .filter((line) => line.startsWith('data: ') && !line.includes('"intent"'))
    .map((line) => {
      const data = line.slice(6)
      if (data === '{}') return ''
      try {
        return JSON.parse(data) as string
      } catch {
        return ''
      }
    })
  return textChars.join('')
}

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/ai/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer T> ? T : never)
  })

  it('returns 401 when not authenticated', async () => {
    mockedAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer T> ? T : never)
    const res = await POST(createRequest({ message: 'test', history: [] }))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error.code).toBe('UNAUTHORIZED')
  })

  it('returns 400 when message is missing', async () => {
    const res = await POST(createRequest({ history: [] }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 400 when message is empty', async () => {
    const res = await POST(createRequest({ message: '  ', history: [] }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns streamed response for valid request', async () => {
    const res = await POST(createRequest({ message: "What's blocked?", history: [] }))
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/event-stream')

    const assembledText = await readStreamedText(res)
    expect(assembledText).toContain('blocked')
  })

  it('returns streamed response for navigate command', async () => {
    const res = await POST(createRequest({ message: 'Open #47', history: [] }))
    expect(res.status).toBe(200)

    const assembledText = await readStreamedText(res)
    expect(assembledText).toContain('#47')
  })
})
