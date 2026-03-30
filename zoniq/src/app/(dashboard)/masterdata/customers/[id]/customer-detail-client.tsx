'use client'

import { CustomerDetail } from '@/components/features/customer-detail/customer-detail'

interface CustomerDetailClientProps {
  customerId: string
}

export function CustomerDetailClient({ customerId }: CustomerDetailClientProps) {
  return <CustomerDetail customerId={customerId} />
}
