import { AppDetailTabs } from '@/components/features/apps/app-detail-tabs'

// Mock app data — same source as the API route
const mockApps: Record<string, { id: string; name: string; customer: string; description: string }> = {
  '1': { id: '1', name: 'Claims Portal', customer: 'Acme Insurance', description: 'Customer-facing claims submission and tracking portal' },
  '2': { id: '2', name: 'Invoicing', customer: 'Acme Insurance', description: 'Internal invoicing and billing management system' },
  '3': { id: '3', name: 'Customer Portal', customer: 'Beta Corp', description: 'Self-service customer management portal' },
  '4': { id: '4', name: 'Reporting Service', customer: 'Beta Corp', description: 'Automated reporting and analytics dashboard' },
  '5': { id: '5', name: 'Mobile Companion', customer: 'Gamma Ltd', description: 'Mobile companion app for field agents' },
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const app = mockApps[id]

  if (!app) {
    return (
      <div className="mx-auto max-w-[1280px] px-8 py-20 text-center">
        <h1 className="text-xl font-bold text-[#2D1810]">App not found</h1>
        <p className="mt-2 text-sm text-[#9A948D]">The app you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }

  return (
    <AppDetailTabs
      appId={app.id}
      appName={app.name}
      customer={app.customer}
      description={app.description}
    />
  )
}
