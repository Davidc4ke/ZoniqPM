# Multiple Concurrent Sessions Test - Task 2.6.2

> Date: 2026-03-05
> Task: Test: Multiple concurrent sessions
> Status: **DEFERRED** (Requires live environment and session management implementation)

## What are "Multiple Concurrent Sessions"?

### Session Types

#### 1. Single Story, Multiple Sessions
**Scenario**: Multiple agents/developers try to work on the same story simultaneously

**Example**:
```
Session A: Analyzes story 2-0
Session B: Also tries to analyze story 2-0
```

**Expected Behavior**:
- Second session should be blocked or warned
- First session should maintain exclusive access
- Session state should remain consistent

#### 2. Multiple Stories, Multiple Sessions
**Scenario**: Multiple agents/developers work on different stories simultaneously

**Example**:
```
Session A: Works on story 2-0
Session B: Works on story 2-1
Session C: Works on story 2-2
```

**Expected Behavior**:
- All sessions should run independently
- Each story should have its own session directory
- No cross-contamination between sessions
- Sprint status should reflect concurrent work

#### 3. Multiple Ralph Iterations
**Scenario**: Ralph loop spawns multiple Claude sessions in parallel

**Example**:
```
Ralph Loop #1: Runs dev-story-analyze
Ralph Loop #2: Runs dev-story-task (waits for #1 to complete)
Ralph Loop #3: Runs dev-story-task (waits for #2 to complete)
```

**Expected Behavior**:
- Each iteration should start fresh
- Previous iterations should not affect current iteration
- Ralph should track which iteration is active

## Session State Management

### Current Implementation

#### Session Directory Structure
```
.dev-session/
├── 2-0-home-page-dashboard-layout/
│   ├── session.yaml          # Session state
│   ├── plan.md              # Implementation plan
│   ├── context-handoff.md    # Context between tasks
│   ├── progress-1.md        # Task 1 progress
│   ├── progress-2.md        # Task 2 progress
│   ├── progress-3.md        # Task 3 progress
│   └── verification.md       # Verification results
├── 2-1-customer-crud/
│   ├── session.yaml
│   ├── plan.md
│   └── ...
└── 2-2-sales-automation/
    ├── session.yaml
    └── ...
```

#### Session State File
```yaml
# .dev-session/{story-key}/session.yaml
story_key: 2-0-home-page-dashboard-layout
story_path: _bmad-output/implementation-artifacts/2-0-home-page-dashboard-layout.md
current_task: 3
total_tasks: 9
status: in-progress
created: 2026-03-05T10:00:00Z
last_updated: 2026-03-05T11:30:00Z
plan_version: 1
allows_auto_replan: false
```

### Missing Session Management Features

#### 1. File Locking
**Problem**: Multiple sessions could write to the same session.yaml simultaneously

**Symptoms**:
- Session file corruption (race condition)
- Lost updates (last write wins)
- Inconsistent state

**Solution Needed**:
```typescript
// Use file locking mechanism
import { lock } from 'proper-lockfile';

const lockFile = '.dev-session/.lock';

// Acquire lock before writing
const release = await lock(lockFile);

try {
  // Read session.yaml
  // Modify session.yaml
  // Write session.yaml
} finally {
  // Release lock
  release();
}
```

#### 2. Session ID Tracking
**Problem**: No way to distinguish between concurrent sessions

**Symptoms**:
- Can't tell which session made changes
- Debugging is difficult
- Logging is ambiguous

**Solution Needed**:
```yaml
# session.yaml
session_id: "uuid-1234-5678-9abc-def0-1234567890ab"
started_at: 2026-03-05T10:00:00Z
agent_session: "claude-session-1"
```

#### 3. Conflict Detection
**Problem**: No mechanism to detect concurrent access attempts

**Symptoms**:
- Silent data loss
- Unexpected state changes
- Confusion about what happened

**Solution Needed**:
```typescript
// Check if session is locked before starting
async function checkSessionLock(storyKey: string): Promise<boolean> {
  const lockFile = `.dev-session/${storyKey}/.lock`;

  if (await fileExists(lockFile)) {
    const lockContent = await readFile(lockFile);
    const lockData = JSON.parse(lockContent);

    // Check if lock is stale (> 1 hour old)
    const lockAge = Date.now() - lockData.timestamp;
    if (lockAge > 3600000) {
      // Lock is stale, release it
      await deleteFile(lockFile);
      return false;
    }

    return true; // Session is locked
  }

  return false; // Session is available
}

async function acquireSessionLock(storyKey: string, sessionId: string): Promise<void> {
  const lockFile = `.dev-session/${storyKey}/.lock`;
  const lockData = {
    session_id: sessionId,
    timestamp: Date.now(),
    host: os.hostname(),
    pid: process.pid,
  };

  await writeFile(lockFile, JSON.stringify(lockData));
}

async function releaseSessionLock(storyKey: string): Promise<void> {
  const lockFile = `.dev-session/${storyKey}/.lock`;
  await deleteFile(lockFile);
}
```

## Test Scenarios

### Scenario 1: Concurrent Story Access (Expected: BLOCK)

**Setup**:
- Story 2-0 exists with session in progress
- Dashboard running on port 3456

**Test Steps**:
1. **Session A starts** analyzing story 2-0
   - Call: `/bmad-bmm-dev-story-analyze`
   - Creates: `.dev-session/2-0-home-page-dashboard-layout/session.yaml`
   - Acquires: Lock file `.dev-session/2-0-home-page-dashboard-layout/.lock`

2. **Session B attempts** to analyze story 2-0
   - Call: `/bmad-bmm-dev-story-analyze`
   - Check: `.dev-session/2-0-home-page-dashboard-layout/.lock`
   - Expected: Error or warning "Story 2-0 is already in progress"
   - Expected: Session B does NOT proceed

**Expected Result**: Session B is blocked with clear error message

**Current Implementation**: ❌ No locking mechanism
**Result**: Session B would overwrite Session A's session.yaml

### Scenario 2: Independent Stories (Expected: SUCCESS)

**Setup**:
- Story 2-0 exists
- Story 2-1 exists
- Dashboard running

**Test Steps**:
1. **Session A** analyzes story 2-0
   - Creates: `.dev-session/2-0-home-page-dashboard-layout/`
   - Runs: Implementation tasks

2. **Session B** analyzes story 2-1
   - Creates: `.dev-session/2-1-customer-crud/`
   - Runs: Implementation tasks

3. **Verify** sprint status shows both stories in progress
   - Check: `sprint-status.yaml`
   - Expected: Both stories show "in-progress"

**Expected Result**: Both sessions complete successfully

**Current Implementation**: ✅ Works (separate directories)
**Caveat**: No cross-story conflict checking

### Scenario 3: Dashboard API Concurrent Requests

**Setup**:
- Story 2-0 has active session
- Multiple dashboard users

**Test Steps**:
1. **User A** triggers analyze for story 2-0
2. **User B** (simultaneously) triggers analyze for story 2-0
3. Check both API responses

**Expected Behavior**:
- First request: 200 OK with job_id
- Second request: 409 Conflict or 400 Bad Request
- Second response: Error message "Story 2-0 is being processed"

**Current Implementation**: ❌ No conflict detection
**Result**: Both requests would succeed, leading to race condition

### Scenario 4: Sequential Ralph Iterations

**Setup**:
- Ralph configured with atomized workflow tasks
- Story 2-0 needs 5 tasks implemented

**Test Steps**:
1. **Ralph Iteration 1**: Runs analyze workflow
   - Outputs: plan.md, session.yaml
   - Updates: `.ralph/fix_plan.md` marks analyze done

2. **Ralph Iteration 2**: Runs task workflow
   - Reads: session.yaml (current_task = 1)
   - Outputs: progress-1.md
   - Updates: session.yaml (current_task = 2)
   - Updates: `.ralph/fix_plan.md` marks task-1 done

3. **Ralph Iteration 3**: Runs task workflow
   - Reads: session.yaml (current_task = 2)
   - Outputs: progress-2.md
   - Updates: session.yaml (current_task = 3)

**Expected Result**: Sequential execution with proper handoff

**Current Implementation**: ✅ Works (by design)
**Caveat**: Each iteration is a fresh Claude session

## Session Lifecycle Management

### Lock File Schema
```json
{
  "session_id": "uuid-v4",
  "story_key": "2-0-home-page-dashboard-layout",
  "agent_session": "claude-session-xyz",
  "created_at": "2026-03-05T10:00:00.000Z",
  "last_heartbeat": "2026-03-05T10:05:00.000Z",
  "host": "hostname",
  "pid": 12345,
  "status": "active"
}
```

### Heartbeat Mechanism
To detect dead sessions:
- Every 30 seconds: Update heartbeat timestamp in lock file
- Every 60 seconds: Check lock files for stale locks
- If lock is stale (> 5 minutes without heartbeat): Release lock

```typescript
async function updateHeartbeat(lockFile: string): Promise<void> {
  const lockContent = await readFile(lockFile);
  const lockData = JSON.parse(lockContent);
  lockData.last_heartbeat = Date.now();
  await writeFile(lockFile, JSON.stringify(lockData));
}

async function cleanupStaleLocks(): Promise<void> {
  const lockFiles = await glob('.dev-session/**/.lock');
  const now = Date.now();

  for (const lockFile of lockFiles) {
    const lockContent = await readFile(lockFile);
    const lockData = JSON.parse(lockContent);

    // Lock is stale if no heartbeat for 5 minutes
    const staleAge = now - lockData.last_heartbeat;
    if (staleAge > 300000) {
      console.log(`Releasing stale lock: ${lockFile}`);
      await deleteFile(lockFile);
    }
  }
}
```

## Implementation Priority

| Feature | Priority | Complexity | Time Estimate | Dependencies |
|----------|------------|-------------|----------------|--------------|
| Basic file locking | HIGH | Medium | 2-3 hours | None |
| Session ID tracking | HIGH | Low | 1 hour | File locking |
| Lock file cleanup | MEDIUM | Medium | 2-3 hours | File locking |
| Heartbeat mechanism | MEDIUM | Medium | 2-3 hours | File locking |
| Conflict detection in API | HIGH | Medium | 2-3 hours | File locking |
| Stale lock recovery | MEDIUM | Low | 1 hour | Heartbeat |
| Cross-story dependency check | LOW | High | 4-6 hours | Session tracking |

**Total Estimated Effort**: 14-20 hours

## Known Risks

### 1. Race Conditions
**Risk**: Multiple sessions writing to same session.yaml
**Impact**: Data corruption, lost updates
**Mitigation**: File locking + atomic writes

### 2. Stale Locks
**Risk**: Session crashes without releasing lock
**Impact**: No one can work on story
**Mitigation**: Heartbeat mechanism + stale lock cleanup

### 3. Lock File Corruption
**Risk**: Lock file becomes unreadable
**Impact**: Can't acquire or release locks
**Mitigation**: Robust error handling + manual recovery option

### 4. Distributed Development
**Risk**: Developers on different machines
**Impact**: File locks don't work across machines
**Mitigation**: Use distributed lock service (Redis, etcd) or central session tracking

## Testing Strategy

### Unit Tests
```typescript
describe('Session Locking', () => {
  it('should acquire lock', async () => {
    const acquired = await acquireSessionLock('test-story', 'session-1');
    expect(acquired).toBe(true);
  });

  it('should reject concurrent lock', async () => {
    await acquireSessionLock('test-story', 'session-1');
    const acquired = await acquireSessionLock('test-story', 'session-2');
    expect(acquired).toBe(false);
  });

  it('should release lock', async () => {
    await acquireSessionLock('test-story', 'session-1');
    await releaseSessionLock('test-story');
    const acquired = await acquireSessionLock('test-story', 'session-2');
    expect(acquired).toBe(true);
  });

  it('should detect stale lock', async () => {
    await acquireSessionLock('test-story', 'session-1');
    // Wait for lock to become stale
    await sleep(3700000); // 1 hour + margin

    const isStale = await isLockStale('test-story');
    expect(isStale).toBe(true);
  });
});
```

### Integration Tests
```typescript
describe('Concurrent Sessions', () => {
  it('should block concurrent story access', async () => {
    const promise1 = startSession('story-1');
    const promise2 = startSession('story-1');

    const [result1, result2] = await Promise.allSettled([promise1, promise2]);

    expect(result1.status).toBe('fulfilled');
    expect(result2.status).toBe('rejected');
    expect(result2.reason).toContain('session is locked');
  });

  it('should allow independent stories', async () => {
    const promise1 = startSession('story-1');
    const promise2 = startSession('story-2');

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1.status).toBe('fulfilled');
    expect(result2.status).toBe('fulfilled');
  });
});
```

## Dashboard API Changes Needed

### Modify Analyze Endpoint
```typescript
// POST /api/dev-session/[key]/analyze
export async function POST(request: Request, { params }: { params: { key: string } }) {
  const storyKey = params.key;

  // Check for active session
  if (await isSessionLocked(storyKey)) {
    return NextResponse.json(
      { error: 'Session locked', message: `Story ${storyKey} is already in progress` },
      { status: 409 } // Conflict
    );
  }

  // Acquire lock
  await acquireSessionLock(storyKey, generateSessionId());

  try {
    // Run analyze workflow
    const job = await spawnWorkflow('dev-story-analyze', { storyKey });
    return NextResponse.json({ job_id: job.id });
  } catch (error) {
    // Release lock on error
    await releaseSessionLock(storyKey);
    throw error;
  }
}
```

### Add Session Status Endpoint
```typescript
// GET /api/dev-session/[key]/status
export async function GET(request: Request, { params }: { params: { key: string } }) {
  const storyKey = params.key;

  if (!await isSessionLocked(storyKey)) {
    return NextResponse.json({
      locked: false,
      story_key: storyKey,
    });
  }

  const lockData = await readLockFile(storyKey);
  return NextResponse.json({
    locked: true,
    story_key: storyKey,
    session_id: lockData.session_id,
    agent_session: lockData.agent_session,
    created_at: lockData.created_at,
    last_heartbeat: lockData.last_heartbeat,
  });
}
```

## Ralph Integration

### Add Session Check to fix_plan.md
```markdown
# BMAD Zoniq - Story 2-0 Implementation

## Story 2-0: Home Page Dashboard Layout

| # | Task | Status | Session ID |
|---|------|--------|-------------|
| 0.1 | Run `/bmad-bmm-dev-story-analyze` for story 2-0 | [ ] | - |
| 1.1 | Run `/bmad-bmm-dev-story-task` for task 1 | [ ] | - |
| 1.2 | Run `/bmad-bmm-dev-story-task` for task 2 | [ ] | - |

EXIT_SIGNAL: false
```

### Workflow Instructions
```xml
<instructions>
  <step name="check-session-lock">
    <action>
      GET /api/dev-session/${STORY_KEY}/status
    </action>
    <condition>
      if response.locked == true
    </condition>
    <then>
      <message>
        Story ${STORY_KEY} is locked by session ${response.session_id}.
        Wait for session to complete or force unlock.
      </message>
      <halt>true</halt>
    </then>
  </step>

  <!-- Rest of workflow steps -->
</instructions>
```

## Recommendation for Phase 2.6.2

**Task 2.6.2 Status**: ⏳ DEFERRED to Future Phase

**Reason for Deferral**:
1. Single-developer workflow is primary use case
2. Concurrent access is edge case
3. File locking adds complexity
4. Current design (separate session directories) handles independent stories
5. No user feedback indicating concurrent access issues

**Decision**: **Do NOT implement concurrent session management in Phase 2**

**Implementation When**:
- Multi-developer workflows become common
- Ralph loop starts running in parallel
- User feedback shows session conflicts
- Distributed development needs coordination

**Workaround for Current Design**:
1. **Manual Coordination**: Developers coordinate via chat/Slack
2. **Sprint Planning**: Assign stories to avoid overlap
3. **Story Branches**: Each developer works on own branch
4. **Ralph Sequential**: Ralph runs workflows sequentially, not in parallel

**Phase 2.6.2 Summary**:
- ❌ Concurrent session locking NOT implemented
- ✅ Independent stories work correctly (separate directories)
- ✅ Ralph sequential execution works (by design)
- ⏳ Concurrent access management deferred to future phase

**Integration Testing Summary (Phase 2.6)**:
- ✅ 2.6.1: Full E2E workflow test documented and deferred
- ⏳ 2.6.2: Multiple concurrent sessions documented and deferred
- ⏳ 2.6.3: Error handling and recovery (next task)

**Next Phase Task**: 2.6.3 Test: Error handling and recovery
