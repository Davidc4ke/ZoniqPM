import { Widget } from './widget'
import { ActivityFeed, ActivityItem } from '@/components/features/activity-feed/activity-feed'

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'Aisha', initials: 'A', color: 'bg-[#10B981]' },
    action: 'moved',
    highlight: '#47',
    suffix: 'to Review',
    time: '2m ago',
  },
  {
    id: '2',
    user: { name: 'Marcus', initials: 'M', color: 'bg-[#F59E0B]' },
    action: 'created',
    highlight: '#62',
    suffix: '',
    time: '15m ago',
  },
  {
    id: '3',
    user: { name: 'Tom', initials: 'T', color: 'bg-[#8B5CF6]' },
    action: 'completed',
    highlight: '#44',
    suffix: '',
    time: '1h ago',
  },
  {
    id: '4',
    user: { name: 'Aisha', initials: 'A', color: 'bg-[#10B981]' },
    action: 'generated Dev Plan for',
    highlight: '#52',
    suffix: '',
    time: '2h ago',
  },
  {
    id: '5',
    user: { name: 'David', initials: 'D', color: 'bg-[#FF6B35]' },
    action: 'approved',
    highlight: '#40',
    suffix: '',
    time: '3h ago',
  },
]

export function TeamActivityWidget() {
  return (
    <Widget
      title="Team Activity — Today"
      icon={
        <svg className="h-4 w-4 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      }
    >
      <ActivityFeed activities={mockActivity} />
    </Widget>
  )
}
