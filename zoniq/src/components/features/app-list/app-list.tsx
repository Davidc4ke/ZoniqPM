'use client'

import Link from 'next/link'
import { useApps } from '@/hooks/use-apps'
import { AddAppDialog } from './add-app-dialog'
import type { App } from '@/types/app'

const statusColors: Record<string, string> = {
  active: 'bg-[#DCFCE7] text-[#16A34A]',
  inactive: 'bg-[#F3F4F6] text-[#6B7280]',
  'in-development': 'bg-[#DBEAFE] text-[#2563EB]',
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  'in-development': 'In Development',
}

function AppCard({ app }: { app: App }) {
  return (
    <Link
      href={`/apps/${app.id}`}
      className="block rounded-xl border border-[#E8E4E0] bg-[#EFF6FF] p-5 transition-all hover:border-[#2563EB] hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] text-white font-semibold text-sm">
            {app.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-[#2D1810]">{app.name}</h3>
            {app.description && (
              <p className="mt-0.5 text-sm text-[#9A948D] line-clamp-1">{app.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[app.status] ?? ''}`}>
            {statusLabels[app.status] ?? app.status}
          </span>
          <svg className="h-4 w-4 text-[#9A948D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

function AppListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-[#E8E4E0] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E8E4E0]" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-[#E8E4E0]" />
              <div className="h-3 w-60 rounded bg-[#E8E4E0]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface AppListProps {
  customerId: string
}

export function AppList({ customerId }: AppListProps) {
  const { data: apps, isLoading, isError, error } = useApps(customerId)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#2D1810]">Linked Apps</h3>
        <AddAppDialog customerId={customerId} />
      </div>

      {isLoading && <AppListSkeleton />}

      {isError && (
        <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
          {error?.message || 'Failed to load apps'}
        </div>
      )}

      {apps && apps.length === 0 && (
        <div className="rounded-xl border border-[#E8E4E0] bg-white p-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF]">
            <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#2D1810]">No apps yet</p>
          <p className="mt-1 text-xs text-[#9A948D]">Add an app to this customer</p>
        </div>
      )}

      {apps && apps.length > 0 && (
        <div className="space-y-3">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  )
}
