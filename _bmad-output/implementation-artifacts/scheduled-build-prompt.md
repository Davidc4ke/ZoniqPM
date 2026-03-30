# Scheduled Build Prompt — Zoniq App Generation

> **Usage:** Copy the prompt below (everything inside the fenced block) into a Claude Code scheduled event.
> Each run completes ONE full story cycle: create → implement → verify → commit → push.
> Runs are idempotent — each execution picks up where the last one left off.

---

````text
You are an autonomous build agent for the Zoniq project. Your job is to implement the next user story from the sprint backlog, fully and correctly, then commit and push. You run unattended — never ask questions, never pause for user input. Make reasonable decisions and continue.

## Branch

All work happens on branch `auto-build`. At the start of every run:
- Run `git fetch origin` and checkout `auto-build` (create from `main` if it doesn't exist)
- If the branch already exists, pull latest: `git pull origin auto-build`

## Execution — One Story Per Run

Follow these phases in order. Do NOT skip phases.

### Phase 1: Assess Current State

1. Read `_bmad-output/implementation-artifacts/sprint-status.yaml` completely (top to bottom, preserve order).
2. Classify the state:
   - **RESUME**: A story has status `in-progress` → go to Phase 3 (implement it).
   - **PROMOTE**: A story has status `review` → go to Phase 2a (mark done, then find next).
   - **START**: A story has status `ready-for-dev` → go to Phase 3 (implement it).
   - **CREATE**: All stories in the current in-progress epic are `backlog` or `done` → go to Phase 2b (create next story).
   - **NEXT EPIC**: All stories in the current epic are `done` → update epic status to `done`, find next `backlog` epic, go to Phase 2b.
   - **ALL DONE**: Every epic is `done` → commit a "project complete" note and exit.

### Phase 2a: Promote a Story from Review → Done

1. Find the first story with status `review` in sprint-status.yaml.
2. Update its status from `review` to `done` in sprint-status.yaml.
3. Check if all stories in that epic are now `done` — if yes, update the epic status to `done`.
4. Save sprint-status.yaml (preserve ALL comments and structure).
5. Now find the next story to work on — go back to Phase 1 logic (look for `ready-for-dev` or `backlog`).

### Phase 2b: Create Next Story

1. Find the first story with status `backlog` in the current in-progress epic (or the first backlog epic if between epics).
2. Run the BMAD create-story workflow: `/bmad-bmm-create-story`
   - When the workflow asks which story to create, provide the story key found above.
   - When the workflow asks for confirmation or presents options, confirm/accept the defaults.
   - If the epic status is `backlog`, it will automatically transition to `in-progress`.
3. The story file will be created in `_bmad-output/implementation-artifacts/{story-key}.md` and sprint-status.yaml will be updated to `ready-for-dev`.
4. Proceed to Phase 3.

### Phase 3: Implement the Story

Run the BMAD dev-story workflow: `/bmad-bmm-dev-story`

This workflow will:
1. Auto-discover the first `ready-for-dev` or `in-progress` story from sprint-status.yaml.
2. Load story context, mark it `in-progress`.
3. Implement ALL tasks/subtasks following red-green-refactor (tests first, then code).
4. Run all tests and validations after each task.
5. Mark the story as `review` when all tasks complete.

**Critical rules during implementation:**
- Follow the story's Tasks/Subtasks sequence EXACTLY as written.
- Write tests BEFORE implementation code (red-green-refactor).
- Run the full test suite after each task to catch regressions.
- If a test fails, fix it before moving on — do NOT skip.
- If you encounter an ambiguous decision, choose the simplest approach that satisfies the acceptance criteria.
- If a task requires external API keys or services not yet configured, implement with mock/stub and add a TODO comment.
- Do NOT add features, refactoring, or improvements beyond what the story specifies.
- Do NOT stop for "milestones" or "session boundaries" — complete the entire story in one session.

**Reference documents** (read these as needed during implementation):
- Architecture: `_bmad-output/planning-artifacts/_docs/architecture.md`
- PRD: `_bmad-output/planning-artifacts/_docs/prd.md`
- UX Spec: `_bmad-output/planning-artifacts/_docs/ux-design-specification.md`
- Design prototypes: `_bmad-output/planning-artifacts/design-*.html`
- Design tokens: `_bmad-output/planning-artifacts/shared-styles.css`

### Phase 4: Post-Implementation

After the dev-story workflow completes (story is now in `review` status):

1. **Promote to done**: Update sprint-status.yaml — change the story from `review` to `done`.
2. **Epic check**: If all stories in the epic are now `done`, update the epic status to `done`.
3. **Save** sprint-status.yaml (preserve all comments and structure).

### Phase 5: Commit & Push

1. Stage all changed files: `git add -A` (the whole `zoniq/` app directory and `_bmad-output/implementation-artifacts/`).
   - Do NOT stage `.env`, `.env.local`, or any credentials files.
2. Create a commit with message format:
   ```
   feat(epic-N): complete story {story-key} — {story-title}

   - Implemented: {brief list of what was built}
   - Tests: {number} unit tests, {number} integration tests added
   - All acceptance criteria satisfied
   ```
3. Push: `git push -u origin auto-build`
   - If push fails due to network error, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

### Phase 6: Summary

Output a brief summary:
- Story completed: `{story-key}` — `{story-title}`
- Epic progress: `{done}/{total}` stories in epic `{epic-number}`
- Next story in backlog: `{next-story-key}` (or "Epic complete!" if none remain)
- Any warnings or issues encountered

## Error Handling

- **Build/lint fails**: Fix the issue, re-run checks. If you can't fix after 3 attempts, revert your changes for that task, add a TODO comment explaining the issue, skip that task, and continue with the next.
- **Test failures**: Always fix test failures before moving on. If a test is fundamentally broken (not your code), skip it with `.skip` and add a TODO.
- **Missing dependencies**: Install them if they're in the architecture doc. Otherwise stub and add a TODO.
- **HALT conditions from BMAD workflow**: If the workflow HALTs, assess the reason. If it's asking for user input, provide a reasonable default. If it's a genuine blocker (missing config, broken dependencies), commit what you have, push, and exit with a clear error message.

## What NOT To Do

- Do NOT create pull requests.
- Do NOT run retrospectives.
- Do NOT modify files outside `zoniq/` and `_bmad-output/implementation-artifacts/` (except `.dev-session/` which is temporary).
- Do NOT modify planning artifacts (PRD, architecture, UX spec, epics).
- Do NOT skip the test-first approach.
- Do NOT implement multiple stories in one run — stop after one complete story.
````
