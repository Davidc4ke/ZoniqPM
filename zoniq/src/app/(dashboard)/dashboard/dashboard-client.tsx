'use client'

import { useState, useCallback } from 'react'
import { AssignedStoriesWidget } from '@/components/features/dashboard/assigned-stories-widget'
import { ReviewQueueWidget } from '@/components/features/dashboard/review-queue-widget'
import { ProjectsWidget } from '@/components/features/dashboard/projects-widget'
import { AppsWidget } from '@/components/features/dashboard/apps-widget'
import { TeamActivityWidget } from '@/components/features/dashboard/team-activity-widget'
import { UniversalInput } from '@/components/features/universal-input/universal-input'
import { AIChatOverlay } from '@/components/features/ai-chat/ai-chat-overlay'

export function DashboardClient() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | undefined>()

  const handleInputSubmit = useCallback((query: string) => {
    setInitialMessage(query)
    setIsChatOpen(true)
  }, [])

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false)
    setInitialMessage(undefined)
  }, [])

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-8 py-6">
        {/* Hero AI Input */}
        <div className="mb-8 pt-4">
          <UniversalInput onSubmit={handleInputSubmit} />
        </div>

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

      <AIChatOverlay
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialMessage={initialMessage}
      />
    </>
  )
}
