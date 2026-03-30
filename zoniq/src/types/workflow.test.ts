import { describe, it, expect } from 'vitest'
import type {
  WorkflowStatus,
  WorkflowNodeStatus,
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowDetail,
  LinkedStory,
  WorkflowNodeDetail,
} from './workflow'

describe('Workflow type', () => {
  it('should define Workflow interface shape', () => {
    const workflow: Workflow = {
      id: 'wf-1',
      name: 'Claims Processing',
      description: 'End-to-end claims processing workflow',
      status: 'active',
      stepCount: 5,
      updatedAt: '2026-03-15T10:00:00Z',
    }
    expect(workflow.id).toBe('wf-1')
    expect(workflow.name).toBe('Claims Processing')
    expect(workflow.description).toBe('End-to-end claims processing workflow')
    expect(workflow.status).toBe('active')
    expect(workflow.stepCount).toBe(5)
    expect(workflow.updatedAt).toBe('2026-03-15T10:00:00Z')
  })
})

describe('WorkflowStatus type', () => {
  it('should support active, draft, and archived values', () => {
    const statuses: WorkflowStatus[] = ['active', 'draft', 'archived']
    expect(statuses).toHaveLength(3)
    expect(statuses).toContain('active')
    expect(statuses).toContain('draft')
    expect(statuses).toContain('archived')
  })
})

describe('WorkflowNodeStatus type', () => {
  it('should support completed, in-progress, and pending values', () => {
    const statuses: WorkflowNodeStatus[] = ['completed', 'in-progress', 'pending']
    expect(statuses).toHaveLength(3)
    expect(statuses).toContain('completed')
    expect(statuses).toContain('in-progress')
    expect(statuses).toContain('pending')
  })
})

describe('WorkflowNode type', () => {
  it('should define WorkflowNode interface shape', () => {
    const node: WorkflowNode = {
      id: 'node-1',
      type: 'workflowStep',
      position: { x: 100, y: 200 },
      data: {
        label: 'Claim Intake',
        description: 'Receive and register new claims',
        status: 'completed',
      },
    }
    expect(node.id).toBe('node-1')
    expect(node.type).toBe('workflowStep')
    expect(node.position.x).toBe(100)
    expect(node.position.y).toBe(200)
    expect(node.data.label).toBe('Claim Intake')
    expect(node.data.description).toBe('Receive and register new claims')
    expect(node.data.status).toBe('completed')
  })
})

describe('WorkflowEdge type', () => {
  it('should define WorkflowEdge interface shape', () => {
    const edge: WorkflowEdge = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
    }
    expect(edge.id).toBe('edge-1')
    expect(edge.source).toBe('node-1')
    expect(edge.target).toBe('node-2')
  })

  it('should support optional animated property', () => {
    const edge: WorkflowEdge = {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-3',
      animated: true,
    }
    expect(edge.animated).toBe(true)
  })
})

describe('WorkflowDetail type', () => {
  it('should extend Workflow with nodes and edges', () => {
    const detail: WorkflowDetail = {
      id: 'wf-1',
      name: 'Claims Processing',
      description: 'End-to-end claims processing workflow',
      status: 'active',
      stepCount: 2,
      updatedAt: '2026-03-15T10:00:00Z',
      nodes: [
        {
          id: 'node-1',
          type: 'workflowStep',
          position: { x: 0, y: 0 },
          data: { label: 'Step 1', description: 'First step', status: 'completed' },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
      ],
    }
    expect(detail.nodes).toHaveLength(1)
    expect(detail.edges).toHaveLength(1)
    expect(detail.nodes[0].data.label).toBe('Step 1')
  })
})

describe('LinkedStory type', () => {
  it('should define LinkedStory interface shape', () => {
    const story: LinkedStory = {
      id: 'story-1',
      title: 'Implement claim validation',
      status: 'done',
    }
    expect(story.id).toBe('story-1')
    expect(story.title).toBe('Implement claim validation')
    expect(story.status).toBe('done')
  })
})

describe('WorkflowNodeDetail type', () => {
  it('should define WorkflowNodeDetail with linked stories', () => {
    const nodeDetail: WorkflowNodeDetail = {
      id: 'node-1',
      label: 'Claim Intake',
      description: 'Receive and register new claims',
      status: 'completed',
      linkedStories: [
        { id: 'story-1', title: 'Web form submission', status: 'done' },
        { id: 'story-2', title: 'Document upload', status: 'in-progress' },
      ],
    }
    expect(nodeDetail.id).toBe('node-1')
    expect(nodeDetail.label).toBe('Claim Intake')
    expect(nodeDetail.status).toBe('completed')
    expect(nodeDetail.linkedStories).toHaveLength(2)
    expect(nodeDetail.linkedStories[0].title).toBe('Web form submission')
  })

  it('should handle empty linked stories', () => {
    const nodeDetail: WorkflowNodeDetail = {
      id: 'node-2',
      label: 'Pending Step',
      description: 'Not yet started',
      status: 'pending',
      linkedStories: [],
    }
    expect(nodeDetail.linkedStories).toHaveLength(0)
  })
})
