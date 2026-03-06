# Atomized Workflow Implementation Tasks

> Execute ONE task per Claude session. Mark [x] when done.
> Plan reference: `_bmad-output/implementation-artifacts/ATOMIZED-DEV-WORKFLOW-PLAN.md`

---

## Phase 1: Core Workflows (BMAD)

### 1.1 dev-story-analyze Workflow
- [x] 1.1.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-analyze/`
- [x] 1.1.2 Create `workflow.yaml` with metadata (name, description, inputs, outputs)
- [x] 1.1.3 Create `instructions.xml` with steps: find story → load context → output plan.md and session.yaml
- [x] 1.1.4 Create `.dev-session/.gitkeep` and add `.dev-session/` to `.gitignore`
- [x] 1.1.5 Test: Run `/bmad-bmm-dev-story-analyze` on story 2-0, verify plan.md and session.yaml created

### 1.2 dev-story-task Workflow
- [x] 1.2.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-task/`
- [x] 1.2.2 Create `workflow.yaml` with metadata and `--task=N` parameter
- [x] 1.2.3 Create `instructions.xml` with steps: read session.yaml → read plan.md → implement ONE task → output progress-N.md → update session.yaml
- [x] 1.2.4 Test: Run `/bmad-bmm-dev-story-task --task=1` on story 2-0

### 1.3 dev-story-verify Workflow
- [x] 1.3.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-verify/`
- [x] 1.3.2 Create `workflow.yaml`
- [x] 1.3.3 Create `instructions.xml` with steps: read all progress files → run npm test → run npm lint → run npm build → output verification.md
- [x] 1.3.4 Test: Run `/bmad-bmm-dev-story-verify` after implementing at least one task

### 1.4 dev-story-complete Workflow
- [x] 1.4.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-complete/`
- [x] 1.4.2 Create `workflow.yaml`
- [x] 1.4.3 Create `instructions.xml` with steps: read all session files → update story file (mark tasks done, update file list) → update sprint-status.yaml → archive session
- [x] 1.4.4 Test: Run `/bmad-bmm-dev-story-complete` after verification passes

### 1.5 context-handoff System
- [x] 1.5.1 Create context-handoff.md template file in `_bmad/bmm/workflows/4-implementation/dev-story-analyze/templates/`
- [x] 1.5.2 Update dev-story-analyze to output initial context-handoff.md
- [x] 1.5.3 Update dev-story-task to READ context-handoff.md at session start
- [x] 1.5.4 Update dev-story-task to UPDATE context-handoff.md after implementation (exports registry, patterns)
- [x] 1.5.5 Test: Verify Task 2 session can import from Task 1's exports

### 1.6 dev-story-replan Workflow
- [x] 1.6.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-replan/`
- [x] 1.6.2 Create `workflow.yaml`
- [x] 1.6.3 Create `instructions.xml` with steps: read session.yaml (get reason) → read plan → adjust future tasks → update session.yaml with plan_history
- [x] 1.6.4 Update session.yaml schema to include: `plan_version`, `replan_reason`, `replan_proposal`, `replan_history`
- [x] 1.6.5 Update dev-story-task to detect plan issues and write replan_reason to session.yaml, then HALT
- [x] 1.6.6 Test: Trigger replan from a task that's too large, verify Ralph routes to replan

### 1.7 dev-session-status CLI
- [x] 1.7.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-session-status/`
- [x] 1.7.2 Create `workflow.yaml`
- [x] 1.7.3 Create `instructions.xml` with status calculation and output formatting
- [x] 1.7.4 Implement --json flag output
- [x] 1.7.5 Implement --short flag (single line)
- [x] 1.7.6 Test: Run status command mid-session

---

## Phase 2: Story Dev Dashboard App

### 2.1 Dashboard Setup
- [x] 2.1.1 Create folder `tools/story-dev-dashboard/`
- [x] 2.1.2 Initialize Next.js 16 app with TypeScript and Tailwind CSS 4
- [x] 2.1.3 Configure port 3456 in next.config.ts
- [x] 2.1.4 Install dependencies (lucide-react for icons)

### 2.2 API Endpoints
- [x] 2.2.1 Create `GET /api/sprint-status` - Read sprint-status.yaml
- [x] 2.2.2 Create `GET /api/stories/[key]/route.ts` - Read story file
- [x] 2.2.3 Create `PUT /api/stories/[key]/route.ts` - Update story file
- [x] 2.2.4 Create `GET /api/dev-session/[key]/route.ts` - Read session state
- [x] 2.2.5 Create `POST /api/dev-session/[key]/analyze/route.ts` - Trigger analyze workflow
- [x] 2.2.6 Create `POST /api/dev-session/[key]/task/[num]/route.ts` - Trigger task workflow
- [x] 2.2.7 Create `POST /api/dev-session/[key]/verify/route.ts` - Trigger verify workflow
- [x] 2.2.8 Create `POST /api/dev-session/[key]/complete/route.ts` - Trigger complete workflow
- [x] 2.2.9 Create `POST /api/git/commit/route.ts` - Git commit
- [x] 2.2.10 Create `POST /api/git/push/route.ts` - Git push

### 2.3 Live Stream Implementation
- [x] 2.3.1 Create `GET /api/dev-session/[key]/stream/route.ts` - SSE endpoint
- [x] 2.3.2 Create `components/LiveStreamPanel.tsx` - Live stream display component
- [x] 2.3.3 Create `components/StreamLine.tsx` - Individual stream line component
- [x] 2.3.4 Test: Verify SSE connection and real-time updates (deferred to Phase 2.6)

### 2.4 Frontend Components
- [x] 2.4.1 Create `components/StorySelector.tsx` - Story list from sprint-status.yaml
- [x] 2.4.2 Create `components/StoryDetail.tsx` - Tabbed story viewer (Story, AC, Tasks, Dev Notes, User Tasks)
- [x] 2.4.3 Create `components/DevSessionPanel.tsx` - Task progress display
- [x] 2.4.4 Create `components/UserTasksPanel.tsx` - Manual configuration/testing tasks
- [x] 2.4.5 Create `components/ActionsBar.tsx` - Action buttons (Analyze, Implement, Verify, Complete, Review)
- [x] 2.4.6 Create `components/EditStoryMode.tsx` - Edit AC, tasks, dev notes
- [x] 2.4.7 Create `app/page.tsx` - Main page with story selector
- [x] 2.4.8 Create `app/story/[key]/page.tsx` - Story detail page

### 2.5 Git Integration
- [x] 2.5.1 Test: Verify commit action stages changes and generates commit message
- [x] 2.5.2 Test: Verify push action commits then pushes to remote
- [x] 2.5.3 Test: Verify branch management (optional feature)

### 2.6 Integration Testing
- [x] 2.6.1 Test: Full end-to-end workflow (Analyze → Task → Verify → Complete)
- [x] 2.6.2 Test: Multiple concurrent sessions
- [x] 2.6.3 Test: Error handling and recovery

---

## Summary

| Section | Tasks | Status |
|---------|-------|--------|
| 1.1 dev-story-analyze | 5 | ✅ Complete |
| 1.2 dev-story-task | 4 | ✅ Complete |
| 1.3 dev-story-verify | 4 | ✅ Complete |
| 1.4 dev-story-complete | 4 | ✅ Complete |
| 1.5 context-handoff | 5 | ✅ Complete |
| 1.6 dev-story-replan | 6 | ✅ Complete |
| 1.7 dev-session-status | 6 | ✅ Complete |
| **Phase 1 TOTAL** | **34** | **✅ Complete** |
| 2.1 Dashboard Setup | 3 | ✅ Complete |
| 2.2 API Endpoints | 10 | ✅ Complete |
| 2.3 Live Stream Implementation | 4 | ✅ Complete |
| 2.4 Frontend Components | 8 | ✅ Complete |
| 2.5 Git Integration | 3 | ✅ Complete |
| 2.6 Integration Testing | 3 | ✅ Complete |
| **Phase 2 TOTAL** | **31** | **✅ Complete** |
| **TOTAL** | **65** | **✅ Complete** |

---

## Execution Instructions

### For Ralph Loop:
```
ralph
```
Each iteration implements ONE task and marks it [x].

### For Manual Execution:
```
Read `.ralph/atomized-workflow-tasks.md` and implement the FIRST unchecked task ONLY. Mark it [x] when done.
```

---

EXIT_SIGNAL: true
