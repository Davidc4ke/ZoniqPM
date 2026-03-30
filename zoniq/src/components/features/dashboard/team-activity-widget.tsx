'use client'

import { Widget } from './widget'
import { WidgetSkeleton } from './widget-skeleton'
import { ActivityFeed } from '@/components/features/activity-feed/activity-feed'
import { useTeamActivity } from '@/hooks/use-dashboard'

export function TeamActivityWidget() {
  const { data: activities, isLoading } = useTeamActivity()

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
      {isLoading ? (
        <WidgetSkeleton rows={2} />
      ) : activities ? (
        <ActivityFeed activities={activities} />
      ) : null}
    </Widget>
  )
}
