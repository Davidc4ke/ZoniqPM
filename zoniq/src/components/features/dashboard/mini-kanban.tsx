import { Widget } from './widget'

interface MiniKanbanProps {
  columns: {
    name: string
    color: string
    count: number
  }[]
}

export function MiniKanban({ columns }: MiniKanbanProps) {
  return (
    <Widget
      title="Projects"
      icon={
        <svg className="h-4 w-4 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      }
      actionText="View Kanban →"
      onAction={() => {}}
    >
      <div className="flex gap-2">
        {columns.map((col) => (
          <div
            key={col.name}
            className="flex-1 rounded-md bg-[#FAFAF9] p-2 text-center"
          >
            <div
              className={`h-2 w-2 rounded-full mx-auto mb-1.5`}
              style={{ backgroundColor: col.color }}
            />
            <span className="text-xs text-[#9A948D] mt-1">{col.count}</span>
          </div>
        ))}
      </div>
    </Widget>
  )
}
