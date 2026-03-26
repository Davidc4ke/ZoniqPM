import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

export function getActiveProvider() {
  const provider = process.env.AI_PROVIDER

  if (provider === 'anthropic') {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
    return anthropic('claude-sonnet-4-20250514')
  }

  // Default: BigModel (OpenAI-compatible) for MVP
  const bigmodel = createOpenAI({
    apiKey: process.env.BIGMODEL_API_KEY,
    baseURL: process.env.BIGMODEL_BASE_URL,
  })
  return bigmodel('bigmodel-model')
}
