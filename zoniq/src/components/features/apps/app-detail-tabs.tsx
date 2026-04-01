'use client'

import { useState } from 'react'
import { WorkflowsTab } from './workflows-tab'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'modules', label: 'Modules' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'context', label: 'Context' },
  { id: 'projects', label: 'Projects' },
  { id: 'metrics', label: 'Metrics' },
] as const

type TabId = (typeof tabs)[number]['id']

interface AppDetailTabsProps {
  appId: string
  appName: string
  customer: string
  description: string
}

export function AppDetailTabs({ appId, appName, customer, description }: AppDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('workflows')

  return (
    <div>
      {/* App Header */}
      <div className="border-b border-[#E5E2DD] bg-white">
        <div className="mx-auto max-w-[1280px] px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-[#9A948D]">
            <a href="/dashboard" className="hover:text-[#2D1810] transition-colors">Dashboard</a>
            <span>/</span>
            <span>Apps</span>
            <span>/</span>
            <span className="text-[#2D1810] font-medium">{appName}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-[#2D1810]">{appName}</h1>
          <p className="mt-1 text-sm text-[#9A948D]">
            {customer} &middot; {description}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E2DD] bg-white">
        <div className="mx-auto max-w-[1280px] px-8">
          <nav className="flex gap-1" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#FF6B35]'
                    : 'text-[#9A948D] hover:text-[#2D1810]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#FF6B35] rounded-t" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-[1280px] px-8 py-6">
        {activeTab === 'workflows' && <WorkflowsTab appId={appId} />}
        {activeTab === 'overview' && (
          <div className="rounded-xl border border-[#E5E2DD] bg-white p-12 text-center">
            <p className="text-sm text-[#9A948D]">Overview tab — coming soon</p>
          </div>
        )}
        {activeTab === 'modules' && (
          <div className="rounded-xl border border-[#E5E2DD] bg-white p-12 text-center">
            <p className="text-sm text-[#9A948D]">Modules tab — coming soon</p>
          </div>
        )}
        {activeTab === 'context' && (
          <div className="rounded-xl border border-[#E5E2DD] bg-white p-12 text-center">
            <p className="text-sm text-[#9A948D]">Context tab — coming soon</p>
          </div>
        )}
        {activeTab === 'projects' && (
          <div className="rounded-xl border border-[#E5E2DD] bg-white p-12 text-center">
            <p className="text-sm text-[#9A948D]">Projects tab — coming soon</p>
          </div>
        )}
        {activeTab === 'metrics' && (
          <div className="rounded-xl border border-[#E5E2DD] bg-white p-12 text-center">
            <p className="text-sm text-[#9A948D]">Metrics &amp; Logs tab — coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
