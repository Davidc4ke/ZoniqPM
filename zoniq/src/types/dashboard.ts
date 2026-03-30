export interface AssignedStory {
  id: string
  number: number
  title: string
  description?: string
  status: 'backlog' | 'ready' | 'in-progress' | 'review' | 'testing' | 'done'
  priority: 'high' | 'medium' | 'low'
  projectName: string
  assignee?: {
    id: string
    name: string
    initials: string
  }
}

export interface ReviewStory {
  id: string
  number: number
  title: string
  description?: string
  status: 'ready' | 'review'
  priority: 'high' | 'medium' | 'low'
  projectName: string
  assignee?: {
    id: string
    name: string
    initials: string
  }
}

export type EnvironmentStatus = 'healthy' | 'warning' | 'error' | 'offline'

export interface AppEnvironment {
  name: string
  status: EnvironmentStatus
}

export interface AppSummary {
  id: string
  name: string
  environments: AppEnvironment[]
  warnings: number
}

export interface ProjectSummary {
  id: string
  name: string
  progress: number
  columns: {
    backlog: number
    active: number
    testing: number
    review: number
    done: number
  }
}

export interface ActivityUser {
  name: string
  initials: string
  color: string
}

export interface TeamActivity {
  id: string
  user: ActivityUser
  action: string
  highlight: string
  suffix?: string
  time: string
}
