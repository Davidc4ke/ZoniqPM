import { createAnthropic } from '@ai-sdk/anthropic'

export function createAnthropicProvider() {
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
  return anthropic('claude-sonnet-4-20250514')
}
