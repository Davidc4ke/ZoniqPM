'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeProps,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { WorkflowNode, WorkflowEdge, WorkflowNodeStatus } from '@/types/workflow'

const nodeStatusColors: Record<WorkflowNodeStatus, { bg: string; text: string; dot: string }> = {
  completed: { bg: '#DCFCE7', text: '#16A34A', dot: '#16A34A' },
  'in-progress': { bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
  pending: { bg: '#E8E4E0', text: '#9A948D', dot: '#9A948D' },
}

function WorkflowStepNode({ data }: NodeProps) {
  const nodeData = data as { label: string; description: string; status: WorkflowNodeStatus }
  const colors = nodeStatusColors[nodeData.status] ?? nodeStatusColors.pending

  return (
    <div
      className="rounded-lg border border-[#E8E4E0] bg-white px-4 py-3 shadow-sm"
      style={{ minWidth: 180 }}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#9A948D]" />
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: colors.dot }}
          data-testid="status-dot"
        />
        <span className="text-sm font-medium text-[#2D1810]">{nodeData.label}</span>
      </div>
      <p className="mt-1 text-xs text-[#9A948D]">{nodeData.description}</p>
      <Handle type="source" position={Position.Right} className="!bg-[#9A948D]" />
    </div>
  )
}

const nodeTypes = {
  workflowStep: WorkflowStepNode,
}

interface WorkflowDiagramProps {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  onNodeClick: (nodeId: string) => void
}

export function WorkflowDiagram({ nodes, edges, onNodeClick }: WorkflowDiagramProps) {
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      onNodeClick(node.id)
    },
    [onNodeClick]
  )

  return (
    <div className="h-[500px] rounded-xl border border-[#E8E4E0] bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E8E4E0" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={() => '#E8E4E0'}
          maskColor="rgba(255, 255, 255, 0.7)"
        />
      </ReactFlow>
    </div>
  )
}
