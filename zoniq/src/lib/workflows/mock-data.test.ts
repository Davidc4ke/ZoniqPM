import { describe, it, expect } from 'vitest'
import { getWorkflows, getWorkflowDetail, getNodeDetail } from './mock-data'

describe('getWorkflows', () => {
  it('should return workflows for a valid app ID', () => {
    const workflows = getWorkflows('1')
    expect(workflows.length).toBeGreaterThan(0)
    expect(workflows[0]).toHaveProperty('id')
    expect(workflows[0]).toHaveProperty('name')
    expect(workflows[0]).toHaveProperty('description')
    expect(workflows[0]).toHaveProperty('status')
    expect(workflows[0]).toHaveProperty('stepCount')
    expect(workflows[0]).toHaveProperty('updatedAt')
  })

  it('should return 3 workflows per app', () => {
    const workflows = getWorkflows('1')
    expect(workflows).toHaveLength(3)
  })

  it('should return empty array for unknown app ID', () => {
    const workflows = getWorkflows('unknown-app')
    expect(workflows).toEqual([])
  })

  it('should have valid workflow statuses', () => {
    const workflows = getWorkflows('1')
    const validStatuses = ['active', 'draft', 'archived']
    for (const wf of workflows) {
      expect(validStatuses).toContain(wf.status)
    }
  })

  it('should have step counts greater than zero', () => {
    const workflows = getWorkflows('1')
    for (const wf of workflows) {
      expect(wf.stepCount).toBeGreaterThan(0)
    }
  })
})

describe('getWorkflowDetail', () => {
  it('should return workflow detail with nodes and edges for valid ID', () => {
    const workflows = getWorkflows('1')
    const detail = getWorkflowDetail(workflows[0].id)
    expect(detail).not.toBeNull()
    expect(detail!.nodes.length).toBeGreaterThan(0)
    expect(detail!.edges.length).toBeGreaterThan(0)
    expect(detail!.name).toBe(workflows[0].name)
  })

  it('should have valid node structure', () => {
    const workflows = getWorkflows('1')
    const detail = getWorkflowDetail(workflows[0].id)
    const node = detail!.nodes[0]
    expect(node).toHaveProperty('id')
    expect(node).toHaveProperty('type')
    expect(node).toHaveProperty('position')
    expect(node.position).toHaveProperty('x')
    expect(node.position).toHaveProperty('y')
    expect(node).toHaveProperty('data')
    expect(node.data).toHaveProperty('label')
    expect(node.data).toHaveProperty('description')
    expect(node.data).toHaveProperty('status')
  })

  it('should have valid edge structure', () => {
    const workflows = getWorkflows('1')
    const detail = getWorkflowDetail(workflows[0].id)
    const edge = detail!.edges[0]
    expect(edge).toHaveProperty('id')
    expect(edge).toHaveProperty('source')
    expect(edge).toHaveProperty('target')
  })

  it('should return null for unknown workflow ID', () => {
    const detail = getWorkflowDetail('unknown-wf')
    expect(detail).toBeNull()
  })

  it('should have node count matching stepCount', () => {
    const workflows = getWorkflows('1')
    for (const wf of workflows) {
      const detail = getWorkflowDetail(wf.id)
      expect(detail!.nodes).toHaveLength(wf.stepCount)
    }
  })

  it('should have valid node statuses', () => {
    const workflows = getWorkflows('1')
    const detail = getWorkflowDetail(workflows[0].id)
    const validStatuses = ['completed', 'in-progress', 'pending']
    for (const node of detail!.nodes) {
      expect(validStatuses).toContain(node.data.status)
    }
  })
})

describe('getNodeDetail', () => {
  it('should return node detail with linked stories for valid node ID', () => {
    const workflows = getWorkflows('1')
    const detail = getWorkflowDetail(workflows[0].id)
    const nodeDetail = getNodeDetail(detail!.nodes[0].id)
    expect(nodeDetail).not.toBeNull()
    expect(nodeDetail!).toHaveProperty('id')
    expect(nodeDetail!).toHaveProperty('label')
    expect(nodeDetail!).toHaveProperty('description')
    expect(nodeDetail!).toHaveProperty('status')
    expect(nodeDetail!).toHaveProperty('linkedStories')
  })

  it('should have linked stories with valid structure', () => {
    const workflows = getWorkflows('1')
    const detail = getWorkflowDetail(workflows[0].id)
    const nodeDetail = getNodeDetail(detail!.nodes[0].id)
    expect(nodeDetail!.linkedStories.length).toBeGreaterThan(0)
    const story = nodeDetail!.linkedStories[0]
    expect(story).toHaveProperty('id')
    expect(story).toHaveProperty('title')
    expect(story).toHaveProperty('status')
  })

  it('should return null for unknown node ID', () => {
    const nodeDetail = getNodeDetail('unknown-node')
    expect(nodeDetail).toBeNull()
  })

  it('should match node data from workflow detail', () => {
    const workflows = getWorkflows('1')
    const detail = getWorkflowDetail(workflows[0].id)
    const node = detail!.nodes[0]
    const nodeDetail = getNodeDetail(node.id)
    expect(nodeDetail!.label).toBe(node.data.label)
    expect(nodeDetail!.status).toBe(node.data.status)
  })
})
