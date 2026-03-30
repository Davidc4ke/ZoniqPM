import type { Workflow, WorkflowDetail, WorkflowNode, WorkflowEdge, WorkflowNodeDetail, LinkedStory, WorkflowNodeStatus } from '@/types/workflow'

// TODO: Replace with Drizzle ORM database queries when PostgreSQL is configured

interface WorkflowConfig {
  name: string
  description: string
  status: 'active' | 'draft' | 'archived'
  nodes: Array<{
    label: string
    description: string
    status: WorkflowNodeStatus
    x: number
    y: number
    stories: Array<{ title: string; status: string }>
  }>
  edges: Array<{ sourceIdx: number; targetIdx: number; animated?: boolean }>
}

const workflowConfigs: WorkflowConfig[] = [
  {
    name: 'Claims Processing',
    description: 'End-to-end claims processing from intake to resolution',
    status: 'active',
    nodes: [
      { label: 'Claim Intake', description: 'Receive and register new claims from multiple channels', status: 'completed', x: 0, y: 0, stories: [{ title: 'Web form submission', status: 'done' }, { title: 'Document upload handling', status: 'done' }] },
      { label: 'Initial Triage', description: 'Categorize claim type and assess complexity', status: 'completed', x: 250, y: 0, stories: [{ title: 'Auto-categorization rules', status: 'done' }, { title: 'Complexity scoring', status: 'in-progress' }] },
      { label: 'Investigation', description: 'Gather evidence and verify claim details', status: 'in-progress', x: 500, y: 0, stories: [{ title: 'Evidence collection workflow', status: 'in-progress' }, { title: 'Third-party verification', status: 'backlog' }] },
      { label: 'Assessment', description: 'Evaluate claim validity and calculate settlement', status: 'pending', x: 750, y: 0, stories: [{ title: 'Settlement calculator', status: 'backlog' }] },
      { label: 'Resolution', description: 'Approve or deny claim and process payment', status: 'pending', x: 1000, y: 0, stories: [{ title: 'Payment processing', status: 'backlog' }, { title: 'Denial letter generation', status: 'backlog' }] },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1 },
      { sourceIdx: 1, targetIdx: 2, animated: true },
      { sourceIdx: 2, targetIdx: 3 },
      { sourceIdx: 3, targetIdx: 4 },
    ],
  },
  {
    name: 'Approval Workflow',
    description: 'Multi-level approval process based on claim amount thresholds',
    status: 'active',
    nodes: [
      { label: 'Submit Request', description: 'Initiator submits approval request with documentation', status: 'completed', x: 0, y: 0, stories: [{ title: 'Approval request form', status: 'done' }] },
      { label: 'Manager Review', description: 'Direct manager reviews and approves or escalates', status: 'completed', x: 250, y: 0, stories: [{ title: 'Manager dashboard', status: 'done' }, { title: 'Email notifications', status: 'done' }] },
      { label: 'Director Approval', description: 'Director approval required for amounts above threshold', status: 'in-progress', x: 500, y: -80, stories: [{ title: 'Threshold configuration', status: 'in-progress' }] },
      { label: 'Finance Check', description: 'Finance team validates budget availability', status: 'pending', x: 500, y: 80, stories: [{ title: 'Budget validation API', status: 'backlog' }] },
      { label: 'Final Approval', description: 'Final sign-off and execution', status: 'pending', x: 750, y: 0, stories: [{ title: 'Digital signature', status: 'backlog' }, { title: 'Audit trail logging', status: 'backlog' }] },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1 },
      { sourceIdx: 1, targetIdx: 2 },
      { sourceIdx: 1, targetIdx: 3 },
      { sourceIdx: 2, targetIdx: 4 },
      { sourceIdx: 3, targetIdx: 4 },
    ],
  },
  {
    name: 'Escalation Flow',
    description: 'Automated escalation path for overdue or high-priority items',
    status: 'draft',
    nodes: [
      { label: 'SLA Monitor', description: 'Monitor task completion against SLA deadlines', status: 'completed', x: 0, y: 0, stories: [{ title: 'SLA timer implementation', status: 'done' }] },
      { label: 'Warning Alert', description: 'Send warning notification at 80% SLA threshold', status: 'completed', x: 250, y: 0, stories: [{ title: 'Alert notification system', status: 'done' }] },
      { label: 'Auto-Escalate', description: 'Automatically escalate to next tier if SLA breached', status: 'in-progress', x: 500, y: 0, stories: [{ title: 'Escalation rules engine', status: 'in-progress' }] },
      { label: 'Management Alert', description: 'Notify management of critical escalation', status: 'pending', x: 750, y: 0, stories: [{ title: 'Management dashboard alert', status: 'backlog' }] },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1 },
      { sourceIdx: 1, targetIdx: 2, animated: true },
      { sourceIdx: 2, targetIdx: 3 },
    ],
  },
]

function buildWorkflowId(appId: string, wfIdx: number): string {
  return `wf-${appId}-${wfIdx + 1}`
}

function buildNodeId(workflowId: string, nodeIdx: number): string {
  return `${workflowId}-node-${nodeIdx + 1}`
}

function buildWorkflowData(appId: string): Array<{ workflow: Workflow; detail: WorkflowDetail; nodeDetails: Map<string, WorkflowNodeDetail> }> {
  return workflowConfigs.map((config, wfIdx) => {
    const workflowId = buildWorkflowId(appId, wfIdx)

    const nodes: WorkflowNode[] = config.nodes.map((n, nIdx) => ({
      id: buildNodeId(workflowId, nIdx),
      type: 'workflowStep',
      position: { x: n.x, y: n.y },
      data: { label: n.label, description: n.description, status: n.status },
    }))

    const edges: WorkflowEdge[] = config.edges.map((e, eIdx) => ({
      id: `${workflowId}-edge-${eIdx + 1}`,
      source: buildNodeId(workflowId, e.sourceIdx),
      target: buildNodeId(workflowId, e.targetIdx),
      ...(e.animated ? { animated: true } : {}),
    }))

    const workflow: Workflow = {
      id: workflowId,
      name: config.name,
      description: config.description,
      status: config.status,
      stepCount: config.nodes.length,
      updatedAt: '2026-03-15T10:00:00Z',
    }

    const detail: WorkflowDetail = { ...workflow, nodes, edges }

    const nodeDetails = new Map<string, WorkflowNodeDetail>()
    config.nodes.forEach((n, nIdx) => {
      const nodeId = buildNodeId(workflowId, nIdx)
      const linkedStories: LinkedStory[] = n.stories.map((s, sIdx) => ({
        id: `${nodeId}-story-${sIdx + 1}`,
        title: s.title,
        status: s.status,
      }))
      nodeDetails.set(nodeId, {
        id: nodeId,
        label: n.label,
        description: n.description,
        status: n.status,
        linkedStories,
      })
    })

    return { workflow, detail, nodeDetails }
  })
}

// Pre-seed data for apps 1-5
function generateAllData() {
  const data = new Map<string, ReturnType<typeof buildWorkflowData>>()
  for (let appId = 1; appId <= 5; appId++) {
    data.set(String(appId), buildWorkflowData(String(appId)))
  }
  return data
}

const allData = generateAllData()

export function getWorkflows(appId: string): Workflow[] {
  const appData = allData.get(appId)
  if (!appData) return []
  return appData.map((d) => d.workflow)
}

export function getWorkflowDetail(workflowId: string): WorkflowDetail | null {
  for (const appData of allData.values()) {
    for (const d of appData) {
      if (d.detail.id === workflowId) return d.detail
    }
  }
  return null
}

export function getNodeDetail(nodeId: string): WorkflowNodeDetail | null {
  for (const appData of allData.values()) {
    for (const d of appData) {
      const nd = d.nodeDetails.get(nodeId)
      if (nd) return nd
    }
  }
  return null
}
