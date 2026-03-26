import { createOpenAI } from '@ai-sdk/openai'

export function createBigModelProvider() {
  return createOpenAI({
    apiKey: process.env.BIGMODEL_API_KEY,
    baseURL: process.env.BIGMODEL_BASE_URL,
  })('bigmodel-model')
}
