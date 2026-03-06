import { AssignedStoriesWidget } from '@/components/features/dashboard/assigned-stories-widget'
import { ReviewQueueWidget } from '@/components/features/dashboard/review-queue-widget'
import { ProjectsWidget } from '@/components/features/dashboard/projects-widget'
import { AppsWidget } from '@/components/features/dashboard/apps-widget'
import { TeamActivityWidget } from '@/components/features/dashboard/team-activity-widget'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-6">
      <div className="grid grid-cols-4 gap-5">
        <AssignedStoriesWidget />
        <ReviewQueueWidget />
        <ProjectsWidget />
        <AppsWidget />
      </div>
      
      <div className="mt-5">
        <TeamActivityWidget />
      </div>
    </div>
  )
}
