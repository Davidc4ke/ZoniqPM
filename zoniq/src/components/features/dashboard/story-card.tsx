import { cn } from '@/lib/utils'

export interface Story {
  id: string
  number: number
  title: string
  description?: string
  status: 'backlog' | 'ready' | 'in-progress' | 'review' | 'testing' | 'done'
  priority: 'high' | 'medium' | 'low'
  projectName: string
  assignee?: {
    id: string
    name: string
    initials: string
  }
}

interface StoryCardProps {
  story: Story
  onClick?: () => void
}

const priorityColors = {
  high: 'bg-[#EF4444]',
  medium: 'bg-[#F59E0B]',
  low: 'bg-[#9A948D]',
}

const statusStyles = {
  backlog: 'bg-[#9A948D]/10 text-[#9A948D]',
  ready: 'bg-[#10B981]/10 text-[#10B981]',
  'in-progress': 'bg-[#F59E0B]/10 text-[#F59E0B]',
  review: 'bg-[#2563EB]/10 text-[#2563EB]',
  testing: 'bg-[#9333EA]/10 text-[#9333EA]',
  done: 'bg-[#10B981]/10 text-[#10B981]',
}

const statusLabels = {
  backlog: 'Backlog',
  ready: 'Ready',
  'in-progress': 'In Progress',
  review: 'In Review',
  testing: 'Testing',
  done: 'Done',
}

export function StoryCard({ story, onClick }: StoryCardProps) {
  return (
    <div
      data-testid="story-card"
      onClick={onClick}
      className={cn(
        'rounded-lg border border-[#E8E4E0] bg-[#F5F2EF] p-3 transition-all hover:border-[#FF6B35] hover:shadow-sm',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('h-2 w-2 shrink-0 rounded-full', priorityColors[story.priority])} />
          <span className="font-semibold text-sm text-[#2D1810] truncate">
            #{story.number} {story.title}
          </span>
        </div>
        {story.assignee && (
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white text-xs font-semibold"
            title={story.assignee.name}
          >
            {story.assignee.initials}
          </div>
        )}
      </div>
      
      {story.description && (
        <p className="mt-1.5 text-xs text-[#9A948D] line-clamp-2 pl-4">
          {story.description}
        </p>
      )}
      
      <div className="mt-2 flex items-center justify-between gap-2 pl-4">
        <span className="flex items-center gap-1.5 text-xs text-[#9A948D]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
          {story.projectName}
        </span>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusStyles[story.status])}>
          {statusLabels[story.status]}
        </span>
      </div>
    </div>
  )
}
