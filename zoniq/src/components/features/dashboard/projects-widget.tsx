'use client'

import Link from 'next/link'
import { Widget } from './widget'
import { WidgetSkeleton } from './widget-skeleton'
import { MiniKanban } from '../mini-kanban/mini-kanban'
import { useProjects } from '@/hooks/use-dashboard'

export function ProjectsWidget() {
  const { data: projects, isLoading } = useProjects()

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
      {isLoading ? (
        <WidgetSkeleton rows={3} />
      ) : (
        <div className="space-y-4">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              aria-label={project.name}
              className="block rounded-lg bg-[#F3E8FF] p-3 hover:bg-[#E9D5FF] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#2D1810]">{project.name}</span>
                <span className="text-sm font-bold text-[#FF6B35]">{project.progress}%</span>
              </div>
              <MiniKanban columns={project.columns} progress={project.progress} />
            </Link>
          ))}
        </div>
      )}
    </Widget>
  )
}
