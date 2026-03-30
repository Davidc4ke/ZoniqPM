'use client'

import { useEffect } from 'react'
import { useAIChat } from '@/hooks/use-ai-chat'
import { UniversalInput } from '@/components/features/ai-chat/universal-input'
import { ChatOverlay } from '@/components/features/ai-chat/chat-overlay'
import { AssignedStoriesWidget } from '@/components/features/dashboard/assigned-stories-widget'
import { ReviewQueueWidget } from '@/components/features/dashboard/review-queue-widget'
import { ProjectsWidget } from '@/components/features/dashboard/projects-widget'
import { AppsWidget } from '@/components/features/dashboard/apps-widget'
import { TeamActivityWidget } from '@/components/features/dashboard/team-activity-widget'

interface DashboardClientProps {
  userInitials: string
}

export function DashboardClient({ userInitials }: DashboardClientProps) {
  const { messages, isLoading, isOverlayOpen, openChat, closeChat, sendMessage } = useAIChat()

  // Listen for topbar chat button event
  useEffect(() => {
    const handler = () => openChat()
    window.addEventListener('zoniq:open-chat', handler)
    return () => window.removeEventListener('zoniq:open-chat', handler)
  }, [openChat])

  const handleHeroSubmit = (query: string) => {
    openChat(query)
  }

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-8 py-6">
        <UniversalInput onSubmit={handleHeroSubmit} />

        <div className="mt-5 grid grid-cols-4 gap-5">
          <AssignedStoriesWidget />
          <ReviewQueueWidget />
          <ProjectsWidget />
          <AppsWidget />
        </div>

        <div className="mt-5">
          <TeamActivityWidget />
        </div>
      </div>

      <ChatOverlay
        isOpen={isOverlayOpen}
        messages={messages}
        isLoading={isLoading}
        onClose={closeChat}
        onSendMessage={sendMessage}
        userInitials={userInitials}
      />
    </>
  )
}
