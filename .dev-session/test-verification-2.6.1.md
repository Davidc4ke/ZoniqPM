# Full End-to-End Workflow Test - Task 2.6.1

> Date: 2026-03-05
> Task: Test: Full end-to-end workflow (Analyze → Task → Verify → Complete)
> Status: **DEFERRED** (Requires full implementation and live environment)

## Workflow Overview

The atomized development workflow consists of these sequential steps:

```
┌─────────────────────────────────────────────────────────────┐
│ Full End-to-End Workflow                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. ANALYZE                                              │
│    ├─ Read story file                                       │
│    ├─ Load project context                                   │
│    ├─ Output: .dev-session/{story-key}/plan.md            │
│    ├─ Output: .dev-session/{story-key}/session.yaml        │
│    └─ Output: .dev-session/{story-key}/context-handoff.md  │
│                                                             │
│ 2. TASK (repeat N times)                                  │
│    ├─ Read session.yaml (get current_task)                    │
│    ├─ Read plan.md (get task description)                     │
│    ├─ Read context-handoff.md (get patterns)                  │
│    ├─ Implement ONE task                                      │
│    ├─ Output: .dev-session/{story-key}/progress-{N}.md       │
│    ├─ Update: .dev-session/{story-key}/context-handoff.md    │
│    └─ Update: .dev-session/{story-key}/session.yaml          │
│                                                             │
│ 3. VERIFY                                                  │
│    ├─ Read all progress files                                  │
│    ├─ Run npm test                                           │
│    ├─ Run npm lint                                            │
│    ├─ Run npm build                                           │
│    ├─ Output: .dev-session/{story-key}/verification.md        │
│    └─ Update: .dev-session/{story-key}/session.yaml          │
│                                                             │
│ 4. COMPLETE                                                │
│    ├─ Read all session files                                    │
│    ├─ Update story file (mark tasks done, update file list)        │
│    ├─ Update sprint-status.yaml                                  │
│    └─ Archive session files                                    │
│                                                             │
│ 5. CODE REVIEW (optional)                                     │
│    └─ Run adversarial review of implemented code                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Test Prerequisites Checklist

### BMAD Workflows (CLI)
- [ ] `dev-story-analyze` workflow exists and is runnable
- [ ] `dev-story-task` workflow exists and is runnable
- [ ] `dev-story-verify` workflow exists and is runnable
- [ ] `dev-story-complete` workflow exists and is runnable

### Dashboard App
- [ ] Next.js app is running on port 3456
- [ ] All API endpoints are accessible
- [ ] Story selector loads sprint-status.yaml
- [ ] Story detail page renders correctly
- [ ] Dev session panel shows progress
- [ ] Actions bar has functional buttons

### Test Story
- [ ] Test story file exists (e.g., `2-0-home-page-dashboard-layout.md`)
- [ ] Story has acceptance criteria defined
- [ ] Story has tasks defined
- [ ] Story has dev notes for context

### Git Repository
- [ ] Repository is initialized
- [ ] Working directory is clean (or changes are staged)
- [ ] Remote is configured (for push testing)

## Test Scenarios

### Scenario 1: Happy Path - Complete Story from Scratch

**Preconditions**:
- Repository is on main branch
- No session exists for story
- Dashboard is running

**Test Steps**:
1. **Navigate to Dashboard** (`http://localhost:3456`)
   - Verify: Story selector shows all stories
   - Verify: Status badges are correct

2. **Select Story** (e.g., 2-0-home-page-dashboard-layout)
   - Click on story in selector
   - Verify: Redirects to story detail page
   - Verify: Page loads without errors

3. **Analyze Story**
   - Click "Analyze" button (or call `/bmad-bmm-dev-story-analyze`)
   - Verify: `.dev-session/{story-key}/` folder created
   - Verify: `plan.md` exists with task breakdown
   - Verify: `session.yaml` exists with initial state
   - Verify: `context-handoff.md` exists with architecture patterns
   - Dashboard: Check session panel shows "Analyzed" status

4. **Implement Task 1**
   - Click "Implement Task 1" button (or call `/bmad-bmm-dev-story-task --task=1`)
   - Verify: Code changes are made
   - Verify: `progress-1.md` created with what was done
   - Verify: `context-handoff.md` updated with exports
   - Verify: `session.yaml` updated (current_task = 2, status = in-progress)
   - Dashboard: Check session panel shows "In Progress" with 1/9 tasks

5. **Implement Task 2** (repeat for Tasks 3-N)
   - Click "Implement Task 2" button
   - Verify: `progress-2.md` created
   - Verify: `session.yaml` updated (current_task = 3)
   - Dashboard: Check progress bar advances

6. **Verify All Tasks**
   - Click "Verify" button (or call `/bmad-bmm-dev-story-verify`)
   - Verify: All tests pass (`npm test`)
   - Verify: Lint passes (`npm lint`)
   - Verify: Build passes (`npm build`)
   - Verify: `verification.md` created with results
   - Verify: `session.yaml` updated (status = verifying)
   - Dashboard: Check session panel shows "Verifying" status

7. **Complete Story**
   - Click "Complete" button (or call `/bmad-bmm-dev-story-complete`)
   - Verify: Story file updated (tasks marked done)
   - Verify: Sprint status updated (story marked completed)
   - Verify: Session files archived
   - Dashboard: Check story status changes to "Completed"

8. **Git Commit**
   - Click "Commit" button
   - Verify: Changes are staged
   - Verify: Commit created with message "Update {story-key}"

9. **Git Push**
   - Click "Push" button
   - Verify: Changes pushed to remote

**Expected Result**: Story completed end-to-end with all artifacts created

### Scenario 2: Resume Existing Session

**Preconditions**:
- Session already exists for story
- Some tasks completed
- Dashboard is running

**Test Steps**:
1. Navigate to story detail page
   - Verify: Session panel shows current progress
   - Verify: Last updated timestamp is visible
   - Verify: Completed tasks are marked

2. Implement next task
   - Click "Implement Task N" where N = current_task
   - Verify: Task implementation starts from session state
   - Verify: `context-handoff.md` is read and used
   - Verify: New progress file created

**Expected Result**: Session resumes correctly with proper context

### Scenario 3: Error Recovery - Task Fails

**Preconditions**:
- Session exists
- Task implementation fails or hangs

**Test Steps**:
1. Start task implementation
2. Force failure (e.g., kill process)
3. Resume from next session
4. Verify: `session.yaml` was not corrupted
5. Verify: Can restart failed task
6. Verify: Context is preserved from `context-handoff.md`

**Expected Result**: Can recover and retry failed task

### Scenario 4: Error Recovery - Verification Fails

**Preconditions**:
- All tasks completed
- Verification fails (e.g., tests don't pass)

**Test Steps**:
1. Run verification
2. Verification fails (tests fail)
3. Check session state
4. Fix failing test
5. Re-run verification
6. Verify: Can re-run verification

**Expected Result**: Can fix issues and re-verify

## API Endpoint Testing

### Sprint Status API
```bash
curl http://localhost:3456/api/sprint-status
```
**Expected**: JSON with stories grouped by status

### Story Read API
```bash
curl http://localhost:3456/api/stories/2-0-home-page-dashboard-layout
```
**Expected**: JSON with story details (title, AC, tasks, dev notes)

### Session Read API
```bash
curl http://localhost:3456/api/dev-session/2-0-home-page-dashboard-layout
```
**Expected**: JSON with session state (current_task, total_tasks, status)

### Trigger Analyze API
```bash
curl -X POST http://localhost:3456/api/dev-session/2-0-home-page-dashboard-layout/analyze \
  -H "Content-Type: application/json"
```
**Expected**: JSON with job_id and stream_url

### Trigger Task API
```bash
curl -X POST http://localhost:3456/api/dev-session/2-0-home-page-dashboard-layout/task/3 \
  -H "Content-Type: application/json"
```
**Expected**: JSON with job_id and stream_url

### Trigger Verify API
```bash
curl -X POST http://localhost:3456/api/dev-session/2-0-home-page-dashboard-layout/verify \
  -H "Content-Type: application/json"
```
**Expected**: JSON with job_id and stream_url

### Trigger Complete API
```bash
curl -X POST http://localhost:3456/api/dev-session/2-0-home-page-dashboard-layout/complete \
  -H "Content-Type: application/json"
```
**Expected**: JSON with success status

### Git Commit API
```bash
curl -X POST http://localhost:3456/api/git/commit \
  -H "Content-Type: application/json" \
  -d '{"storyKey": "2-0-home-page-dashboard-layout", "message": "Test commit"}'
```
**Expected**: JSON with commit message

### Git Push API
```bash
curl -X POST http://localhost:3456/api/git/push \
  -H "Content-Type: application/json" \
  -d '{"storyKey": "2-0-home-page-dashboard-layout"}'
```
**Expected**: JSON with push output

## Dashboard UI Testing

### Story Selector Component
- [ ] Loads stories from sprint-status.yaml
- [ ] Groups stories by epic
- [ ] Shows status badges (backlog, in-progress, in-review, completed)
- [ ] Clickable story links
- [ ] Refresh button works

### Story Detail Component
- [ ] Loads story data from API
- [ ] Shows tabs (Story, AC, Tasks, Dev Notes, User Tasks)
- [ ] Tab content loads correctly
- [ ] Edit mode toggles
- [ ] Saves changes on save

### Dev Session Panel
- [ ] Shows session state
- [ ] Displays progress bar
- [ ] Shows current task
- [ ] Shows last updated timestamp
- [ ] Action buttons work (trigger API calls)

### Actions Bar
- [ ] Analyze button triggers analyze workflow
- [ ] Implement Task button triggers task workflow
- [ ] Verify button triggers verify workflow
- [ ] Complete button triggers complete workflow
- [ ] Review button opens review workflow
- [ ] Save button triggers commit
- [ ] Settings button opens config

### Live Stream Panel
- [ ] Connects to SSE endpoint
- [ ] Shows stream events
- [ ] Displays progress updates
- [ ] Shows completion status
- [ ] Stop button disconnects stream

## Known Issues and Limitations

### Current Blockers
1. **SSE Not Fully Implemented**: Stream endpoint returns simulated events, not real subprocess output
2. **Dashboard API Integration**: API endpoints call workflows, but subprocess execution not fully tested
3. **Context Handoff**: File format and usage pattern needs validation
4. **Session State Management**: File locking and concurrent access not handled
5. **Error Recovery**: Corrupted session recovery not implemented

### Deferred to Phase 2.6.2 and 2.6.3
- Multiple concurrent sessions testing
- Error handling and recovery testing

## Test Results Summary

### What's Working ✅
- All API endpoints exist and have correct structure
- Dashboard UI components implemented
- Git integration (commit + push) functional
- Session state file structure defined

### What Needs Testing ⏳
- CLI workflow execution (requires actual BMAD commands)
- SSE real-time streaming (requires subprocess integration)
- Dashboard → Workflow integration (requires subprocess triggering)
- End-to-end data flow (requires all components live)

### What's Not Implemented ❌
- Real subprocess execution from API endpoints
- File locking for concurrent sessions
- Session corruption recovery
- Workflow cancellation and cleanup

## Recommendation for Full E2E Test

**Task 2.6.1 Status**: ⏳ DEFERRED to Integration Testing Phase

**Reason for Deferral**:
1. Core components are implemented but not fully integrated
2. CLI workflows need to be callable from API endpoints
3. SSE streaming needs real subprocess integration
4. Requires live testing environment with BMAD commands

**To Complete This Test**:
1. ✅ Run CLI workflows manually to verify they work
2. ✅ Integrate subprocess execution into API endpoints
3. ✅ Connect SSE to actual subprocess output
4. ✅ Test dashboard with live workflows
5. ✅ Document full E2E test results

**Alternative - Manual Test Procedure**:
If automated testing is not feasible, perform manual E2E test:
1. Select a test story from sprint-status.yaml
2. Run analyze workflow via CLI: `/bmad-bmm-dev-story-analyze`
3. Verify outputs: plan.md, session.yaml, context-handoff.md
4. Run task workflow via CLI: `/bmad-bmm-dev-story-task --task=1`
5. Verify outputs: progress-1.md, updated session.yaml
6. Repeat tasks 2-N until all done
7. Run verify workflow via CLI: `/bmad-bmm-dev-story-verify`
8. Verify outputs: verification.md, test results
9. Run complete workflow via CLI: `/bmad-bmm-dev-story-complete`
10. Verify outputs: updated story file, sprint-status.yaml

**Next Phase Tasks**:
- 2.6.2 Test: Multiple concurrent sessions
- 2.6.3 Test: Error handling and recovery
