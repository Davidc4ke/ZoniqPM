'use client'

export interface MiniKanbanColumns {
  backlog: number
  active: number
  testing: number
  review: number
  done: number
}

export interface MiniKanbanProps {
  columns: MiniKanbanColumns
  progress?: number
  className?: string
}

const columnConfig = [
  { key: 'backlog', color: '#9A948D', label: 'Backlog' },
  { key: 'active', color: '#F59E0B', label: 'Active' },
  { key: 'testing', color: '#9333EA', label: 'Testing' },
  { key: 'review', color: '#2563EB', label: 'Review' },
  { key: 'done', color: '#10B981', label: 'Done' },
] as const

export function MiniKanban({ columns, progress, className = '' }: MiniKanbanProps) {
  return (
    <div className={className}>
      {progress !== undefined && (
        <div className="mb-3 h-1.5 w-full rounded-full bg-[#E8E4E0]">
          <div
            className="h-full rounded-full bg-[#FF6B35] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="flex gap-2">
        {columnConfig.map((col) => (
          <div key={col.key} className="flex-1 text-center">
            <div
              className="mx-auto mb-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: col.color }}
            />
            <div className="text-xs font-bold text-[#2D1810]">{columns[col.key]}</div>
            <div className="text-[10px] text-[#9A948D]">{col.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const miniKanbanColumnConfig = columnConfig
