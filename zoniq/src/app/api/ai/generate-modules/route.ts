import { auth } from '@clerk/nextjs/server'
import { generateModuleSuggestions } from '@/lib/ai/module-generation-service'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  let body: { appId?: string; appName?: string; appDescription?: string; existingModules?: string[] }
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  if (!body.appId || !body.appName) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: 'appId and appName are required' } },
      { status: 400 }
    )
  }

  // TODO: Replace with real AI provider (Vercel AI SDK + Anthropic)
  const suggestions = generateModuleSuggestions(
    body.appName,
    body.appDescription ?? '',
    body.existingModules ?? []
  )

  return Response.json({ data: suggestions })
}
