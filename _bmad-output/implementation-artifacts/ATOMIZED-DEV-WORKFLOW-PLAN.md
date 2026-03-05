# Atomized Development Workflow Refactor Plan

> **Purpose:** Refactor BMAD dev-story workflow to prevent context hangs by breaking development into truly atomic steps, each executed in a fresh Claude session. Also includes a local dashboard app for managing story development.

> **Created:** 2026-03-05
> **Author:** David + Claude

---

## Part 1: Problem Analysis

### Current Issue
- `/bmad-bmm-dev-story` is a MONOLITHIC workflow (10 steps in one session)
- Even with ralph loop atomizing at story level, `dev-story` alone can hang
- Context accumulates: story file + codebase scans + implementation + testing = token overflow

### Current Workflow (Single Session)
```
dev-story (one Claude session):
  Step 1: Find & load story
  Step 2: Load project context
  Step 3: Detect review continuation
  Step 4: Mark in-progress
  Step 5: Implement task (red-green-refactor) × N tasks
  Step 6: Write tests
  Step 7: Run validations
  Step 8: Mark complete
  Step 9: Story completion
  Step 10: User communication
```

### Target: Atomized Workflow (Multiple Fresh Sessions)
```
Each step = ONE fresh Claude session with minimal context

dev-story-analyze     → outputs: .dev-session/plan.md, context-handoff.md (initial)
dev-story-task-N      → reads plan + context-handoff, implements ONE task, outputs: progress-N.md, updates context-handoff.md
dev-story-verify      → reads progress, runs tests, outputs: .dev-session/verification.md
dev-story-complete    → reads all, updates story status
dev-story-replan      → when tasks need re-planning mid-implementation, updates plan.md (REQUIRES HUMAN APPROVAL)
dev-session-status    → CLI command to check progress without GUI
```

### Key Innovation: Inter-Task Context Handoff
The `context-handoff.md` file is the critical link between sessions. It captures not just *what* was done, but the *patterns, interfaces, and decisions* that the next session needs to continue seamlessly.

---

## Part 2: Refactored Workflow Design

### New Workflow Files to Create

#### 1. `dev-story-analyze` (Workflow)
**Location:** `_bmad/bmm/workflows/4-implementation/dev-story-analyze/`

**Purpose:** Analyze story and create implementation plan (FRESH CONTEXT)

**Inputs:**
- Story file path OR sprint-status.yaml (auto-discover)
- project-context.md (if exists)

**Outputs:** `.dev-session/{story-key}/plan.md`
```markdown
# Dev Session Plan: {story-key}

## Story Summary
{brief description}

## Tasks to Implement
- [ ] Task 1: {description}
  - Files to create/modify: {list}
  - Dependencies: {list}
- [ ] Task 2: {description}
  ...

## Architecture Context
{relevant patterns from dev notes}

## Design Tokens Needed
{colors, spacing, typography}

## Risks / Edge Cases
{from dev notes}
```

**Additional Outputs:** `.dev-session/{story-key}/context-handoff.md` (initial version)
```markdown
# Context Handoff: {story-key}

> Last updated: {timestamp} | After: Analysis

## 🏗️ Architecture Decisions

### Patterns to Follow
- {from story dev notes}

### Folder Structure Planned
```
src/
├── components/features/
│   └── {feature}/
```

## 📦 Expected Exports
_TBD after task implementation_

## 🔗 Task Dependencies
{calculated from task analysis}

## ⚠️ Constraints
{from story dev notes}
```

**Session State File:** `.dev-session/{story-key}/session.yaml`
```yaml
story_key: 2-0-home-page-dashboard-layout
story_path: _bmad-output/implementation-artifacts/2-0-home-page-dashboard-layout.md
current_task: 1
total_tasks: 9
status: analyzed
created: 2026-03-05T10:00:00Z
allows_auto_replan: false  # Human must approve replans
```

---

#### 2. `dev-story-task` (Workflow)
**Location:** `_bmad/bmm/workflows/4-implementation/dev-story-task/`

**Purpose:** Implement ONE task from the plan (FRESH CONTEXT)

**Inputs:**
- `.dev-session/{story-key}/session.yaml` (reads current_task)
- `.dev-session/{story-key}/plan.md`
- `.dev-session/{story-key}/context-handoff.md` (reads previous session's outputs)
- Story file (reads ONLY relevant task section)

**Outputs:**
- Updated files (actual implementation)
- `.dev-session/{story-key}/progress-{N}.md`
- `.dev-session/{story-key}/context-handoff.md` (UPDATED with new exports/patterns)
```markdown
# Task {N} Progress: {task-name}

## What Was Done
- Created file X
- Modified file Y

## Tests Written
- test-file-1.ts

## Verification
- [ ] Unit tests pass
- [ ] Lint passes

## Issues Encountered
{any blockers or notes}

## Files Changed
- src/components/foo.tsx (created)
- src/app/page.tsx (modified)
```

**Session State Update:**
```yaml
current_task: 2  # incremented
status: in-progress
last_updated: 2026-03-05T10:15:00Z
```

---

#### 3. `dev-story-verify` (Workflow)
**Location:** `_bmad/bmm/workflows/4-implementation/dev-story-verify/`

**Purpose:** Run all tests and lint for completed tasks (FRESH CONTEXT)

**Inputs:**
- `.dev-session/{story-key}/session.yaml`
- All `.dev-session/{story-key}/progress-*.md` files

**Outputs:**
- `.dev-session/{story-key}/verification.md`
```markdown
# Verification Report: {story-key}

## Test Results
- Unit tests: PASS (12/12)
- Integration tests: PASS (3/3)
- E2E tests: SKIPPED (not configured)

## Lint Results
- ESLint: PASS (0 errors, 0 warnings)
- TypeScript: PASS (0 errors)

## Build Results
- npm run build: SUCCESS

## Regressions
- None detected

## Issues to Fix
{list if any, or "None"}
```

---

#### 4. `dev-story-complete` (Workflow)
**Location:** `_bmad/bmm/workflows/4-implementation/dev-story-complete/`

**Purpose:** Finalize story, update status (FRESH CONTEXT)

**Inputs:**
- All `.dev-session/{story-key}/*` files
- Story file

**Outputs:**
- Updated story file (tasks checked, file list updated, status = "review")
- Updated sprint-status.yaml (status = "review")
- Cleanup: archive `.dev-session/{story-key}/` to `.dev-session/archive/{story-key}-{date}/`

---

#### 5. `dev-story-replan` (Workflow)
**Location:** `_bmad/bmm/workflows/4-implementation/dev-story-replan/`

**Purpose:** Adjust the plan when task implementation reveals the original breakdown was wrong. Runs in fresh context.

**When Triggered:**
1. A `dev-story-task` sets `status: needs-replan` in session.yaml (task discovered issue)
2. Developer manually decides plan needs adjustment
3. Ralph loop detects `needs-replan` status and routes here instead of next task

**Inputs:**
- `.dev-session/{story-key}/session.yaml` (contains `replan_reason` set by task)
- `.dev-session/{story-key}/plan.md` (current plan)
- `.dev-session/{story-key}/context-handoff.md` (what's actually been built)
- All `.dev-session/{story-key}/progress-*.md` files
- Story file

**Outputs:**

**Updated `.dev-session/{story-key}/plan.md`:**
- Completed tasks marked done (UNCHANGED - cannot modify)
- Remaining tasks adjusted based on learnings
- New tasks inserted if needed
- Removed tasks noted with reason

**Updated `.dev-session/{story-key}/session.yaml`:**
```yaml
total_tasks: 10          # may change
plan_version: 2          # incremented
status: in-progress      # cleared from needs-replan
replan_reason: ""        # cleared after processing
replan_history:
  - version: 1
    reason: "Task 3 discovered dropdown needs different API"
    tasks_before: 9
    tasks_after: 10
    timestamp: 2026-03-05T11:00:00Z
```

**CRITICAL CONSTRAINT:** Replan must NOT invalidate already-completed work. It can only adjust future tasks.

**How dev-story-task Triggers Replan:**

When a task discovers the plan is wrong, it:
1. Writes to session.yaml:
   ```yaml
   status: needs-replan
   replan_reason: "Task 4 is too large - 5 widgets cannot fit in one session"
   replan_proposal: "Split into 4a, 4b, 4c"
   ```
2. Writes partial progress to `progress-N.md`
3. HALTS - does not continue

**Ralph Loop Detection:**
- Ralph checks session.yaml after each task
- If `status: needs-replan`, runs `/bmad-bmm-dev-story-replan` instead of next task
- User sees replan reason in output
- Fresh session reads reason from file (not asked)

---

#### 6. `dev-session-status` (CLI Command)
**Location:** `_bmad/bmm/workflows/4-implementation/dev-session-status/`

**Purpose:** Quick progress visibility without GUI

**Command:**
```bash
/bmad-bmm-dev-session-status [--story=KEY] [--json] [--watch] [--short]
```

**Human-Readable Output:**
```
╔═══════════════════════════════════════════════════════════════╗
║  Dev Session Status: 2-0-home-page-dashboard-layout           ║
╠═══════════════════════════════════════════════════════════════╣
║  Phase: task                                                  ║
║  Status: in-progress                                          ║
║  Progress: ████████░░░░░░░░░░ 5/12 tasks (42%)               ║
╠═══════════════════════════════════════════════════════════════╣
║  Current:                                                     ║
║    ▶ Task 6: Create Mini Kanban Component                     ║
║                                                               ║
║  Remaining: 7 tasks                                           ║
╠═══════════════════════════════════════════════════════════════╣
║  Files Changed: 14 | Tests: 8 passing | Duration: 0:23:45    ║
╚═══════════════════════════════════════════════════════════════╝
```

**CLI Options:**
| Flag | Description |
|------|-------------|
| `--story=KEY` | Specify story key |
| `--json` | JSON output for scripting |
| `--watch` | Update every 5 seconds |
| `--short` | Single line: `[2-0] 5/12 (42%) - Task 6` |

---

## Part 2.5: Inter-Task Context Handoff System

### The Problem
When each task runs in a fresh session, the next session doesn't know:
- What interfaces/types were defined
- What exports are available
- What patterns were established
- What naming conventions were chosen

### The Solution: `context-handoff.md`

**Full Schema:**
```markdown
# Context Handoff: {story-key}

> Last updated: {timestamp} | After: Task {N}

## 🏗️ Architecture Decisions

### Patterns Established
- **Component Pattern:** {e.g., "All components use 'use client' at top"}
- **Naming:** {e.g., "Feature components in features/X/ folders"}
- **State Management:** {e.g., "Using React useState, no global state yet"}

### Folder Structure Created
```
src/
├── components/features/
│   └── topbar/
│       ├── topbar.tsx         # Main component
│       ├── nav-item.tsx       # Nav link component
│       └── index.ts           # Exports: Topbar, NavItem
```

---

## 📦 Exports Registry

### Components
| Name | File | Props | Description |
|------|------|-------|-------------|
| `Topbar` | `topbar.tsx` | `{user, onLogout}` | Main navigation bar |
| `NavItem` | `nav-item.tsx` | `{href, label, active, visible}` | Navigation link |

### Hooks
| Name | File | Signature | Description |
|------|------|-----------|-------------|
| `useUserRole` | `hooks/use-user-role.ts` | `() => role: string` | Returns Clerk user role |

### Utils
| Name | File | Signature | Description |
|------|------|-----------|-------------|
| `cn` | `lib/utils/cn.ts` | `(...classes) => string` | Tailwind class merger |

### Types/Interfaces
```typescript
// types/navigation.ts
interface NavItem {
  href: string;
  label: string;
  visible: 'all' | 'admin' | 'pm';
}

// types/user.ts
interface UserProfile {
  id: string;
  role: 'admin' | 'pm' | 'consultant';
  name: string;
}
```

---

## 🔗 Dependencies Between Tasks

### Task Dependencies Graph
```
Task 1 (Dashboard Layout)
  └─→ Task 2 (Topbar) depends on: [none]
  └─→ Task 3 (Nav Items) depends on: Task 2 (needs Topbar component)
  └─→ Task 4 (Widgets) depends on: Task 1 (needs Dashboard layout)

Current: Task 3
Blocked by: [none]
Blocks: [Task 4, Task 5]
```

---

## ⚠️ Constraints & Gotchas

### Must Follow
- Always use `cn()` for conditional classes
- Clerk's `useUser()` returns null during loading - handle gracefully
- shadcn/ui components require `variant` prop, not custom classes

### Avoid
- Don't modify `src/components/ui/*` - use as-is
- Don't create new Clerk webhook endpoints (out of scope)
- Don't use inline styles - always Tailwind

---

## 📝 Decisions Made

| Decision | Choice | Rationale | Task |
|----------|--------|-----------|------|
| Auth library | Clerk | Already in project | 1-2 |
| Component folder | `features/` | Matches existing pattern | 2-0 |
| Role check location | Client-side | No SSR needed for dashboard | 2-3 |

---

## 🔄 In Progress / Partial Work

### Task 3 Status
- ✅ Created NavItem component
- ✅ Added role-based visibility logic
- ⏳ PENDING: Masterdata/Accounts nav items (need PM role defined)
- ❌ BLOCKED: None

### Files With Partial Implementation
| File | Status | What's Done | What's Needed |
|------|--------|-------------|---------------|
| `nav-item.tsx` | 80% | Basic render, styling | Active state prop |
| `navigation.tsx` | 50% | Structure | Role visibility logic |

---

## 🎯 Next Task Hints

### Task 4: Dashboard Widgets
- **Use:** `NavItem` from Task 3 for widget headers
- **Pattern:** Same card structure as Task 1's loading skeleton
- **Watch out:** Widgets need placeholder data - don't fetch real API yet

### Quick Copy-Paste
```typescript
// Import pattern for Task 4
import { Topbar } from '@/components/features/topbar';
import { cn } from '@/lib/utils/cn';
import type { NavItem } from '@/types/navigation';
```
```

---

## Part 3: Ralph Loop Integration

### New `.ralph/fix_plan.md` Format

```markdown
# BMAD Zoniq - Story 2-0 Implementation

## Story 2-0: Home Page Dashboard Layout

| # | Task | Status |
|---|------|--------|
| 0.1 | Run `/bmad-bmm-dev-story-analyze` for story 2-0 | [ ] |
| 1.1 | Run `/bmad-bmm-dev-story-task` for task 1 | [ ] |
| 1.2 | Run `/bmad-bmm-dev-story-task` for task 2 | [ ] |
| 1.3 | Run `/bmad-bmm-dev-story-task` for task 3 | [ ] |
| 1.4 | Run `/bmad-bmm-dev-story-task` for task 4 | [ ] |
| 1.5 | Run `/bmad-bmm-dev-story-task` for task 5 | [ ] |
| 1.6 | Run `/bmad-bmm-dev-story-task` for task 6 | [ ] |
| 1.7 | Run `/bmad-bmm-dev-story-task` for task 7 | [ ] |
| 1.8 | Run `/bmad-bmm-dev-story-task` for task 8 | [ ] |
| 1.9 | Run `/bmad-bmm-dev-story-task` for task 9 | [ ] |
| 2.0 | Run `/bmad-bmm-dev-story-verify` | [ ] |
| 3.0 | Run `/bmad-bmm-dev-story-complete` | [ ] |
| 4.0 | Run `/bmad-bmm-code-review` | [ ] |

EXIT_SIGNAL: false
```

### Key Principle
**Each row = ONE fresh Claude session**

Ralph reads this file, executes ONE command, marks it done, then exits. The NEXT Ralph iteration starts fresh.

---

## Part 4: Story Dev Dashboard (Local App)

### Overview
A local web application to manage story development without terminal commands.

### Tech Stack
- **Electron** or **Tauri** (desktop app) OR **Next.js local server**
- React + TypeScript
- Tailwind CSS

### Features

#### 4.1 Story Selector
```
┌─────────────────────────────────────────────────────────────┐
│ Sprint Status                                    [Refresh]  │
├─────────────────────────────────────────────────────────────┤
│ Epic 1: Authentication & Setup                     [DONE]   │
│   ├─ 1-1 Initialize NextJS                    ✓ done        │
│   ├─ 1-2 Configure Clerk                      ✓ done        │
│   └─ ...                                                    │
│                                                             │
│ Epic 2: Core Dashboard                         [IN PROGRESS]│
│   ├─ 2-0 Home Page Dashboard             [in-progress] ▶    │  ← clickable
│   ├─ 2-1 Customer CRUD                   [backlog]          │
│   └─ ...                                                    │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2 Story Detail View
```
┌─────────────────────────────────────────────────────────────┐
│ Story 2-0: Home Page Dashboard Layout          [Edit Story] │
│ Status: in-progress                                         │
├─────────────────────────────────────────────────────────────┤
│ TABS: [Story] [AC] [Tasks] [Dev Notes] [User Tasks]         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STORY:                                                      │
│ As a user, I want to see a dashboard layout with navigation │
│ and quick actions when I log in...                          │
│                                                             │
│ ACCEPTANCE CRITERIA:                                        │
│ ✓ AC1: Dashboard layout displayed at /dashboard             │
│ ✓ AC2: Role-aware navigation items                          │
│ ○ AC3: Create dropdown with quick options                   │
│ ○ AC4: Quick create opens appropriate form                  │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

#### 4.3 Dev Session Panel
```
┌─────────────────────────────────────────────────────────────┐
│ Dev Session: 2-0-home-page-dashboard-layout                 │
├─────────────────────────────────────────────────────────────┤
│ Tasks Progress: ████████░░ 8/9 (89%)                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Analyze Story]     ← Run /dev-story-analyze            │ │
│ │ Status: ✓ Complete                                      │ │
│ │ Output: .dev-session/2-0-.../plan.md                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Task 1: Create Dashboard Layout Structure               │ │
│ │ [▶ Implement Task 1]  ← Run /dev-story-task --task=1   │ │
│ │ Status: ✓ Complete                                      │ │
│ │ Files: dashboard/page.tsx, ...                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Task 2: Create Unified Topbar Component                 │ │
│ │ [▶ Implement Task 2]                                    │ │
│ │ Status: ✓ Complete                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Task 3: Implement Navigation Items                      │ │
│ │ [▶ Implement Task 3]                                    │ │
│ │ Status: ⏳ Current                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ... Tasks 4-9 (collapsed) ...                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [▶ Run Verification]     ← Run /dev-story-verify       │ │
│ │ Status: ○ Pending                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [▶ Complete Story]       ← Run /dev-story-complete     │ │
│ │ Status: ○ Pending                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 4.4 User Tasks Panel (What YOU need to do)
```
┌─────────────────────────────────────────────────────────────┐
│ 👤 User Tasks (Manual Steps Required)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚠️ CONFIGURATION NEEDED:                                    │
│ - [ ] Add environment variable: NEXT_PUBLIC_API_URL         │
│ - [ ] Configure Clerk webhook endpoint                      │
│                                                             │
│ 🧪 MANUAL TESTING:                                          │
│ - [ ] Test login flow with Google OAuth                     │
│ - [ ] Verify admin navigation shows for admin user          │
│ - [ ] Check responsive layout on mobile                     │
│                                                             │
│ 📝 REVIEW NOTES:                                            │
│ - Story 2-0 uses placeholder data for widgets               │
│ - Real data integration comes in Story 2-1                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.5 Actions Bar
```
┌─────────────────────────────────────────────────────────────┐
│ [▶ Develop Next Task] [▶ Verify All] [▶ Complete Story]    │
│ [▶ Run Code Review]    [📝 Edit Story]  [🔄 Reset Session] │
│                                                             │
│ [💾 Commit Changes] [🚀 Commit & Push]                      │
└─────────────────────────────────────────────────────────────┘
```

#### 4.6 Live Stream Panel (When Action is Running)
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🔄 Running: dev-story-task --task=3               [⏸️ Pause] [⏹️ Stop] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─ Claude Output (Live Stream) ───────────────────────────────────────┐│
│ │                                                                     ││
│ │ > Analyzing task 3: Implement Navigation Items...                   ││
│ │                                                                     ││
│ │ 📖 Reading: src/components/features/topbar/nav-item.tsx             ││
│ │                                                                     ││
│ │ > Creating navigation item component with role-based visibility     ││
│ │                                                                     ││
│ │ ✏️  Writing: src/components/features/topbar/navigation.tsx          ││
│ │    └─ Dashboard nav item (visible to all)                           ││
│ │    └─ Kanban nav item (visible to all)                              ││
│ │    └─ Masterdata nav item (admin/PM only)                           ││
│ │                                                                     ││
│ │ > Implementing role check using Clerk's useUser hook...             ││
│ │                                                                     ││
│ │ 🔧 Bash: npm run lint                                               ││
│ │    ✓ No lint errors                                                 ││
│ │                                                                     ││
│ │ > Task 3 implementation complete, updating progress file...         ││
│ │                                                                     ││
│ │ ▌  ← cursor blinking here (streaming in real-time)                  ││
│ │                                                                     ││
│ └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│ ┌─ Progress ──────────────────────────────────────────────────────────┐│
│ │ Phase: Task Implementation                                          ││
│ │ Task: 3 of 9                                                        ││
│ │ Tokens: ~12,400 used                                                ││
│ │ Duration: 0:02:34                                                   ││
│ └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Stream Event Types (SSE):**
```typescript
type StreamEvent =
  | { type: 'text'; content: string }           // Claude's text output
  | { type: 'tool_use'; tool: string; input: any }  // Tool being called
  | { type: 'tool_result'; tool: string; output: any } // Tool result
  | { type: 'file_read'; path: string }         // File being read
  | { type: 'file_write'; path: string; lines: number }  // File being written
  | { type: 'bash'; command: string }           // Bash command
  | { type: 'bash_result'; exitCode: number; output: string }
  | { type: 'progress'; task: number; phase: string }
  | { type: 'error'; message: string }
  | { type: 'complete'; summary: string }
```

**UI Features:**
- Auto-scroll to bottom (toggleable)
- Color-coded output:
  - White: Claude text
  - Blue: Tool calls
  - Green: File operations
  - Yellow: Bash commands
  - Red: Errors
  - Gray: Timestamps
- Collapsible tool results
- Search/filter within output
- Export to file button

#### 4.7 Edit Story Mode
```
┌─────────────────────────────────────────────────────────────┐
│ Edit Story 2-0                                    [Cancel][Save]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Story Text:                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ As a user,                                              │ │
│ │ I want to see a dashboard layout...                     │ │
│ │ [editable textarea]                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Acceptance Criteria:                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [+] Add AC                                              │ │
│ │                                                         │ │
│ │ AC1: [editable]                           [↑][↓][🗑️]    │ │
│ │ AC2: [editable]                           [↑][↓][🗑️]    │ │
│ │ AC3: [editable]                           [↑][↓][🗑️]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Tasks:                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [+] Add Task                                            │ │
│ │                                                         │ │
│ │ Task 1: [editable]                                      │ │
│ │   └─ Subtask 1.1: [editable]                            │ │
│ │   └─ Subtask 1.2: [editable]                            │ │
│ │   [+] Add Subtask                                       │ │
│ │                                                         │ │
│ │ Task 2: [editable]                                      │ │
│ │ ...                                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Dev Notes:                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [editable markdown]                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 5: Implementation Steps

### Phase 1: Atomized Workflows (BMAD Core)

1. **Create `dev-story-analyze` workflow**
   - `_bmad/bmm/workflows/4-implementation/dev-story-analyze/workflow.yaml`
   - `_bmad/bmm/workflows/4-implementation/dev-story-analyze/instructions.xml`
   - Reads: story file, project-context.md
   - Outputs: `.dev-session/{story-key}/plan.md`, `.dev-session/{story-key}/session.yaml`

2. **Create `dev-story-task` workflow**
   - `_bmad/bmm/workflows/4-implementation/dev-story-task/workflow.yaml`
   - `_bmad/bmm/workflows/4-implementation/dev-story-task/instructions.xml`
   - Reads: session.yaml, plan.md, story file (partial)
   - Outputs: code changes, `.dev-session/{story-key}/progress-{N}.md`
   - Parameter: `--task=N` (which task to implement)

3. **Create `dev-story-verify` workflow**
   - `_bmad/bmm/workflows/4-implementation/dev-story-verify/workflow.yaml`
   - `_bmad/bmm/workflows/4-implementation/dev-story-verify/instructions.xml`
   - Reads: all progress files
   - Outputs: `.dev-session/{story-key}/verification.md`

4. **Create `dev-story-complete` workflow**
   - `_bmad/bmm/workflows/4-implementation/dev-story-complete/workflow.yaml`
   - `_bmad/bmm/workflows/4-implementation/dev-story-complete/instructions.xml`
   - Reads: all session files
   - Outputs: updated story file, updated sprint-status.yaml

5. **Update `.gitignore`**
   ```
   .dev-session/
   ```

### Phase 2: Story Dev Dashboard App

1. **Create Next.js app** (or Tauri desktop app)
   - Location: `tools/story-dev-dashboard/`
   - Port: 3456 (avoid conflicts)

2. **Features to implement:**
   - [ ] Story selector from sprint-status.yaml
   - [ ] Story detail viewer (tabbed: Story, AC, Tasks, Dev Notes, User Tasks)
   - [ ] Dev session panel with task progress
   - [ ] Action buttons (Analyze, Implement Task, Verify, Complete, Review)
   - [ ] User tasks panel (manual configuration/testing steps)
   - [ ] Edit story mode (modify AC, tasks, dev notes)
   - [ ] Git integration (Commit, Commit & Push)

3. **API endpoints:**
   - `GET /api/sprint-status` - Read sprint-status.yaml
   - `GET /api/stories/:key` - Read story file
   - `PUT /api/stories/:key` - Update story file
   - `GET /api/dev-session/:key` - Read session state
   - `POST /api/dev-session/:key/analyze` - Trigger analyze workflow
   - `POST /api/dev-session/:key/task/:num` - Trigger task workflow
   - `POST /api/dev-session/:key/verify` - Trigger verify workflow
   - `POST /api/dev-session/:key/complete` - Trigger complete workflow
   - `POST /api/git/commit` - Git commit
   - `POST /api/git/push` - Git push
   - `GET /api/dev-session/:key/stream` - **SSE endpoint for live output**

4. **Claude Code Integration (Live Stream):**
   - Dashboard spawns Claude Code subprocess for each workflow
   - **Live streaming output panel** (similar to `ralph --live`)
   - Real-time token-by-token streaming via Server-Sent Events (SSE)
   - Shows tool calls, file reads/writes, bash commands in real-time
   - Progress indicators and status updates
   - Ability to pause/cancel mid-execution

5. **Live Stream Technical Implementation:**

   **Backend (API Route):**
   ```typescript
   // app/api/dev-session/[key]/stream/route.ts
   import { spawn } from 'child_process';
   
   export async function GET(request: Request, { params }: { params: { key: string } }) {
     const encoder = new TextEncoder();
     const stream = new TransformStream();
     const writer = stream.writable.getWriter();
     
     // Spawn Claude Code process
     const claude = spawn('claude', ['--print', '--output-format', 'stream-json', prompt], {
       cwd: process.cwd(),
     });
     
     // Parse and forward events
     claude.stdout.on('data', async (data) => {
       const lines = data.toString().split('\n').filter(Boolean);
       for (const line of lines) {
         try {
           const event = JSON.parse(line);
           await writer.write(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
         } catch (e) {
           // Plain text output
           await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: line })}\n\n`));
         }
       }
     });
     
     claude.stderr.on('data', async (data) => {
       await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: data.toString() })}\n\n`));
     });
     
     claude.on('close', async () => {
       await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`));
       await writer.close();
     });
     
     return new Response(stream.readable, {
       headers: {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive',
       },
     });
   }
   ```

   **Frontend (React Component):**
   ```typescript
   // components/LiveStreamPanel.tsx
   'use client';
   
   import { useEffect, useState, useRef } from 'react';
   
   export function LiveStreamPanel({ storyKey, action, isRunning, onStop }: Props) {
     const [events, setEvents] = useState<StreamEvent[]>([]);
     const [status, setStatus] = useState({ phase: '', task: 0, tokens: 0, duration: 0 });
     const containerRef = useRef<HTMLDivElement>(null);
     
     useEffect(() => {
       if (!isRunning) return;
       
       const eventSource = new EventSource(`/api/dev-session/${storyKey}/stream?action=${action}`);
       
       eventSource.onmessage = (e) => {
         const event = JSON.parse(e.data);
         setEvents(prev => [...prev, { ...event, timestamp: Date.now() }]);
         
         if (event.type === 'progress') {
           setStatus(prev => ({ ...prev, ...event.data }));
         }
         if (event.type === 'complete') {
           eventSource.close();
           onStop();
         }
       };
       
       eventSource.onerror = () => eventSource.close();
       
       return () => eventSource.close();
     }, [isRunning, storyKey, action]);
     
     // Auto-scroll
     useEffect(() => {
       if (containerRef.current) {
         containerRef.current.scrollTop = containerRef.current.scrollHeight;
       }
     }, [events]);
     
     return (
       <div className="stream-panel">
         <div className="stream-header">
           <span>🔄 Running: {action}</span>
           <button onClick={onStop}>⏹️ Stop</button>
         </div>
         <div ref={containerRef} className="stream-output">
           {events.map((event, i) => (
             <StreamLine key={i} event={event} />
           ))}
         </div>
         <div className="stream-status">
           <span>Task: {status.task}</span>
           <span>Tokens: {status.tokens.toLocaleString()}</span>
           <span>Duration: {formatDuration(status.duration)}</span>
         </div>
       </div>
     );
   }
   ```

### Phase 3: Git Integration

1. **Commit action:**
   - Stage all changes
   - Generate commit message from story key + completed tasks
   - Commit

2. **Push action:**
   - Commit first (if uncommitted changes)
   - Push to remote

3. **Branch management (optional):**
   - Create feature branch per story
   - Merge/rebase options

---

## Part 6: Session State Schema

### `.dev-session/{story-key}/session.yaml`

```yaml
# Dev Session State
story_key: 2-0-home-page-dashboard-layout
story_path: _bmad-output/implementation-artifacts/2-0-home-page-dashboard-layout.md
sprint_status_path: _bmad-output/implementation-artifacts/sprint-status.yaml

# Progress
current_phase: task        # analyzed | task | verify | complete | done
current_task: 3            # 1-indexed
total_tasks: 9

# Timestamps
created: 2026-03-05T10:00:00Z
last_updated: 2026-03-05T10:45:00Z
analyzed_at: 2026-03-05T10:05:00Z
task_1_completed_at: 2026-03-05T10:15:00Z
task_2_completed_at: 2026-03-05T10:30:00Z
task_3_completed_at: null

# Status
status: in-progress        # analyzed | in-progress | verifying | complete | failed

# Files
plan_file: .dev-session/2-0-home-page-dashboard-layout/plan.md
progress_files:
  - .dev-session/2-0-home-page-dashboard-layout/progress-1.md
  - .dev-session/2-0-home-page-dashboard-layout/progress-2.md
verification_file: null

# Error tracking
errors: []
blockers: []
```

---

## Part 7: User Tasks Extraction

### Automatic Extraction Logic

The dashboard should automatically extract user tasks from the story file:

1. **Configuration Tasks:**
   - Scan Dev Notes for "environment variable", "config", "setup"
   - Look for `process.env.XXX` references not defined

2. **Manual Testing Tasks:**
   - Scan for tasks starting with "Manual test:"
   - Extract from acceptance criteria that require user action

3. **Dependencies:**
   - Look for "requires", "depends on", "prerequisite"
   - External service setup needed

### User Tasks Section in Story File (New Standard)

Add to story template:

```markdown
## User Tasks

> Tasks that require manual action by the developer/user

### Configuration Required
- [ ] Add `NEXT_PUBLIC_API_URL` to `.env.local`
- [ ] Configure Clerk webhook in dashboard

### Manual Testing Required
- [ ] Test OAuth login with Google
- [ ] Verify role-based navigation on different accounts

### External Dependencies
- [ ] Ensure MongoDB cluster is running
- [ ] Have test accounts available (admin, pm, consultant)
```

---

## Part 8: File Structure After Refactor

```
_bmad/
└── bmm/
    └── workflows/
        └── 4-implementation/
            ├── dev-story/                  # KEEP (for backward compat, mark deprecated)
            ├── dev-story-analyze/          # NEW
            │   ├── workflow.yaml
            │   └── instructions.xml
            ├── dev-story-task/             # NEW
            │   ├── workflow.yaml
            │   └── instructions.xml
            ├── dev-story-verify/           # NEW
            │   ├── workflow.yaml
            │   └── instructions.xml
            ├── dev-story-complete/         # NEW
            │   ├── workflow.yaml
            │   └── instructions.xml
            └── code-review/                # KEEP

tools/
└── story-dev-dashboard/                    # NEW
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                   # Story selector
    │   │   ├── story/[key]/page.tsx       # Story detail
    │   │   └── api/
    │   │       ├── sprint-status/route.ts
    │   │       ├── stories/[key]/route.ts
    │   │       ├── dev-session/[key]/route.ts
    │   │       └── git/route.ts
    │   └── components/
    │       ├── StorySelector.tsx
    │       ├── StoryDetail.tsx
    │       ├── DevSessionPanel.tsx
    │       ├── UserTasksPanel.tsx
    │       └── ActionsBar.tsx
    ├── package.json
    └── tailwind.config.ts

.dev-session/                               # NEW (gitignored)
├── 2-0-home-page-dashboard-layout/
│   ├── session.yaml
│   ├── plan.md
│   ├── progress-1.md
│   ├── progress-2.md
│   └── verification.md
└── archive/
    └── 1-9-user-profile-view-2026-03-04/
```

---

## Part 9: Execution Commands

### CLI Usage (for Ralph loop or manual)

```bash
# Analyze story
/bmad-bmm-dev-story-analyze --story=2-0-home-page-dashboard-layout

# Implement specific task
/bmad-bmm-dev-story-task --story=2-0-home-page-dashboard-layout --task=1

# Verify all tasks
/bmad-bmm-dev-story-verify --story=2-0-home-page-dashboard-layout

# Complete story
/bmad-bmm-dev-story-complete --story=2-0-home-page-dashboard-layout

# Code review
/bmad-bmm-code-review --story=2-0-home-page-dashboard-layout
```

### Dashboard Usage

1. Open `http://localhost:3456`
2. Select story from sprint list
3. Click "Analyze Story"
4. Click "Implement Task N" for each task (each click = fresh Claude session)
5. Click "Verify All"
6. Click "Complete Story"
7. Click "Run Code Review"
8. Click "Commit & Push"

---

## Part 10: Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| Context per session | 200K+ tokens (story + codebase + implementation) | 20-40K tokens (plan + one task) |
| Hang risk | High (long sessions) | Minimal (short sessions) |
| Recovery from failure | Lose all progress | Resume from last completed task |
| Debugging | Hard (long context) | Easy (isolated task context) |
| User visibility | Terminal output | Visual dashboard |
| Edit story mid-dev | Edit markdown file | GUI editor |
| Git workflow | Manual commands | One-click buttons |

---

## Appendix A: Sample Dev Session Files

### plan.md (example)
```markdown
# Dev Session Plan: 2-0-home-page-dashboard-layout

## Story Summary
Dashboard layout with navigation, quick actions, and widget grid for authenticated users.

## Tasks to Implement

- [ ] Task 1: Create Dashboard Layout Structure (AC: #1, #6)
  - Files to create:
    - src/app/(dashboard)/dashboard/page.tsx
  - Dependencies: None
  - Estimated complexity: Low

- [ ] Task 2: Create Unified Topbar Component (AC: #2, #3, #5)
  - Files to create:
    - src/components/features/topbar/topbar.tsx
    - src/components/features/topbar/nav-item.tsx
    - src/components/features/topbar/create-dropdown.tsx
    - src/components/features/topbar/profile-dropdown.tsx
  - Dependencies: Task 1 (for integration)
  - Estimated complexity: Medium

...

## Architecture Context
- App Router with route groups
- Clerk for auth/roles
- shadcn/ui components available
- Tailwind CSS 4

## Design Tokens
- Primary: #FF6B35
- Background: #FAFAF9
- Card: #F5F2EF
- Font: Manrope

## Risks / Edge Cases
- Role detection may fail if Clerk metadata not set
- Responsive grid needs testing on mobile
```

### progress-2.md (example)
```markdown
# Task 2 Progress: Create Unified Topbar Component

## What Was Done
- Created src/components/features/topbar/topbar.tsx with sticky positioning
- Created src/components/features/topbar/nav-item.tsx for navigation links
- Created src/components/features/topbar/create-dropdown.tsx with menu items
- Created src/components/features/topbar/profile-dropdown.tsx with user menu
- Added ZoniqLogo SVG component

## Tests Written
- None (UI components, manual testing required)

## Verification
- [x] Lint passes
- [x] TypeScript compiles
- [x] Manual test in browser

## Issues Encountered
- Had to add `use client` directive for dropdown interactivity

## Files Changed
- src/components/features/topbar/topbar.tsx (created)
- src/components/features/topbar/nav-item.tsx (created)
- src/components/features/topbar/create-dropdown.tsx (created)
- src/components/features/topbar/profile-dropdown.tsx (created)
- src/components/features/topbar/logo.tsx (created)
- src/components/ui/dropdown-menu.tsx (already existed)
```

---

## Appendix B: Story Template Update

Add to `_bmad/bmm/workflows/4-implementation/create-story/template.md`:

```markdown
## User Tasks

> Tasks that require manual action by the developer/user

### Configuration Required
- [ ] {extracted or manually added}

### Manual Testing Required
- [ ] {from tasks marked "Manual test:"}

### External Dependencies
- [ ] {extracted from Dev Notes}
```

---

## Next Steps

1. [ ] Create the 4 new workflow directories and files
2. [ ] Test atomized workflows manually with a real story
3. [ ] Build the Story Dev Dashboard app
4. [ ] Integrate dashboard with Claude Code CLI
5. [ ] Update ralph loop fix_plan.md format
6. [ ] Document the new workflow in CLAUDE.md

---

**End of Plan Document**
