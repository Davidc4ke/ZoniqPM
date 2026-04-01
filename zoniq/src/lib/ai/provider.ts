import { createOpenAI } from '@ai-sdk/openai'

export function getActiveProvider() {
  return createOpenAI({
    apiKey: process.env.BIGMODEL_API_KEY ?? '',
    baseURL: process.env.BIGMODEL_BASE_URL ?? 'https://open.bigmodel.cn/api/paas/v4',
  })('glm-4-flash')
}
