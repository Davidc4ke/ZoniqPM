export type WorkflowStatus = 'active' | 'draft' | 'archived'

export type WorkflowNodeStatus = 'completed' | 'in-progress' | 'pending'

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  stepCount: number
  updatedAt: string
}

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description: string
    status: WorkflowNodeStatus
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  animated?: boolean
}

export interface WorkflowDetail extends Workflow {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface LinkedStory {
  id: string
  title: string
  status: string
}

export interface WorkflowNodeDetail {
  id: string
  label: string
  description: string
  status: WorkflowNodeStatus
  linkedStories: LinkedStory[]
}
