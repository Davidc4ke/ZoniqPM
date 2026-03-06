# Atomized Workflow Addendum

> Additions to ATOMIZED-DEV-WORKFLOW-PLAN.md
> Created: 2026-03-05

---

## Part 2.5: Inter-Task Context Handoff System

### The Problem
When each task runs in a fresh session, the next session doesn't know:
- What interfaces/types were defined
- What exports are available
- What patterns were established
- What naming conventions were chosen

### The Solution: `context-handoff.md`

**Location:** `.dev-session/{story-key}/context-handoff.md`

**Purpose:** Rich context transfer between task sessions

**Schema:**
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

### Shared State
- `dashboardLayoutRef` - Created in Task 1, used in Tasks 4-8
- `userRoleContext` - Created in Task 2, used in Tasks 3, 5, 6

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

## Part 2.6: Re-Planning Workflow (`dev-story-replan`)

### When to Use
- Mid-implementation reveals tasks are in wrong order
- A task is too large and needs splitting
- Dependencies were misunderstood
- New requirements discovered

### Workflow Definition

**Location:** `_bmad/bmm/workflows/4-implementation/dev-story-replan/`

**Purpose:** Re-analyze and update the plan without losing completed work

**Inputs:**
- Current `.dev-session/{story-key}/plan.md`
- Current `.dev-session/{story-key}/context-handoff.md`
- Current `.dev-session/{story-key}/session.yaml`
- Optional: User input explaining what changed

**Outputs:**
- Updated `.dev-session/{story-key}/plan.md` (preserves completed tasks)
- Updated `.dev-session/{story-key}/session.yaml` (adjusts total_tasks if needed)
- `.dev-session/{story-key}/replan-{N}.md` (audit trail of changes)

**instructions.xml Steps:**
```xml
<step n="1" goal="Load current state">
  <action>Read session.yaml to understand current progress</action>
  <action>Read context-handoff.md to understand what's built</action>
  <action>Read plan.md to see current task breakdown</action>
</step>

<step n="2" goal="Gather replan reason">
  <check if="user provided reason">
    <action>Use user's explanation</action>
  </check>
  <check if="no user reason">
    <ask>Why do you need to replan? What changed or was discovered?</ask>
    <action>Store as {{replan_reason}}</action>
  </check>
</step>

<step n="3" goal="Analyze what to change">
  <action>Identify completed tasks (marked [x] in plan.md)</action>
  <action>Identify remaining tasks</action>
  <action>Determine if remaining tasks need: reordering, splitting, merging, or adding</action>
</step>

<step n="4" goal="Generate new plan section">
  <action>Keep completed tasks unchanged</action>
  <action>Restructure remaining tasks based on new understanding</action>
  <action>Update task numbers starting from first incomplete task</action>
</step>

<step n="5" goal="Update files">
  <action>Write updated plan.md</action>
  <action>Update session.yaml with new total_tasks count</action>
  <action>Create replan-{N}.md audit log:
    ```markdown
    # Replan {N}: {timestamp}
    
    ## Reason
    {replan_reason}
    
    ## Changes Made
    - Task 5 split into: Task 5a, Task 5b
    - Task 6 moved before Task 4 (dependency discovered)
    - Task 8 removed (already done in Task 3)
    
    ## Old Tasks
    {list of old task structure}
    
    ## New Tasks
    {list of new task structure}
    ```
  </action>
</step>

<step n="6" goal="Communicate changes">
  <output>
  🔄 **Plan Updated**
  
  **Reason:** {replan_reason}
  
  **Changes:**
  - Tasks restructured: {summary}
  - Total tasks: {old_count} → {new_count}
  - Completed tasks preserved: {completed_count}
  
  **Next:** Run `/bmad-bmm-dev-story-task` to continue from Task {next_task}
  </output>
</step>
```

### Example Replan Scenarios

**Scenario 1: Task Too Large**
```
Before: Task 4 - Create all dashboard widgets
After:
  - Task 4a: Create Assigned Stories widget
  - Task 4b: Create Review Queue widget
  - Task 4c: Create remaining widgets (Projects, Apps, Team Activity)
```

**Scenario 2: Dependency Discovered**
```
Before:
  - Task 3: Navigation items
  - Task 4: Widgets
After:
  - Task 3: Navigation items
  - Task 3.5: Create useUserRole hook (NEW - needed by widgets)
  - Task 4: Widgets
```

**Scenario 3: Task Already Done**
```
Before:
  - Task 5: Create story card component
After:
  - Task 5: REMOVED (already created in Task 2 as NavItem → StoryCard refactor)
  - Task 6: Create mini kanban (renumbered to Task 5)
```

---

## Part 2.7: CLI Status Command (`dev-session-status`)

### Purpose
Quick progress visibility without opening the GUI.

### Command
```bash
/bmad-bmm-dev-session-status [--story=story-key] [--json]
```

### Output (Human-Readable)
```
╔═══════════════════════════════════════════════════════════════╗
║  Dev Session Status: 2-0-home-page-dashboard-layout           ║
╠═══════════════════════════════════════════════════════════════╣
║  Phase: task                                                  ║
║  Status: in-progress                                          ║
║  Progress: ████████░░░░░░░░░░ 5/12 tasks (42%)               ║
╠═══════════════════════════════════════════════════════════════╣
║  Completed:                                                   ║
║    ✓ Task 1: Create Dashboard Layout Structure                ║
║    ✓ Task 2: Create Unified Topbar Component                  ║
║    ✓ Task 3: Implement Navigation Items                       ║
║    ✓ Task 4: Create Dashboard Widget Components               ║
║    ✓ Task 5: Create Story Card Component                      ║
║                                                               ║
║  Current:                                                     ║
║    ▶ Task 6: Create Mini Kanban Component                     ║
║                                                               ║
║  Remaining:                                                   ║
║    ○ Task 7: Create Activity Feed Component                   ║
║    ○ Task 8: Update Root Layout and Redirect                  ║
║    ○ Task 9: Testing and Polish                               ║
║    ○ Task 10: Verify all tests pass                           ║
║    ○ Task 11: Run lint and build                              ║
║    ○ Task 12: Update story file and mark review               ║
║                                                               ║
║  Next Actions:                                                ║
║    1. Run `/bmad-bmm-dev-story-task --task=6`                 ║
║    2. Or run `/bmad-bmm-dev-session-status --next` to auto    ║
╠═══════════════════════════════════════════════════════════════╣
║  Files Changed: 14 | Tests: 8 passing | Duration: 0:23:45    ║
║  Session Started: 2026-03-05 10:00 | Last Updated: 10:23     ║
╚═══════════════════════════════════════════════════════════════╝
```

### Output (JSON for scripting)
```json
{
  "story_key": "2-0-home-page-dashboard-layout",
  "phase": "task",
  "status": "in-progress",
  "progress": {
    "completed": 5,
    "total": 12,
    "percentage": 42
  },
  "current_task": {
    "number": 6,
    "name": "Create Mini Kanban Component",
    "started_at": "2026-03-05T10:23:00Z"
  },
  "completed_tasks": [
    {"number": 1, "name": "Create Dashboard Layout Structure"},
    {"number": 2, "name": "Create Unified Topbar Component"},
    {"number": 3, "name": "Implement Navigation Items"},
    {"number": 4, "name": "Create Dashboard Widget Components"},
    {"number": 5, "name": "Create Story Card Component"}
  ],
  "remaining_tasks": [
    {"number": 7, "name": "Create Activity Feed Component"},
    {"number": 8, "name": "Update Root Layout and Redirect"},
    {"number": 9, "name": "Testing and Polish"},
    {"number": 10, "name": "Verify all tests pass"},
    {"number": 11, "name": "Run lint and build"},
    {"number": 12, "name": "Update story file and mark review"}
  ],
  "metrics": {
    "files_changed": 14,
    "tests_passing": 8,
    "duration_seconds": 1425
  },
  "timestamps": {
    "created": "2026-03-05T10:00:00Z",
    "last_updated": "2026-03-05T10:23:45Z"
  }
}
```

### Workflow Definition

**Location:** `_bmad/bmm/workflows/4-implementation/dev-session-status/`

**instructions.xml:**
```xml
<step n="1" goal="Find session">
  <check if="--story provided">
    <action>Use provided story key</action>
  </check>
  <check if="no --story">
    <action>Search .dev-session/ for sessions with status != 'done'</action>
    <action>If multiple found, list all and ask user to select</action>
    <action>If one found, use it</action>
    <action>If none found, output "No active dev sessions found"</action>
  </check>
</step>

<step n="2" goal="Load session data">
  <action>Read session.yaml</action>
  <action>Read plan.md</action>
  <action>Read context-handoff.md if exists</action>
  <action>Read all progress-*.md files</action>
</step>

<step n="3" goal="Calculate metrics">
  <action>Count completed tasks (from plan.md checkboxes)</action>
  <action>Count total tasks</action>
  <action>Calculate percentage</action>
  <action>Count files changed (from progress files)</action>
  <action>Count tests (from progress files)</action>
  <action>Calculate duration (created to now)</action>
</step>

<step n="4" goal="Output">
  <check if="--json flag">
    <action>Output JSON format</action>
  </check>
  <check if="no --json">
    <action>Output human-readable box format</action>
  </check>
  <check if="--next flag">
    <action>After displaying status, automatically run next workflow</action>
  </check>
</step>
```

### CLI Options

| Flag | Description |
|------|-------------|
| `--story=KEY` | Specify story key (auto-detected if only one active) |
| `--json` | Output JSON format for scripting |
| `--next` | After showing status, run the next workflow automatically |
| `--watch` | Continuously update status every 5 seconds |
| `--short` | Single line output: `[2-0] 5/12 (42%) - Task 6: Mini Kanban` |

---

## Updated File Structure

```
.dev-session/
└── {story-key}/
    ├── session.yaml           # Session state
    ├── plan.md                # Task breakdown
    ├── context-handoff.md     # ⭐ NEW: Inter-task context
    ├── progress-1.md          # Task 1 completion
    ├── progress-2.md          # Task 2 completion
    ├── ...
    ├── verification.md        # Test/lint results
    ├── replan-1.md            # ⭐ NEW: Replan audit trail (if any)
    └── replan-2.md            # ⭐ NEW: Additional replans
```

---

## Updated Task File Additions

Add to `.ralph/atomized-workflow-tasks.md`:

```markdown
### 1.5 context-handoff System
- [ ] 1.5.1 Define context-handoff.md schema and template
- [ ] 1.5.2 Update dev-story-task to output context-handoff.md after each task
- [ ] 1.5.3 Update dev-story-task to READ context-handoff.md at start (if exists)
- [ ] 1.5.4 Test: Verify Task 2 session knows about Task 1's exports

### 1.6 dev-story-replan Workflow
- [ ] 1.6.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-replan/`
- [ ] 1.6.2 Create `workflow.yaml` with metadata
- [ ] 1.6.3 Create `instructions.xml` with replan steps
- [ ] 1.6.4 Implement replan audit trail (replan-N.md)
- [ ] 1.6.5 Test: Run replan to split a task in half

### 1.7 dev-session-status CLI
- [ ] 1.7.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-session-status/`
- [ ] 1.7.2 Create `workflow.yaml`
- [ ] 1.7.3 Create `instructions.xml` with status calculation logic
- [ ] 1.7.4 Implement JSON output mode
- [ ] 1.7.5 Implement --watch mode (continuous updates)
- [ ] 1.7.6 Test: Run status command mid-session
```

---

## Benefits Summary

| Feature | Problem Solved | Benefit |
|---------|---------------|---------|
| `context-handoff.md` | Each session starts blind | Next task knows interfaces, patterns, decisions |
| `dev-story-replan` | Stuck with wrong task breakdown | Adapt plan without losing progress |
| `dev-session-status` | No visibility without GUI | Quick CLI check, scriptable, watchable |

---

**End of Addendum**
