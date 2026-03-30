import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppWorkflows } from './app-workflows'

vi.mock('@/hooks/use-workflows', () => ({
  useWorkflows: vi.fn(),
  useWorkflowDetail: vi.fn(),
  useNodeDetail: vi.fn(),
}))

vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ nodes, onNodeClick }: { nodes: Array<{ id: string; data: { label: string } }>; onNodeClick: (event: React.MouseEvent, node: { id: string }) => void }) =>
    React.createElement('div', { 'data-testid': 'react-flow' },
      nodes?.map((node: { id: string; data: { label: string } }) =>
        React.createElement('div', {
          key: node.id,
          'data-testid': `rf-node-${node.id}`,
          onClick: (e: React.MouseEvent) => onNodeClick?.(e, node),
        }, node.data.label)
      )
    ),
  Background: () => null,
  Controls: () => null,
  MiniMap: () => null,
  Handle: () => null,
  Position: { Left: 'left', Right: 'right' },
}))

import { useWorkflows, useWorkflowDetail, useNodeDetail } from '@/hooks/use-workflows'
const mockUseWorkflows = vi.mocked(useWorkflows)
const mockUseWorkflowDetail = vi.mocked(useWorkflowDetail)
const mockUseNodeDetail = vi.mocked(useNodeDetail)

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

const mockWorkflows = [
  { id: 'wf-1-1', name: 'Claims Processing', description: 'End-to-end claims', status: 'active' as const, stepCount: 5, updatedAt: '2026-03-15T10:00:00Z' },
  { id: 'wf-1-2', name: 'Approval Workflow', description: 'Multi-level approval', status: 'active' as const, stepCount: 5, updatedAt: '2026-03-15T10:00:00Z' },
  { id: 'wf-1-3', name: 'Escalation Flow', description: 'Automated escalation', status: 'draft' as const, stepCount: 4, updatedAt: '2026-03-15T10:00:00Z' },
]

const mockWorkflowDetail = {
  ...mockWorkflows[0],
  nodes: [
    { id: 'node-1', type: 'workflowStep', position: { x: 0, y: 0 }, data: { label: 'Claim Intake', description: 'Receive claims', status: 'completed' as const } },
    { id: 'node-2', type: 'workflowStep', position: { x: 250, y: 0 }, data: { label: 'Initial Triage', description: 'Categorize claims', status: 'in-progress' as const } },
  ],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
}

const mockNodeDetailData = {
  id: 'node-1',
  label: 'Claim Intake',
  description: 'Receive and register new claims',
  status: 'completed' as const,
  linkedStories: [
    { id: 'story-1', title: 'Web form submission', status: 'done' },
    { id: 'story-2', title: 'Document upload', status: 'in-progress' },
  ],
}

describe('AppWorkflows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseWorkflowDetail.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflowDetail>)
    mockUseNodeDetail.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useNodeDetail>)
  })

  it('renders loading skeleton', () => {
    mockUseWorkflows.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    const { container } = renderWithProviders(
      React.createElement(AppWorkflows, { appId: '1' })
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseWorkflows.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load workflows'),
    } as ReturnType<typeof useWorkflows>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))
    expect(screen.getByText('Failed to load workflows')).toBeInTheDocument()
  })

  it('renders empty state when no workflows', () => {
    mockUseWorkflows.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))
    expect(screen.getByText(/No workflows available/)).toBeInTheDocument()
  })

  it('renders workflow list', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))
    expect(screen.getByText('Claims Processing')).toBeInTheDocument()
    expect(screen.getByText('Approval Workflow')).toBeInTheDocument()
    expect(screen.getByText('Escalation Flow')).toBeInTheDocument()
  })

  it('renders workflow count header', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))
    expect(screen.getByText('Workflows (3)')).toBeInTheDocument()
  })

  it('renders status badges', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))
    const activeBadges = screen.getAllByText('Active')
    expect(activeBadges).toHaveLength(2)
    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('renders step counts', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))
    const fiveSteps = screen.getAllByText('5 steps')
    expect(fiveSteps).toHaveLength(2)
    expect(screen.getByText('4 steps')).toBeInTheDocument()
  })

  it('shows diagram when workflow is selected', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    mockUseWorkflowDetail.mockReturnValue({
      data: mockWorkflowDetail,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflowDetail>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))

    fireEvent.click(screen.getByText('Claims Processing'))

    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    expect(screen.getByText('Back to workflows')).toBeInTheDocument()
  })

  it('shows node detail panel when node is clicked', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    mockUseWorkflowDetail.mockReturnValue({
      data: mockWorkflowDetail,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflowDetail>)
    mockUseNodeDetail.mockReturnValue({
      data: mockNodeDetailData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useNodeDetail>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))

    // Select workflow
    fireEvent.click(screen.getByText('Claims Processing'))
    // Click node in diagram
    fireEvent.click(screen.getByTestId('rf-node-node-1'))

    expect(screen.getByText('Node Details')).toBeInTheDocument()
    expect(screen.getByText('Receive and register new claims')).toBeInTheDocument()
    expect(screen.getByText('Web form submission')).toBeInTheDocument()
    expect(screen.getByText('Document upload')).toBeInTheDocument()
  })

  it('navigates back to workflow list', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    mockUseWorkflowDetail.mockReturnValue({
      data: mockWorkflowDetail,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflowDetail>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))

    // Select workflow
    fireEvent.click(screen.getByText('Claims Processing'))
    expect(screen.getByText('Back to workflows')).toBeInTheDocument()

    // Go back
    fireEvent.click(screen.getByText('Back to workflows'))
    expect(screen.getByText('Workflows (3)')).toBeInTheDocument()
  })

  it('displays linked stories count in node panel', () => {
    mockUseWorkflows.mockReturnValue({
      data: mockWorkflows,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflows>)
    mockUseWorkflowDetail.mockReturnValue({
      data: mockWorkflowDetail,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useWorkflowDetail>)
    mockUseNodeDetail.mockReturnValue({
      data: mockNodeDetailData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useNodeDetail>)
    renderWithProviders(React.createElement(AppWorkflows, { appId: '1' }))

    fireEvent.click(screen.getByText('Claims Processing'))
    fireEvent.click(screen.getByTestId('rf-node-node-1'))

    expect(screen.getByText('Linked Stories (2)')).toBeInTheDocument()
  })
})
