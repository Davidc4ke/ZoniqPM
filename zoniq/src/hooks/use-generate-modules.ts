'use client'

import { useState, useCallback } from 'react'
import type { ModuleSuggestion } from '@/types/ai'

interface GenerateModulesState {
  suggestions: ModuleSuggestion[]
  isGenerating: boolean
  error: string | null
}

export function useGenerateModules(appId: string) {
  const [state, setState] = useState<GenerateModulesState>({
    suggestions: [],
    isGenerating: false,
    error: null,
  })

  const generate = useCallback(
    async (appName: string, appDescription: string, existingModules: string[]) => {
      setState({ suggestions: [], isGenerating: true, error: null })

      try {
        const response = await fetch('/api/ai/generate-modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId, appName, appDescription, existingModules }),
        })

        if (!response.ok) {
          const body = await response.json().catch(() => null)
          throw new Error(body?.error?.message || 'Failed to generate modules')
        }

        const json = await response.json()
        setState({ suggestions: json.data, isGenerating: false, error: null })
      } catch (err) {
        setState({
          suggestions: [],
          isGenerating: false,
          error: err instanceof Error ? err.message : 'Failed to generate modules',
        })
      }
    },
    [appId]
  )

  const reset = useCallback(() => {
    setState({ suggestions: [], isGenerating: false, error: null })
  }, [])

  return {
    suggestions: state.suggestions,
    isGenerating: state.isGenerating,
    error: state.error,
    generate,
    reset,
  }
}
