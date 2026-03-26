import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8F5A] text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-[#F5F2EF] text-[#2D1810]'
            : 'bg-white text-[#2D1810] shadow-sm ring-1 ring-[#E8E4E0]'
        )}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8F5A] text-white">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#E8E4E0]">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9A948D] [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9A948D] [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9A948D] [animation-delay:300ms]" />
      </div>
    </div>
  )
}
