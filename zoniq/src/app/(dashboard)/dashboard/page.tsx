import { AssignedStoriesWidget } from '@/components/features/dashboard/assigned-stories-widget'
import { ReviewQueueWidget } from '@/components/features/dashboard/review-queue-widget'
import { ProjectsWidget } from '@/components/features/dashboard/projects-widget'
import { TeamActivityWidget } from '@/components/features/dashboard/team-activity-widget'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <AssignedStoriesWidget />
        <ReviewQueueWidget />
        <ProjectsWidget />
      </div>
      
      <div className="mt-5">
        <TeamActivityWidget />
      </div>
    </div>
  )
}
