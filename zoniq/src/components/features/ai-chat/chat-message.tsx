'use client'

import type { ChatMessage as ChatMessageType } from '@/types/ai'

interface ChatMessageProps {
  message: ChatMessageType
  userInitials?: string
}

export function ChatMessage({ message, userInitials = 'U' }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      data-testid={`chat-message-${message.role}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isUser ? 'bg-[#E8E4E0] text-[#2D1810]' : 'bg-[#FF6B35] text-white'
        }`}
      >
        {isUser ? userInitials : 'AI'}
      </div>
      <div
        className={`max-w-[70%] whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed ${
          isUser
            ? 'rounded-2xl rounded-br-sm border border-[#E8E4E0] bg-white'
            : 'rounded-2xl rounded-bl-sm border border-[#FF6B35]'
        }`}
        style={
          isUser
            ? undefined
            : { background: 'linear-gradient(135deg, #FFF7F3 0%, white 100%)' }
        }
      >
        {message.content}
      </div>
    </div>
  )
}
