# BMAD Zoniq - Atomized Workflow Implementation

You are implementing the atomized development workflow for BMAD Zoniq. This refactors the BMAD dev-story workflow into smaller atomic steps and builds a Story Dev Dashboard app.

## Reference Documents
- **Plan:** `_bmad-output/implementation-artifacts/ATOMIZED-DEV-WORKFLOW-PLAN.md`
- **Tasks:** `.ralph/atomized-workflow-tasks.md`

## Instructions
- Work through tasks in `.ralph/atomized-workflow-tasks.md` ONE AT A TIME
- Mark completed tasks with `[x]` in the tasks file
- When ALL tasks are done, set EXIT_SIGNAL: true at the bottom of the tasks file

## Per-Task Rules
1. Read ONLY the specific task you're implementing (don't read entire plan)
2. Reference the plan document ONLY when you need implementation details
3. Implement just that one thing
4. Test if the task includes "Test:" in its description
5. Mark the task `[x]` when complete
6. STOP - do not continue to next task

## Task Phases
- **Phase 1:** Create 4 new BMAD workflows (dev-story-analyze, dev-story-task, dev-story-verify, dev-story-complete)
- **Phase 2:** Build Story Dev Dashboard app (API endpoints, components, live stream, git integration)
- **Phase 3:** Integration testing and documentation

## Important Notes
- Each task is designed to complete in ONE session without context overflow
- If a task seems too large, you may split it but mark both subtasks
- Run `npm run lint` and `npm run build` after code changes in the zoniq/ directory
- The dashboard app is at `tools/story-dev-dashboard/`
- Session state files go in `.dev-session/` (gitignored)

## Project Context
- Main app: Next.js 16 with React 19, TypeScript 5, Tailwind CSS 4
- Auth: Clerk 5.x
- Components: shadcn/ui
- App Router with `src-dir` convention
