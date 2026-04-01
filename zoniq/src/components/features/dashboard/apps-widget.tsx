import Link from 'next/link'
import { Widget } from './widget'

type StatusType = 'healthy' | 'warning' | 'error' | 'offline'

interface Environment {
  name: string
  status: StatusType
}

interface App {
  id: string
  name: string
  environments: Environment[]
  warnings: number
}

const mockApps: App[] = [
  {
    id: '1',
    name: 'Claims Portal',
    environments: [
      { name: 'Dev', status: 'healthy' },
      { name: 'Test', status: 'healthy' },
      { name: 'Acc', status: 'healthy' },
      { name: 'Prod', status: 'healthy' },
    ],
    warnings: 0,
  },
  {
    id: '2',
    name: 'Invoicing',
    environments: [
      { name: 'Dev', status: 'healthy' },
      { name: 'Test', status: 'warning' },
      { name: 'Acc', status: 'healthy' },
      { name: 'Prod', status: 'error' },
    ],
    warnings: 2,
  },
  {
    id: '3',
    name: 'Customer Portal',
    environments: [
      { name: 'Dev', status: 'healthy' },
      { name: 'Test', status: 'healthy' },
      { name: 'Acc', status: 'warning' },
      { name: 'Prod', status: 'offline' },
    ],
    warnings: 0,
  },
  {
    id: '4',
    name: 'Reporting Service',
    environments: [
      { name: 'Dev', status: 'healthy' },
      { name: 'Test', status: 'healthy' },
      { name: 'Acc', status: 'healthy' },
      { name: 'Prod', status: 'healthy' },
    ],
    warnings: 1,
  },
  {
    id: '5',
    name: 'Mobile Companion',
    environments: [
      { name: 'Dev', status: 'healthy' },
      { name: 'Test', status: 'healthy' },
      { name: 'Acc', status: 'healthy' },
      { name: 'Prod', status: 'healthy' },
    ],
    warnings: 0,
  },
]

const statusColors: Record<StatusType, string> = {
  healthy: 'bg-[#10B981]',
  warning: 'bg-[#F59E0B]',
  error: 'bg-[#EF4444]',
  offline: 'bg-[#9A948D]',
}

export function AppsWidget() {
  return (
    <Widget
      title="Apps"
      icon={
        <svg className="h-4 w-4 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      }
      count={5}
      countColor="bg-[#DBEAFE] text-[#2563EB]"
    >
      <div className="space-y-3">
        {mockApps.map((app) => (
          <Link
            href={`/apps/${app.id}`}
            key={app.id}
            className="block rounded-lg bg-[#DBEAFE] p-3 hover:bg-[#BFDBFE] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#2D1810]">{app.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {app.environments.map((env) => (
                <div key={env.name} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${statusColors[env.status]}`} />
                  <span className="text-[#9A948D]">{env.name}</span>
                </div>
              ))}
            </div>
            {app.warnings > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-[#EF4444]">
                  {app.warnings} warning{app.warnings > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-[#9A948D] hover:text-[#2D1810] transition-colors">
        View All Apps →
      </button>
    </Widget>
  )
}
