export interface ActivityUser {
  name: string
  initials: string
  color: string
}

export interface ActivityItem {
  id: string
  user: ActivityUser
  action: string
  highlight: string
  suffix?: string
  time: string
}

export interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

export function ActivityFeed({ activities, className = '' }: ActivityFeedProps) {
  return (
    <div className={`flex gap-3 overflow-x-auto pb-2 ${className}`}>
      {activities.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-lg bg-[#F5F2EF] px-4 py-2.5 whitespace-nowrap"
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-semibold ${item.user.color}`}
          >
            {item.user.initials}
          </div>
          <span className="text-sm text-[#2D1810]">
            {item.user.name} {item.action} <strong>{item.highlight}</strong>{' '}
            {item.suffix}
          </span>
          <span className="text-xs text-[#9A948D] shrink-0">{item.time}</span>
        </div>
      ))}
    </div>
  )
}
