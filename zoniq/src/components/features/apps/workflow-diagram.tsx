'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { WorkflowNode, WorkflowEdge } from '@/app/api/apps/[id]/workflows/route'

const nodeTypeStyles: Record<string, { bg: string; border: string; text: string }> = {
  start: { bg: '#ECFDF5', border: '#10B981', text: '#065F46' },
  action: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
  decision: { bg: '#FFF7ED', border: '#F59E0B', text: '#92400E' },
  end: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' },
}

const nodeTypeShapes: Record<string, string> = {
  start: '●',
  action: '▪',
  decision: '◆',
  end: '◼',
}

function buildFlowNodes(nodes: WorkflowNode[]): Node[] {
  const HORIZONTAL_GAP = 280
  const VERTICAL_GAP = 120
  // Simple layout: arrange nodes in a grid
  const cols = Math.min(nodes.length, 3)

  return nodes.map((node, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    const style = nodeTypeStyles[node.type] || nodeTypeStyles.action

    return {
      id: node.id,
      position: { x: col * HORIZONTAL_GAP + 50, y: row * VERTICAL_GAP + 50 },
      data: { label: `${nodeTypeShapes[node.type] || ''} ${node.label}` },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: style.bg,
        border: `2px solid ${style.border}`,
        color: style.text,
        borderRadius: node.type === 'decision' ? '8px' : '12px',
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'var(--font-manrope), system-ui, sans-serif',
        minWidth: '180px',
        textAlign: 'center' as const,
        cursor: 'pointer',
      },
    }
  })
}

function buildFlowEdges(edges: WorkflowEdge[]): Edge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#9A948D', strokeWidth: 2 },
    labelStyle: {
      fontSize: '11px',
      fontWeight: 500,
      fill: '#2D1810',
    },
    labelBgStyle: {
      fill: '#FAFAF9',
      fillOpacity: 0.9,
    },
  }))
}

interface WorkflowDiagramProps {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  onNodeClick: (nodeId: string) => void
}

export function WorkflowDiagram({ nodes, edges, onNodeClick }: WorkflowDiagramProps) {
  const flowNodes = useMemo(() => buildFlowNodes(nodes), [nodes])
  const flowEdges = useMemo(() => buildFlowEdges(edges), [edges])

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeClick(node.id)
    },
    [onNodeClick]
  )

  return (
    <div className="h-[500px] w-full rounded-xl border border-[#E5E2DD] bg-white">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E5E2DD" gap={20} />
        <Controls
          showInteractive={false}
          style={{ bottom: 16, left: 16 }}
        />
      </ReactFlow>
    </div>
  )
}
