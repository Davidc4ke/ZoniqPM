'use client'

interface WidgetProps {
  title: string
  icon: React.ReactNode
  count?: number
  countColor?: string
  actionText?: string
  onAction?: () => void
  children?: React.ReactNode
}

export function Widget({ title, icon, count, countColor = 'bg-[#E8E4E0] text-[#2D1810]', actionText, onAction, children }: WidgetProps) {
  return (
    <div className="rounded-xl border border-[#E8E4E0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D1810]">
          {icon}
          {title}
        </h3>
        {count !== undefined && (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${countColor}`}>
            {count}
          </span>
        )}
        {actionText && (
          <button
            onClick={onAction}
            className="text-xs font-medium text-[#FF6B35] hover:underline"
          >
            {actionText}
          </button>
        )}
      </div>
      {children || (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-[#9A948D]">
            {icon}
          </div>
          <p className="mt-2 text-sm text-[#9A948D]">No items</p>
        </div>
      )}
    </div>
  )
}
