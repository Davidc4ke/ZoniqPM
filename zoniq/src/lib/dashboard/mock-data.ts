import type {
  AssignedStory,
  ReviewStory,
  ProjectSummary,
  AppSummary,
  TeamActivity,
} from '@/types/dashboard'

// TODO: Replace with database queries when stories/projects/apps tables exist

export function getAssignedStories(): AssignedStory[] {
  return [
    {
      id: '1',
      number: 47,
      title: 'Approval Workflow',
      description: 'Implement multi-level approval based on user role and amount',
      status: 'in-progress',
      priority: 'high',
      projectName: 'Claims Portal',
      assignee: { id: '1', name: 'Aisha', initials: 'A' },
    },
    {
      id: '2',
      number: 52,
      title: 'Export Feature',
      description: 'CSV and PDF export for reports',
      status: 'ready',
      priority: 'medium',
      projectName: 'Policy Management',
      assignee: { id: '1', name: 'Aisha', initials: 'A' },
    },
    {
      id: '3',
      number: 58,
      title: 'Form Validation',
      description: 'Client-side validation for all forms',
      status: 'in-progress',
      priority: 'low',
      projectName: 'Claims Portal',
      assignee: { id: '1', name: 'Aisha', initials: 'A' },
    },
  ]
}

export function getReviewQueue(): ReviewStory[] {
  return [
    {
      id: '4',
      number: 44,
      title: 'Login Flow',
      description: 'User authentication and session management',
      status: 'ready',
      priority: 'high',
      projectName: 'Claims Portal',
      assignee: { id: '1', name: 'Aisha', initials: 'A' },
    },
    {
      id: '5',
      number: 45,
      title: 'Dashboard',
      description: 'Main dashboard with widgets and charts',
      status: 'ready',
      priority: 'medium',
      projectName: 'Claims Portal',
      assignee: { id: '2', name: 'Marcus', initials: 'M' },
    },
    {
      id: '6',
      number: 46,
      title: 'API Integration',
      description: 'External API connections and data sync',
      status: 'ready',
      priority: 'medium',
      projectName: 'Policy Mgmt',
      assignee: { id: '1', name: 'Aisha', initials: 'A' },
    },
    {
      id: '7',
      number: 49,
      title: 'Search',
      description: 'Global search with filters and sorting',
      status: 'review',
      priority: 'low',
      projectName: 'Claims Portal',
      assignee: { id: '3', name: 'Tom', initials: 'T' },
    },
    {
      id: '8',
      number: 51,
      title: 'Notifications',
      description: 'Email and in-app notification system',
      status: 'ready',
      priority: 'low',
      projectName: 'Claims Portal',
      assignee: { id: '1', name: 'Aisha', initials: 'A' },
    },
  ]
}

export function getProjects(): ProjectSummary[] {
  return [
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
}

export function getApps(): AppSummary[] {
  return [
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
}

export function getTeamActivity(): TeamActivity[] {
  return [
    {
      id: '1',
      user: { name: 'Aisha', initials: 'A', color: 'bg-[#10B981]' },
      action: 'moved',
      highlight: '#47',
      suffix: 'to Review',
      time: '2m ago',
    },
    {
      id: '2',
      user: { name: 'Marcus', initials: 'M', color: 'bg-[#F59E0B]' },
      action: 'created',
      highlight: '#62',
      suffix: '',
      time: '15m ago',
    },
    {
      id: '3',
      user: { name: 'Tom', initials: 'T', color: 'bg-[#8B5CF6]' },
      action: 'completed',
      highlight: '#44',
      suffix: '',
      time: '1h ago',
    },
    {
      id: '4',
      user: { name: 'Aisha', initials: 'A', color: 'bg-[#10B981]' },
      action: 'generated Dev Plan for',
      highlight: '#52',
      suffix: '',
      time: '2h ago',
    },
    {
      id: '5',
      user: { name: 'David', initials: 'D', color: 'bg-[#FF6B35]' },
      action: 'approved',
      highlight: '#40',
      suffix: '',
      time: '3h ago',
    },
  ]
}
