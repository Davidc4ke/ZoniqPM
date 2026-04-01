'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGenerateModules } from '@/hooks/use-generate-modules'
import { useCreateModule } from '@/hooks/use-modules'
import type { ModuleSuggestion } from '@/types/ai'

interface GenerateModulesPanelProps {
  appId: string
  appName: string
  appDescription: string
  existingModuleNames: string[]
  isOpen: boolean
  onClose: () => void
}

export function GenerateModulesPanel({
  appId,
  appName,
  appDescription,
  existingModuleNames,
  isOpen,
  onClose,
}: GenerateModulesPanelProps) {
  const { suggestions, isGenerating, error, generate, reset } = useGenerateModules(appId)
  const createModule = useCreateModule(appId)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isAdding, setIsAdding] = useState(false)
  const [addedCount, setAddedCount] = useState(0)

  const triggerGenerate = useCallback(() => {
    setSelected(new Set())
    setAddedCount(0)
    generate(appName, appDescription, existingModuleNames)
  }, [generate, appName, appDescription, existingModuleNames])

  // Trigger generation when panel opens
  useEffect(() => {
    if (isOpen) {
      triggerGenerate()
    }
  }, [isOpen, triggerGenerate])

  const handleClose = () => {
    reset()
    setSelected(new Set())
    setAddedCount(0)
    onClose()
  }

  const toggleSelection = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectAll = () => {
    setSelected(new Set(suggestions.map((s) => s.id)))
  }

  const deselectAll = () => {
    setSelected(new Set())
  }

  const addSelectedModules = async () => {
    const toAdd = suggestions.filter((s) => selected.has(s.id))
    if (toAdd.length === 0) return

    setIsAdding(true)
    let count = 0
    for (const suggestion of toAdd) {
      try {
        await createModule.mutateAsync({
          name: suggestion.name,
          description: suggestion.description,
        })
        count++
      } catch {
        // Continue adding remaining modules even if one fails
      }
    }
    setAddedCount(count)
    setIsAdding(false)

    // Close panel after a brief delay to show success
    if (count > 0) {
      setTimeout(handleClose, 800)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" role="dialog" aria-label="AI Generate Modules">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      {/* Panel */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-xl animate-[slideInRight_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4E0] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B35]/10">
              <svg className="h-5 w-5 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#2D1810]">AI Generate Modules</h2>
              <p className="text-xs text-[#9A948D]">Suggested modules for {appName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#9A948D] transition-colors hover:bg-[#F5F2EF] hover:text-[#2D1810]"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8E4E0] border-t-[#FF6B35]" />
              <p className="mt-3 text-sm text-[#9A948D]">Analyzing app context and generating suggestions...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
              {error}
            </div>
          )}

          {addedCount > 0 && (
            <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 text-sm text-[#16A34A]">
              Successfully added {addedCount} module{addedCount !== 1 ? 's' : ''}!
            </div>
          )}

          {!isGenerating && !error && suggestions.length > 0 && addedCount === 0 && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-[#9A948D]">
                  {suggestions.length} module{suggestions.length !== 1 ? 's' : ''} suggested
                </p>
                <button
                  onClick={selected.size === suggestions.length ? deselectAll : selectAll}
                  className="text-xs font-medium text-[#FF6B35] hover:underline"
                >
                  {selected.size === suggestions.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isSelected={selected.has(suggestion.id)}
                    onToggle={() => toggleSelection(suggestion.id)}
                  />
                ))}
              </div>
            </>
          )}

          {!isGenerating && !error && suggestions.length === 0 && addedCount === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-[#9A948D]">No new modules to suggest.</p>
              <p className="mt-1 text-xs text-[#9A948D]">All common modules already exist for this app.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isGenerating && suggestions.length > 0 && addedCount === 0 && (
          <div className="border-t border-[#E8E4E0] px-6 py-4">
            <div className="flex gap-2">
              <button
                onClick={triggerGenerate}
                disabled={isAdding}
                className="flex-1 rounded-lg border border-[#E8E4E0] px-4 py-2.5 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:opacity-50"
              >
                Regenerate
              </button>
              <button
                onClick={addSelectedModules}
                disabled={selected.size === 0 || isAdding}
                className="flex-1 rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E55A2B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding
                  ? 'Adding...'
                  : selected.size === suggestions.length
                    ? `Add All (${suggestions.length})`
                    : `Add Selected (${selected.size})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SuggestionCard({
  suggestion,
  isSelected,
  onToggle,
}: {
  suggestion: ModuleSuggestion
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        isSelected
          ? 'border-[#FF6B35] bg-[#FFF7ED] shadow-sm'
          : 'border-[#E8E4E0] bg-white hover:border-[#FF6B35]/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
            isSelected
              ? 'border-[#FF6B35] bg-[#FF6B35]'
              : 'border-[#D1D5DB] bg-white'
          }`}
        >
          {isSelected && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#2D1810]">{suggestion.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#9A948D]">{suggestion.description}</p>
        </div>
      </div>
    </button>
  )
}
