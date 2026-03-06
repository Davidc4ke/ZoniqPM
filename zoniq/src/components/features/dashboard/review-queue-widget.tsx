import { Widget } from './widget'
import { StoryCard } from './story-card'

const mockReviewStories = [
  {
    id: '4',
    number: 44,
    title: 'Login Flow',
    description: 'User authentication and session management',
    status: 'ready' as const,
    priority: 'high' as const,
    projectName: 'Claims Portal',
    assignee: { id: '1', name: 'Aisha', initials: 'A' },
  },
  {
    id: '5',
    number: 45,
    title: 'Dashboard',
    description: 'Main dashboard with widgets and charts',
    status: 'ready' as const,
    priority: 'medium' as const,
    projectName: 'Claims Portal',
    assignee: { id: '2', name: 'Marcus', initials: 'M' },
  },
  {
    id: '6',
    number: 46,
    title: 'API Integration',
    description: 'External API connections and data sync',
    status: 'ready' as const,
    priority: 'medium' as const,
    projectName: 'Policy Mgmt',
    assignee: { id: '1', name: 'Aisha', initials: 'A' },
  },
  {
    id: '7',
    number: 49,
    title: 'Search',
    description: 'Global search with filters and sorting',
    status: 'review' as const,
    priority: 'low' as const,
    projectName: 'Claims Portal',
    assignee: { id: '3', name: 'Tom', initials: 'T' },
  },
  {
    id: '8',
    number: 51,
    title: 'Notifications',
    description: 'Email and in-app notification system',
    status: 'ready' as const,
    priority: 'low' as const,
    projectName: 'Claims Portal',
    assignee: { id: '1', name: 'Aisha', initials: 'A' },
  },
]

export function ReviewQueueWidget() {
  return (
    <Widget
      title="Review Queue"
      icon={
        <svg className="h-4 w-4 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      }
      count={5}
    >
      <div className="space-y-3">
        {mockReviewStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </Widget>
  )
}
