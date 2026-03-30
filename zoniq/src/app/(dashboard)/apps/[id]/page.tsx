import { AppDetailClient } from './app-detail-client'

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <AppDetailClient appId={id} />
    </div>
  )
}
