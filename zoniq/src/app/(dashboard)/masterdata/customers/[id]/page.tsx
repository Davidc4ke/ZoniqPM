import { CustomerDetailClient } from './customer-detail-client'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <CustomerDetailClient customerId={id} />
    </div>
  )
}
