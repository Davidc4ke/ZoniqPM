export type ChatIntent =
  | 'capture'
  | 'navigate'
  | 'query'
  | 'search'
  | 'action'
  | 'review'
  | 'create'
  | 'unknown'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  intent?: ChatIntent
}

export interface ChatRequest {
  message: string
  history: ChatMessage[]
}

export interface ChatActionButton {
  label: string
  href?: string
  action?: string
}

export interface ChatResponseMeta {
  intent: ChatIntent
  actions?: ChatActionButton[]
}
