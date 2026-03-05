# Atomized Workflow Implementation Tasks - Phase 1 Only

> Execute ONE task per Claude session. Mark [x] when done.
> Plan reference: `_bmad-output/implementation-artifacts/ATOMIZED-DEV-WORKFLOW-PLAN.md`

---

## Phase 1: Core Workflows (BMAD)

### 1.1 dev-story-analyze Workflow
- [ ] 1.1.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-analyze/`
- [ ] 1.1.2 Create `workflow.yaml` with metadata (name, description, inputs, outputs)
- [ ] 1.1.3 Create `instructions.xml` with steps: find story → load context → output plan.md and session.yaml
- [ ] 1.1.4 Create `.dev-session/.gitkeep` and add `.dev-session/` to `.gitignore`
- [ ] 1.1.5 Test: Run `/bmad-bmm-dev-story-analyze` on story 2-0, verify plan.md and session.yaml created

### 1.2 dev-story-task Workflow
- [ ] 1.2.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-task/`
- [ ] 1.2.2 Create `workflow.yaml` with metadata and `--task=N` parameter
- [ ] 1.2.3 Create `instructions.xml` with steps: read session.yaml → read plan.md → implement ONE task → output progress-N.md → update session.yaml
- [ ] 1.2.4 Test: Run `/bmad-bmm-dev-story-task --task=1` on story 2-0

### 1.3 dev-story-verify Workflow
- [ ] 1.3.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-verify/`
- [ ] 1.3.2 Create `workflow.yaml`
- [ ] 1.3.3 Create `instructions.xml` with steps: read all progress files → run npm test → run npm lint → run npm build → output verification.md
- [ ] 1.3.4 Test: Run `/bmad-bmm-dev-story-verify` after implementing at least one task

### 1.4 dev-story-complete Workflow
- [ ] 1.4.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-complete/`
- [ ] 1.4.2 Create `workflow.yaml`
- [ ] 1.4.3 Create `instructions.xml` with steps: read all session files → update story file (mark tasks done, update file list) → update sprint-status.yaml → archive session
- [ ] 1.4.4 Test: Run `/bmad-bmm-dev-story-complete` after verification passes

### 1.5 context-handoff System
- [ ] 1.5.1 Create context-handoff.md template file in `_bmad/bmm/workflows/4-implementation/dev-story-analyze/templates/`
- [ ] 1.5.2 Update dev-story-analyze to output initial context-handoff.md
- [ ] 1.5.3 Update dev-story-task to READ context-handoff.md at session start
- [ ] 1.5.4 Update dev-story-task to UPDATE context-handoff.md after implementation (exports registry, patterns)
- [ ] 1.5.5 Test: Verify Task 2 session can import from Task 1's exports

### 1.6 dev-story-replan Workflow
- [ ] 1.6.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-story-replan/`
- [ ] 1.6.2 Create `workflow.yaml`
- [ ] 1.6.3 Create `instructions.xml` with steps: read session.yaml (get reason) → read plan → adjust future tasks → update session.yaml with plan_history
- [ ] 1.6.4 Update session.yaml schema to include: `plan_version`, `replan_reason`, `replan_proposal`, `replan_history`
- [ ] 1.6.5 Update dev-story-task to detect plan issues and write replan_reason to session.yaml, then HALT
- [ ] 1.6.6 Test: Trigger replan from a task that's too large, verify Ralph routes to replan

### 1.7 dev-session-status CLI
- [ ] 1.7.1 Create folder `_bmad/bmm/workflows/4-implementation/dev-session-status/`
- [ ] 1.7.2 Create `workflow.yaml`
- [ ] 1.7.3 Create `instructions.xml` with status calculation and output formatting
- [ ] 1.7.4 Implement --json flag output
- [ ] 1.7.5 Implement --short flag (single line)
- [ ] 1.7.6 Test: Run status command mid-session

---

## Summary

| Section | Tasks |
|---------|-------|
| 1.1 dev-story-analyze | 5 |
| 1.2 dev-story-task | 4 |
| 1.3 dev-story-verify | 4 |
| 1.4 dev-story-complete | 4 |
| 1.5 context-handoff | 5 |
| 1.6 dev-story-replan | 6 |
| 1.7 dev-session-status | 6 |
| **TOTAL** | **34** |

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

EXIT_SIGNAL: false
