'use client'

import { useRouter } from 'next/navigation'
import { Widget } from './widget'
import { StoryCard } from './story-card'
import { WidgetSkeleton } from './widget-skeleton'
import { useReviewQueue } from '@/hooks/use-dashboard'

export function ReviewQueueWidget() {
  const router = useRouter()
  const { data, isLoading } = useReviewQueue()

  const stories = data?.data
  const total = data?.meta?.total

  return (
    <Widget
      title="Review Queue"
      icon={
        <svg className="h-4 w-4 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      }
      count={total}
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
