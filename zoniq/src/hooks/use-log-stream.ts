'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { LogEntry } from '@/types/log'

const MAX_LOGS = 500

export function useLogStream(appId: string) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLive, setIsLive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const isLiveRef = useRef(false)

  // Fetch initial logs
  useEffect(() => {
    let cancelled = false
    async function fetchInitialLogs() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/apps/${appId}/logs`)
        if (res.ok) {
          const { data } = await res.json()
          if (!cancelled) setLogs(data)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchInitialLogs()
    return () => { cancelled = true }
  }, [appId])

  const startStream = useCallback(() => {
    if (abortRef.current) return

    const controller = new AbortController()
    abortRef.current = controller
    isLiveRef.current = true
    setIsLive(true)

    async function connect() {
      try {
        const res = await fetch(`/api/apps/${appId}/logs/stream`, {
          signal: controller.signal,
        })
        if (!res.ok || !res.body) return

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n\n')
          buffer = parts.pop() ?? ''

          for (const part of parts) {
            const dataLine = part.split('\n').find((l) => l.startsWith('data: '))
            if (!dataLine) continue
            try {
              const entry: LogEntry = JSON.parse(dataLine.slice(6))
              setLogs((prev) => {
                const next = [entry, ...prev]
                return next.length > MAX_LOGS ? next.slice(0, MAX_LOGS) : next
              })
            } catch {
              // skip malformed data
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
      } finally {
        if (isLiveRef.current) {
          abortRef.current = null
          setIsLive(false)
          isLiveRef.current = false
        }
      }
    }

    connect()
  }, [appId])

  const stopStream = useCallback(() => {
    isLiveRef.current = false
    abortRef.current?.abort()
    abortRef.current = null
    setIsLive(false)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isLiveRef.current = false
      abortRef.current?.abort()
      abortRef.current = null
    }
  }, [])

  return { logs, isLive, isLoading, startStream, stopStream }
}
