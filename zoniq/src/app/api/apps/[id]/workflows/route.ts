import { NextResponse } from 'next/server'

export interface WorkflowNode {
  id: string
  label: string
  type: 'start' | 'action' | 'decision' | 'end'
  description: string
  linkedStories: { id: string; title: string; status: string }[]
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  updatedAt: string
  nodeCount: number
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'New Claim Submission',
    description: 'End-to-end flow for submitting a new insurance claim',
    updatedAt: '2026-03-28',
    nodeCount: 6,
    nodes: [
      {
        id: 'n1',
        label: 'Customer Initiates Claim',
        type: 'start',
        description: 'Customer opens the claims portal and begins a new claim submission.',
        linkedStories: [
          { id: 'S-101', title: 'Claim form initial load', status: 'Done' },
        ],
      },
      {
        id: 'n2',
        label: 'Fill Claim Details',
        type: 'action',
        description: 'Customer provides incident details, date, and affected policy.',
        linkedStories: [
          { id: 'S-102', title: 'Claim detail form fields', status: 'In Progress' },
          { id: 'S-103', title: 'Policy lookup autocomplete', status: 'Ready' },
        ],
      },
      {
        id: 'n3',
        label: 'Upload Documents',
        type: 'action',
        description: 'Customer uploads supporting documents (photos, receipts, reports).',
        linkedStories: [
          { id: 'S-104', title: 'Document upload component', status: 'Done' },
        ],
      },
      {
        id: 'n4',
        label: 'Auto-Validation',
        type: 'decision',
        description: 'System validates completeness and checks for duplicate claims.',
        linkedStories: [
          { id: 'S-105', title: 'Duplicate claim detection', status: 'Draft' },
        ],
      },
      {
        id: 'n5',
        label: 'Assign to Adjuster',
        type: 'action',
        description: 'Valid claim is routed to an available claims adjuster based on type and region.',
        linkedStories: [
          { id: 'S-106', title: 'Adjuster assignment logic', status: 'Ready' },
        ],
      },
      {
        id: 'n6',
        label: 'Claim Submitted',
        type: 'end',
        description: 'Claim is recorded and confirmation sent to the customer.',
        linkedStories: [],
      },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n4' },
      { id: 'e4', source: 'n4', target: 'n5', label: 'Valid' },
      { id: 'e5', source: 'n4', target: 'n2', label: 'Invalid' },
      { id: 'e6', source: 'n5', target: 'n6' },
    ],
  },
  {
    id: 'wf-2',
    name: 'Claim Review & Approval',
    description: 'Adjuster reviews the claim and decides on approval or rejection',
    updatedAt: '2026-03-25',
    nodeCount: 5,
    nodes: [
      {
        id: 'r1',
        label: 'Adjuster Receives Claim',
        type: 'start',
        description: 'Adjuster picks up the claim from their queue.',
        linkedStories: [
          { id: 'S-201', title: 'Adjuster claim queue', status: 'Done' },
        ],
      },
      {
        id: 'r2',
        label: 'Review Documentation',
        type: 'action',
        description: 'Adjuster reviews all submitted documents and claim details.',
        linkedStories: [
          { id: 'S-202', title: 'Document viewer panel', status: 'In Progress' },
        ],
      },
      {
        id: 'r3',
        label: 'Approve or Reject?',
        type: 'decision',
        description: 'Adjuster decides whether the claim meets policy criteria.',
        linkedStories: [],
      },
      {
        id: 'r4',
        label: 'Process Payment',
        type: 'action',
        description: 'Approved claim triggers payment processing to the customer.',
        linkedStories: [
          { id: 'S-203', title: 'Payment integration', status: 'Draft' },
        ],
      },
      {
        id: 'r5',
        label: 'Claim Resolved',
        type: 'end',
        description: 'Claim is closed with resolution recorded.',
        linkedStories: [],
      },
    ],
    edges: [
      { id: 're1', source: 'r1', target: 'r2' },
      { id: 're2', source: 'r2', target: 'r3' },
      { id: 're3', source: 'r3', target: 'r4', label: 'Approved' },
      { id: 're4', source: 'r3', target: 'r5', label: 'Rejected' },
      { id: 're5', source: 'r4', target: 'r5' },
    ],
  },
  {
    id: 'wf-3',
    name: 'Policy Renewal',
    description: 'Automated and manual steps for renewing customer policies',
    updatedAt: '2026-03-20',
    nodeCount: 4,
    nodes: [
      {
        id: 'p1',
        label: 'Renewal Reminder Sent',
        type: 'start',
        description: 'System sends automated renewal reminder 30 days before expiry.',
        linkedStories: [
          { id: 'S-301', title: 'Renewal notification scheduler', status: 'Done' },
        ],
      },
      {
        id: 'p2',
        label: 'Customer Reviews Terms',
        type: 'action',
        description: 'Customer reviews updated terms and premium changes.',
        linkedStories: [
          { id: 'S-302', title: 'Renewal terms comparison view', status: 'Ready' },
        ],
      },
      {
        id: 'p3',
        label: 'Accept or Decline?',
        type: 'decision',
        description: 'Customer decides whether to renew the policy.',
        linkedStories: [],
      },
      {
        id: 'p4',
        label: 'Policy Updated',
        type: 'end',
        description: 'Policy is renewed or marked as lapsed based on customer decision.',
        linkedStories: [
          { id: 'S-303', title: 'Policy status update logic', status: 'In Progress' },
        ],
      },
    ],
    edges: [
      { id: 'pe1', source: 'p1', target: 'p2' },
      { id: 'pe2', source: 'p2', target: 'p3' },
      { id: 'pe3', source: 'p3', target: 'p4', label: 'Accept' },
      { id: 'pe4', source: 'p3', target: 'p4', label: 'Decline' },
    ],
  },
]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Mock: return workflows for any app id
  void id
  return NextResponse.json(mockWorkflows)
}
