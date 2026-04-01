'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/hooks/use-apps'
import { EditAppDialog } from './edit-app-dialog'
import { DeleteAppDialog } from './delete-app-dialog'
import { AppEnvironments } from '../app-environments/app-environments'
import { AppModules } from '../app-modules/app-modules'
import { AppTestCoverage } from '../app-test-coverage/app-test-coverage'
import { WorkflowsTab } from '../apps/workflows-tab'
import { LogsTab } from '../app-logs/logs-tab'
import { format } from 'date-fns'

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

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'environments', label: 'Environments' },
  { key: 'modules', label: 'Modules & Features' },
  { key: 'tests', label: 'Tests' },
  { key: 'workflows', label: 'Workflows' },
  { key: 'context', label: 'Context' },
  { key: 'projects', label: 'Projects' },
  { key: 'metrics', label: 'Metrics' },
] as const

type TabKey = (typeof tabs)[number]['key']

interface AppDetailProps {
  appId: string
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-[#E8E4E0]" />
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-[#E8E4E0]" />
          <div className="h-4 w-72 rounded bg-[#E8E4E0]" />
        </div>
      </div>
      <div className="h-32 rounded-xl bg-[#E8E4E0]" />
    </div>
  )
}

export function AppDetail({ appId }: AppDetailProps) {
  const { data: app, isLoading, isError, error } = useApp(appId)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load app'}
      </div>
    )
  }

  if (!app) {
    return (
      <div className="rounded-xl border border-[#E8E4E0] bg-white p-8 text-center">
        <p className="text-[#9A948D]">App not found</p>
        <Link href="/masterdata" className="mt-2 inline-block text-sm font-medium text-[#FF6B35] hover:underline">
          Back to masterdata
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href={`/masterdata/customers/${app.customerId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#9A948D] transition-colors hover:text-[#FF6B35]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {app.customerName}
      </Link>

      <div className="rounded-xl border border-[#E8E4E0] bg-white shadow-sm">
        {/* App Header */}
        <div className="border-b border-[#E8E4E0] bg-[#DBEAFE] p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2563EB] text-white text-xl font-bold">
                {app.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2D1810]">{app.name}</h1>
                {app.description && (
                  <p className="mt-1 text-sm text-[#2D1810]/70">{app.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="rounded-lg border border-[#E8E4E0] bg-white px-3 py-2 text-sm font-medium text-[#DC2626] transition-colors hover:border-[#DC2626] hover:bg-[#FEF2F2]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#E8E4E0] px-6">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-[#9A948D] hover:bg-[#F5F2EF]'
                }`}
                data-tab={tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Status</h3>
                  <p className="mt-1">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[app.status] ?? ''}`}>
                      {statusLabels[app.status] ?? app.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Version</h3>
                  <p className="mt-1 text-sm text-[#2D1810]">{app.version}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Mendix App ID</h3>
                  <p className="mt-1 text-sm text-[#2D1810] font-mono">{app.mendixAppId}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Customer</h3>
                  <p className="mt-1">
                    <Link
                      href={`/masterdata/customers/${app.customerId}`}
                      className="text-sm font-medium text-[#2563EB] hover:underline"
                    >
                      {app.customerName}
                    </Link>
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Created</h3>
                  <p className="mt-1 text-sm text-[#2D1810]">
                    {format(new Date(app.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Last Updated</h3>
                  <p className="mt-1 text-sm text-[#2D1810]">
                    {format(new Date(app.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9A948D]">Linked Projects</h3>
                  <p className="mt-1 text-sm text-[#2D1810]">
                    {app.linkedProjectsCount > 0
                      ? `${app.linkedProjectsCount} project${app.linkedProjectsCount !== 1 ? 's' : ''}`
                      : 'No projects linked'}
                  </p>
                </div>
              </div>

              {/* Modules Summary */}
              <div className="mt-8 rounded-lg border border-[#E8E4E0] bg-[#F9FAFB] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#2D1810]">Modules</h3>
                    <p className="mt-1 text-sm text-[#9A948D]">
                      {app.modulesCount > 0
                        ? `${app.modulesCount} module${app.modulesCount !== 1 ? 's' : ''} configured`
                        : 'No modules configured'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('modules')}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
                  >
                    View Modules
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'environments' && (
            <AppEnvironments appId={appId} />
          )}

          {activeTab === 'modules' && (
            <AppModules appId={appId} />
          )}

          {activeTab === 'tests' && (
            <AppTestCoverage appId={appId} />
          )}

          {activeTab === 'workflows' && (
            <WorkflowsTab appId={appId} />
          )}

          {activeTab === 'metrics' && (
            <LogsTab appId={appId} />
          )}

          {activeTab !== 'overview' && activeTab !== 'environments' && activeTab !== 'modules' && activeTab !== 'tests' && activeTab !== 'workflows' && activeTab !== 'metrics' && (
            <div className="py-12 text-center">
              <p className="text-sm text-[#9A948D]">
                {tabs.find((t) => t.key === activeTab)?.label} — Coming soon
              </p>
            </div>
          )}
        </div>
      </div>

      <EditAppDialog app={app} isOpen={showEdit} onClose={() => setShowEdit(false)} />
      <DeleteAppDialog app={app} isOpen={showDelete} onClose={() => setShowDelete(false)} />
    </div>
  )
}
