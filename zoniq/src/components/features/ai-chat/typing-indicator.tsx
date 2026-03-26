'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div
        className="h-2 w-2 rounded-full bg-[#FF6B35]"
        style={{
          animation: 'typingBounce 1.4s infinite ease-in-out both',
          animationDelay: '-0.32s',
        }}
      />
      <div
        className="h-2 w-2 rounded-full bg-[#FF6B35]"
        style={{
          animation: 'typingBounce 1.4s infinite ease-in-out both',
          animationDelay: '-0.16s',
        }}
      />
      <div
        className="h-2 w-2 rounded-full bg-[#FF6B35]"
        style={{
          animation: 'typingBounce 1.4s infinite ease-in-out both',
          animationDelay: '0s',
        }}
      />
    </div>
  )
}
