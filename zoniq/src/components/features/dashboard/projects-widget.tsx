'use client'

import { Widget } from './widget'
import { MiniKanban } from '../mini-kanban/mini-kanban'

const mockProjects = [
  {
    id: '1',
    name: 'Claims Portal',
    progress: 72,
    columns: { backlog: 3, active: 8, testing: 4, review: 5, done: 16 },
  },
  {
    id: '2',
    name: 'Policy Management',
    progress: 45,
    columns: { backlog: 5, active: 6, testing: 2, review: 3, done: 9 },
  },
  {
    id: '3',
    name: 'Customer Portal',
    progress: 35,
    columns: { backlog: 8, active: 4, testing: 1, review: 2, done: 5 },
  },
  {
    id: '4',
    name: 'Reporting Module',
    progress: 88,
    columns: { backlog: 1, active: 2, testing: 3, review: 4, done: 18 },
  },
  {
    id: '5',
    name: 'Mobile App',
    progress: 12,
    columns: { backlog: 12, active: 3, testing: 0, review: 1, done: 2 },
  },
]

export function ProjectsWidget() {
  return (
    <Widget
      title="Projects"
      icon={
        <svg className="h-4 w-4 text-[#9A948D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" />
          <path d="M9 9h6v6H9z" />
        </svg>
      }
      actionText="View Kanban →"
      onAction={() => {}}
    >
      <div className="space-y-4">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg bg-[#F3E8FF] p-3 hover:bg-[#E9D5FF] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#2D1810]">{project.name}</span>
              <span className="text-sm font-bold text-[#FF6B35]">{project.progress}%</span>
            </div>
            <MiniKanban columns={project.columns} progress={project.progress} />
          </div>
        ))}
      </div>
    </Widget>
  )
}
