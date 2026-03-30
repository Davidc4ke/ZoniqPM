export function WidgetSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[#E8E4E0]" />
        <div className="h-5 w-8 animate-pulse rounded-full bg-[#E8E4E0]" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          data-testid="skeleton-row"
          className="h-16 w-full animate-pulse rounded-lg bg-[#E8E4E0]"
        />
      ))}
    </div>
  )
}
