'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AssignedStoriesWidget } from '@/components/features/dashboard/assigned-stories-widget'
import { ReviewQueueWidget } from '@/components/features/dashboard/review-queue-widget'
import { ProjectsWidget } from '@/components/features/dashboard/projects-widget'
import { AppsWidget } from '@/components/features/dashboard/apps-widget'
import { TeamActivityWidget } from '@/components/features/dashboard/team-activity-widget'
import { UniversalInput } from '@/components/features/universal-input/universal-input'
import { ChatOverlay } from '@/components/features/ai-chat/chat-overlay'

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | undefined>()

  const handleOpenChat = useCallback((query: string) => {
    setInitialQuery(query)
    setIsChatOpen(true)
  }, [])

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false)
    setInitialQuery(undefined)
  }, [])

  // Listen for topbar AI chat button event
  useEffect(() => {
    const handler = () => {
      setIsChatOpen(true)
    }
    window.addEventListener('zoniq:open-ai-chat', handler)
    return () => window.removeEventListener('zoniq:open-ai-chat', handler)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {!isChatOpen && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto max-w-[1280px] px-8 py-6"
          >
            <div className="mb-8">
              <UniversalInput onSubmit={handleOpenChat} />
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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <ChatOverlay
            initialQuery={initialQuery}
            onClose={handleCloseChat}
          />
        )}
      </AnimatePresence>
    </>
  )
}
