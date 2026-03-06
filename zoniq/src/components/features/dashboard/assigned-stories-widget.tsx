import { Widget } from './widget'
import { StoryCard } from './story-card'

const mockStories = [
  {
    id: '1',
    number: 47,
    title: 'Approval Workflow',
    description: 'Implement multi-level approval based on user role and amount',
    status: 'in-progress' as const,
    priority: 'high' as const,
    projectName: 'Claims Portal',
    assignee: { id: '1', name: 'Aisha', initials: 'A' },
  },
  {
    id: '2',
    number: 52,
    title: 'Export Feature',
    description: 'CSV and PDF export for reports',
    status: 'ready' as const,
    priority: 'medium' as const,
    projectName: 'Policy Management',
    assignee: { id: '1', name: 'Aisha', initials: 'A' },
  },
  {
    id: '3',
    number: 58,
    title: 'Form Validation',
    description: 'Client-side validation for all forms',
    status: 'in-progress' as const,
    priority: 'low' as const,
    projectName: 'Claims Portal',
    assignee: { id: '1', name: 'Aisha', initials: 'A' },
  },
]

export function AssignedStoriesWidget() {
  return (
    <Widget
      title="Assigned to You"
      icon={
        <svg className="h-4 w-4 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
        </svg>
      }
      count={3}
    >
      <div className="space-y-3">
        {mockStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </Widget>
  )
}
