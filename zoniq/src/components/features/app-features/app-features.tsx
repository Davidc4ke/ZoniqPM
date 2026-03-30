'use client'

import { useState, useCallback } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { FeatureCard } from './feature-card'
import { FeatureDialog } from './feature-dialog'
import { DeleteFeatureDialog } from './delete-feature-dialog'
import { FeatureDetailPanel } from './feature-detail-panel'
import type { Feature, LinkedStory } from '@/types/feature'

function FeaturesSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 rounded-xl bg-[#E8E4E0]" />
      ))}
    </div>
  )
}

interface AppFeaturesProps {
  appId: string
  moduleId: string
  moduleName: string
  onBack: () => void
}

export function AppFeatures({ appId, moduleId, moduleName, onBack }: AppFeaturesProps) {
  const { data: features, isLoading, isError, error } = useFeatures(appId, moduleId)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [deletingFeature, setDeletingFeature] = useState<Feature | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [linkedStories, setLinkedStories] = useState<LinkedStory[]>([])

  const handleFeatureClick = useCallback(async (feature: Feature) => {
    setSelectedFeature(feature)
    try {
      const response = await fetch(`/api/apps/${appId}/modules/${moduleId}/features/${feature.id}`)
      if (response.ok) {
        const json = await response.json()
        setLinkedStories(json.data.linkedStories ?? [])
      }
    } catch {
      setLinkedStories([])
    }
  }, [appId, moduleId])

  if (isLoading) return <FeaturesSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
        {error?.message || 'Failed to load features'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-lg p-1 text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-[#2D1810]">{moduleName} — Features</h2>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="rounded-lg bg-[#FF6B35] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B]"
        >
          Add Feature
        </button>
      </div>

      {selectedFeature ? (
        <FeatureDetailPanel
          feature={selectedFeature}
          linkedStories={linkedStories}
          onClose={() => {
            setSelectedFeature(null)
            setLinkedStories([])
          }}
          onEdit={(f) => {
            setSelectedFeature(null)
            setEditingFeature(f)
          }}
        />
      ) : features && features.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => (
            <FeatureCard
              key={feat.id}
              feature={feat}
              onEdit={(f) => setEditingFeature(f)}
              onDelete={(f) => setDeletingFeature(f)}
              onClick={handleFeatureClick}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E8E4E0] bg-[#F5F2EF] py-12 text-center">
          <p className="text-sm text-[#9A948D]">No features yet</p>
          <p className="mt-1 text-xs text-[#9A948D]">Add a feature to track granular functionality</p>
        </div>
      )}

      <FeatureDialog
        appId={appId}
        moduleId={moduleId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      <FeatureDialog
        appId={appId}
        moduleId={moduleId}
        isOpen={!!editingFeature}
        onClose={() => setEditingFeature(null)}
        feature={editingFeature}
      />

      <DeleteFeatureDialog
        appId={appId}
        moduleId={moduleId}
        feature={deletingFeature}
        isOpen={!!deletingFeature}
        onClose={() => setDeletingFeature(null)}
      />
    </div>
  )
}
