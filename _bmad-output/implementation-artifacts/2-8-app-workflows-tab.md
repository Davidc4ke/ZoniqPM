# Story 2.8: App Workflows Tab

Status: done

## Story

As a user,
I want to view visual workflow diagrams for an app,
so that I can understand business processes at a glance.

## Acceptance Criteria

1. **View Workflow List**: Given a user on an app detail page, when the user navigates to the Workflows tab, then a list of workflows associated with the app is displayed, showing workflow name, step count, and status.

2. **View Workflow Diagram**: Given a user viewing the workflows tab, when the user clicks on a workflow, then a visual workflow diagram is rendered using React Flow (`@xyflow/react`), with nodes and connections displayed according to the workflow definition.

3. **View Node Details**: Given a user viewing a workflow diagram, when the user clicks on a node, then node details are displayed in a side panel showing node name, description, status, and linked stories.

## Tasks / Subtasks

- [x] Task 1: Create Workflow type definitions and Zod schemas (AC: #1, #2, #3)
  - [x] 1.1: Write tests for Workflow types in `src/types/workflow.test.ts`
  - [x] 1.2: Create `src/types/workflow.ts` with interfaces: `Workflow`, `WorkflowNode`, `WorkflowEdge`, `WorkflowNodeDetail`, `WorkflowStatus` type, and `LinkedStory` type
  - [x] 1.3: Run tests — 10 tests pass

- [x] Task 2: Create Workflow mock data layer (AC: #1, #2, #3)
  - [x] 2.1: Write tests for mock data functions in `src/lib/workflows/mock-data.test.ts`
  - [x] 2.2: Create `src/lib/workflows/mock-data.ts` with functions: `getWorkflows(appId)` returns array of Workflow, `getWorkflowDetail(workflowId)` returns workflow with nodes and edges, `getNodeDetail(nodeId)` returns WorkflowNodeDetail with linked stories
  - [x] 2.3: Pre-seed 3 sample workflows with realistic nodes/edges for a Mendix insurance app
  - [x] 2.4: Run tests — 15 tests pass

- [x] Task 3: Create Workflow API routes (AC: #1, #2, #3)
  - [x] 3.1: Write tests for API routes in `src/app/api/apps/[id]/workflows/route.test.ts`
  - [x] 3.2: Create `src/app/api/apps/[id]/workflows/route.ts` — GET returns workflow list for the app
  - [x] 3.3: Write tests for workflow detail in `src/app/api/apps/[id]/workflows/[workflowId]/route.test.ts`
  - [x] 3.4: Create `src/app/api/apps/[id]/workflows/[workflowId]/route.ts` — GET returns workflow detail with nodes and edges
  - [x] 3.5: Write tests for node detail in `src/app/api/apps/[id]/workflows/[workflowId]/nodes/[nodeId]/route.test.ts`
  - [x] 3.6: Create `src/app/api/apps/[id]/workflows/[workflowId]/nodes/[nodeId]/route.ts` — GET returns node detail with linked stories
  - [x] 3.7: Run tests — 12 tests pass

- [x] Task 4: Create Workflow TanStack Query hooks (AC: #1, #2, #3)
  - [x] 4.1: Write tests for hooks in `src/hooks/use-workflows.test.ts`
  - [x] 4.2: Create `src/hooks/use-workflows.ts` with `useWorkflows(appId)`, `useWorkflowDetail(appId, workflowId)`, `useNodeDetail(appId, workflowId, nodeId)`
  - [x] 4.3: Run tests — 7 tests pass

- [x] Task 5: Create Workflow UI components (AC: #1, #2, #3)
  - [x] 5.1: Write tests for UI components in `src/components/features/app-workflows/app-workflows.test.tsx`
  - [x] 5.2: Create `src/components/features/app-workflows/workflow-list.tsx` — list of workflow cards showing name, step count, status badge; clickable to select a workflow
  - [x] 5.3: Create `src/components/features/app-workflows/workflow-diagram.tsx` — renders React Flow diagram with custom nodes; clicking a node selects it. Use `@xyflow/react` with `ReactFlow`, `Background`, `Controls`, `MiniMap`. Custom node type for workflow steps showing step name and status indicator.
  - [x] 5.4: Create `src/components/features/app-workflows/node-detail-panel.tsx` — side panel showing selected node name, description, status, and linked stories list. Panel slides in from the right when a node is selected.
  - [x] 5.5: Create `src/components/features/app-workflows/app-workflows.tsx` — main container: when no workflow selected, show workflow-list; when workflow selected, show diagram + optional node-detail-panel. Include a back button to return to list.
  - [x] 5.6: Run tests — 11 tests pass

- [x] Task 6: Integrate Workflows tab into AppDetail (AC: #1)
  - [x] 6.1: Write/update test in `src/components/features/app-detail/app-detail.test.tsx` for Workflows tab rendering AppWorkflows
  - [x] 6.2: Import `AppWorkflows` in `app-detail.tsx` and render it when `activeTab === 'workflows'`
  - [x] 6.3: Run full test suite — 597 tests pass across 67 files, 0 regressions

- [x] Task 7: Final validation
  - [x] 7.1: Run full test suite (`npm run test:run`) — 597 tests pass across 67 files, 0 regressions
  - [x] 7.2: Run linter (`npm run lint`) — 0 errors (3 pre-existing warnings)
  - [x] 7.3: All 3 acceptance criteria verified and satisfied

## Dev Notes

### Architecture Patterns (MUST FOLLOW)

Follow **exact same patterns** as stories 2-5, 2-6, 2-7. This is a **read-only tab** — no CRUD operations, no forms, no dialogs.

**Data flow**: App → Workflows (list) → Workflow Detail (nodes + edges for React Flow) → Node Detail (side panel)

### Type Definition Pattern
- File: `src/types/workflow.ts`
- Use Zod v4 for schema definitions (`import { z } from 'zod'`)
- Export both interface and Zod schema versions
- Key types:
  - `WorkflowStatus` = `'active' | 'draft' | 'archived'`
  - `WorkflowNodeStatus` = `'completed' | 'in-progress' | 'pending'`
  - `Workflow` = `{ id, name, description, status, stepCount, updatedAt }`
  - `WorkflowNode` = `{ id, type, position: { x, y }, data: { label, description, status } }`
  - `WorkflowEdge` = `{ id, source, target, animated? }`
  - `WorkflowDetail` = `{ ...Workflow, nodes: WorkflowNode[], edges: WorkflowEdge[] }`
  - `LinkedStory` = `{ id, title, status }`
  - `WorkflowNodeDetail` = `{ id, label, description, status, linkedStories: LinkedStory[] }`

### Mock Data Pattern
- File: `src/lib/workflows/mock-data.ts`
- Follow same pattern as `src/lib/test-coverage/mock-data.ts`
- Use `TODO: Replace with Drizzle ORM` comment at top
- Pre-seed 3 workflows: "Claims Processing", "Approval Workflow", "Escalation Flow"
- Each workflow has 4-6 nodes with realistic positions and edges connecting them
- Node statuses should vary (completed, in-progress, pending)
- Include 2-3 linked stories per node

### API Route Pattern
- Routes nest under `/api/apps/[id]/workflows/...`
- Follow same patterns as environment/module/feature/test-coverage routes
- All routes are GET-only (read-only tab)
- Validate `appId` exists before returning data
- Response format: `{ data: T }` for success, `{ error: { code, message } }` for errors
- Return 404 if app not found

### Hook Pattern
- File: `src/hooks/use-workflows.ts`
- Follow same TanStack Query pattern as `use-test-coverage.ts`
- Query keys: `['workflows', appId]`, `['workflow-detail', appId, workflowId]`, `['node-detail', appId, workflowId, nodeId]`
- All hooks are read-only (no mutations needed)
- Enable queries only when IDs are provided (`enabled: !!appId`)

### UI Component Pattern
- Directory: `src/components/features/app-workflows/`
- Follow same component structure as `app-test-coverage/`
- Use `@xyflow/react` (already installed v12.10.1) for workflow diagrams:
  ```tsx
  import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
  import '@xyflow/react/dist/style.css'
  ```
- Custom node: Use a custom React Flow node type `workflowStep` that renders a card with label and colored status dot
- Node status colors:
  - Completed: green `#16A34A` / bg `#DCFCE7`
  - In-progress: amber `#D97706` / bg `#FEF3C7`
  - Pending: neutral `#9A948D` / bg `#E8E4E0`
- Workflow status badge colors:
  - Active: green bg `#DCFCE7` text `#16A34A`
  - Draft: amber bg `#FEF3C7` text `#D97706`
  - Archived: neutral bg `#F3F4F6` text `#6B7280`
- Use design tokens from existing code:
  - Primary Blue: `#2563EB`
  - Primary Orange: `#FF6B35`
  - Neutral: `#9A948D`, `#E8E4E0`, `#F5F2EF`
  - Text Dark: `#2D1810`
- Loading skeleton pattern: `animate-pulse` divs matching layout
- Empty state: centered message with icon
- Node detail panel: Fixed-width right panel (320px), border-left, with close button

### React Flow Specifics
- Import CSS: `import '@xyflow/react/dist/style.css'`
- Use `fitView` prop on ReactFlow to auto-fit diagram
- Use `nodeTypes` prop to register custom node components
- Set `nodesDraggable={false}` (read-only view, no editing)
- Set `nodesConnectable={false}` (no connection editing)
- Use `onNodeClick` handler to select node and show detail panel
- Container must have explicit height (e.g., `h-[500px]`)

### Testing Standards
- Framework: Vitest + React Testing Library
- Write tests BEFORE implementation (red-green-refactor)
- Test file naming: `*.test.ts` or `*.test.tsx` colocated with source
- Mock fetch with `vi.spyOn(globalThis, 'fetch')`
- Mock hooks with `vi.mock('@/hooks/use-workflows')`
- For React Flow components: mock `@xyflow/react` — React Flow renders canvas elements that don't work well with JSDOM. Mock the ReactFlow component to render a simple div with node data-testids.
- Use `QueryClientProvider` wrapper for hook tests
- Test: loading states, error states, empty states, data display, workflow selection, node click, panel display

### Integration Point
- File to modify: `src/components/features/app-detail/app-detail.tsx`
- Import `AppWorkflows` from `../app-workflows/app-workflows`
- Add `activeTab === 'workflows'` condition rendering `<AppWorkflows appId={appId} />`
- Update the fallback condition to exclude `'workflows'` from "Coming soon"
- Same pattern used for `environments`, `modules`, and `tests` tabs

### Project Structure Notes
- All new files go under `zoniq/src/`
- Types: `src/types/workflow.ts`
- Mock data: `src/lib/workflows/mock-data.ts`
- API routes: `src/app/api/apps/[id]/workflows/`
- Hooks: `src/hooks/use-workflows.ts`
- Components: `src/components/features/app-workflows/`

### Previous Story Intelligence (2-7)
- Story 2-7 followed red-green-refactor perfectly with 59 tests
- Test patterns for read-only tabs are well established
- App-detail integration is a single import + render condition
- 541 tests passing at story 2-7 completion across 60 files
- Linter: 0 errors (3 pre-existing warnings)

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.8 - FR59-FR68]
- [Source: _bmad-output/planning-artifacts/_docs/prd.md#FR66-FR68 Workflows Tab]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#@xyflow/react FR99-FR103]
- [Source: _bmad-output/implementation-artifacts/2-7-app-test-coverage-tab.md - patterns]
- [Source: zoniq/src/components/features/app-detail/app-detail.tsx - integration point]
- [Source: zoniq/package.json - @xyflow/react v12.10.1 already installed]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- 56 new tests added (10 type + 15 mock data + 12 API + 7 hooks + 11 UI + 1 integration)
- All 597 tests pass across 67 test files with 0 regressions
- Linter: 0 errors (3 pre-existing warnings)
- All 3 acceptance criteria satisfied
- Red-green-refactor cycle followed for every task
- React Flow (@xyflow/react v12.10.1) used for workflow diagrams with custom node types
- React Flow mocked in tests (JSDOM doesn't support canvas)

### File List

New files:
- zoniq/src/types/workflow.ts
- zoniq/src/types/workflow.test.ts
- zoniq/src/lib/workflows/mock-data.ts
- zoniq/src/lib/workflows/mock-data.test.ts
- zoniq/src/app/api/apps/[id]/workflows/route.ts
- zoniq/src/app/api/apps/[id]/workflows/route.test.ts
- zoniq/src/app/api/apps/[id]/workflows/[workflowId]/route.ts
- zoniq/src/app/api/apps/[id]/workflows/[workflowId]/route.test.ts
- zoniq/src/app/api/apps/[id]/workflows/[workflowId]/nodes/[nodeId]/route.ts
- zoniq/src/app/api/apps/[id]/workflows/[workflowId]/nodes/[nodeId]/route.test.ts
- zoniq/src/hooks/use-workflows.ts
- zoniq/src/hooks/use-workflows.test.ts
- zoniq/src/components/features/app-workflows/app-workflows.tsx
- zoniq/src/components/features/app-workflows/app-workflows.test.tsx
- zoniq/src/components/features/app-workflows/workflow-list.tsx
- zoniq/src/components/features/app-workflows/workflow-diagram.tsx
- zoniq/src/components/features/app-workflows/node-detail-panel.tsx

Modified files:
- zoniq/src/components/features/app-detail/app-detail.tsx
- zoniq/src/components/features/app-detail/app-detail.test.tsx
