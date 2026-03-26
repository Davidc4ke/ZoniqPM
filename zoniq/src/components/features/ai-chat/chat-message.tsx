'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { UIMessage } from 'ai'
import { TypingIndicator } from './typing-indicator'

interface ChatMessageProps {
  message: UIMessage
  isStreaming?: boolean
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

function extractStoryReferences(content: string): number[] {
  const matches = content.match(/#(\d+)/g)
  if (!matches) return []
  return [...new Set(matches.map((m) => parseInt(m.slice(1), 10)))]
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const router = useRouter()

  const textContent = useMemo(() => getTextContent(message), [message])

  const storyRefs = useMemo(() => {
    if (isUser || !textContent) return []
    return extractStoryReferences(textContent)
  }, [isUser, textContent])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isUser
            ? 'bg-[#E8E4E0] text-[#2D1810]'
            : 'bg-[#FF6B35] text-white'
        }`}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[70%] px-5 py-4 text-sm ${
          isUser
            ? 'rounded-[16px_16px_4px_16px] border border-[#E8E4E0] bg-white'
            : 'rounded-[16px_16px_16px_4px] border border-[#FF6B35]'
        }`}
        style={
          isUser
            ? undefined
            : { background: 'linear-gradient(135deg, #FFF7F3, white)' }
        }
      >
        {textContent ? (
          <>
            <div className="whitespace-pre-wrap text-[#2D1810]">
              {textContent}
            </div>
            {storyRefs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-[#E8E4E0] pt-3">
                {storyRefs.map((ref) => (
                  <button
                    key={ref}
                    onClick={() => router.push(`/stories/${ref}`)}
                    className="flex items-center gap-1 rounded-md border border-[#E8E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[#FF6B35] transition-colors hover:border-[#FF6B35] hover:bg-[#FFF7F3]"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Story #{ref}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : isStreaming ? (
          <TypingIndicator />
        ) : null}
      </div>
    </motion.div>
  )
}
