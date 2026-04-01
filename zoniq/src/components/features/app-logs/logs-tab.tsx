'use client'

import { useLogStream } from '@/hooks/use-log-stream'
import type { LogLevel } from '@/types/log'

const levelStyles: Record<LogLevel, { bg: string; text: string; label: string }> = {
  info: { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]', label: 'INFO' },
  warn: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', label: 'WARN' },
  error: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', label: 'ERROR' },
  debug: { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]', label: 'DEBUG' },
}

function formatTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 3 })
}

interface LogsTabProps {
  appId: string
}

export function LogsTab({ appId }: LogsTabProps) {
  const { logs, isLive, isLoading, startStream, stopStream } = useLogStream(appId)

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-8 rounded bg-[#E8E4E0]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#2D1810]">Application Logs</h2>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-semibold text-[#16A34A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Live
            </span>
          )}
        </div>
        <button
          onClick={isLive ? stopStream : startStream}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isLive
              ? 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
              : 'bg-[#FF6B35] text-white hover:bg-[#E55A2B]'
          }`}
        >
          {isLive ? 'Stop Live Mode' : 'Enable Live Mode'}
        </button>
      </div>

      {/* Log entries */}
      <div className="rounded-lg border border-[#E8E4E0] bg-[#FAFAF9] overflow-hidden">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#9A948D]">
            No log entries available
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto divide-y divide-[#E8E4E0]">
            {logs.map((entry, idx) => {
              const style = levelStyles[entry.level]
              return (
                <div
                  key={entry.id}
                  className={`flex items-start gap-3 px-4 py-2.5 text-sm ${
                    isLive && idx === 0 ? 'animate-log-highlight' : ''
                  }`}
                >
                  <span className="shrink-0 font-mono text-xs text-[#9A948D] pt-0.5 w-[95px]">
                    {formatTime(entry.timestamp)}
                  </span>
                  <span
                    className={`shrink-0 inline-block w-[52px] text-center rounded px-1.5 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}
                  >
                    {style.label}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-[#9A948D] w-[130px] truncate pt-0.5">
                    {entry.source}
                  </span>
                  <span className="text-[#2D1810] break-words min-w-0">
                    {entry.message}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
