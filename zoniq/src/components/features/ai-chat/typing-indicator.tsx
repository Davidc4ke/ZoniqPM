'use client'

export function TypingIndicator() {
  return (
    <div className="flex gap-3" data-testid="typing-indicator">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-semibold text-white">
        AI
      </div>
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#FF6B35] px-5 py-4"
        style={{ background: 'linear-gradient(135deg, #FFF7F3 0%, white 100%)' }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-2 w-2 rounded-full bg-[#FF6B35]"
            style={{
              animation: 'typingBounce 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
