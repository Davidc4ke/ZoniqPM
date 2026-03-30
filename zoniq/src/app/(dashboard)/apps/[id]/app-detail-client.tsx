'use client'

import { AppDetail } from '@/components/features/app-detail/app-detail'

interface AppDetailClientProps {
  appId: string
}

export function AppDetailClient({ appId }: AppDetailClientProps) {
  return <AppDetail appId={appId} />
}
