'use client'

import { useRouter } from 'next/navigation'
import { Widget } from './widget'
import { StoryCard } from './story-card'
import { WidgetSkeleton } from './widget-skeleton'
import { useAssignedStories } from '@/hooks/use-dashboard'

export function AssignedStoriesWidget() {
  const router = useRouter()
  const { data: stories, isLoading } = useAssignedStories()

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
      count={stories?.length}
    >
      {isLoading ? (
        <WidgetSkeleton rows={3} />
      ) : (
        <div className="space-y-3">
          {stories?.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => router.push(`/stories/${story.id}`)}
            />
          ))}
        </div>
      )}
    </Widget>
  )
}
