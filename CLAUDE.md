# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ZoniqPM** is an AI-powered requirements and project management tool for Mendix low-code development teams. It transforms unstructured notes into acceptance criteria, development plans, and automated test scripts — and is itself built using the workflow it enables.

Currently in active development. All API routes use mock data. No database layer exists yet. Next milestone: real database + story/project management (Epics 3–4).

## Team

- Tech lead: David
- Team: 6+ developers
- Focus: transitioning from Mendix consulting to AI-assisted app delivery for SME/enterprise clients
- Language: English

## Project Structure

```
zoniq/              # Main Next.js application (all development here)
docs/planning/      # PRD, architecture, UX specs, HTML prototypes
.beads/             # Local session sub-task tracking only (not canonical)
```

## Current App State

- **Done:** Epic 1 (Auth + User Management) + Epic 2 core (Dashboard, Customer/App/Module/Feature CRUD, Test Coverage, AI Chat) + Story 2.14 (AI-Generated Modules for Apps)
- **Not started:** Stories 2.15–2.16 (AI-Generated Features, AI-Generated Context), Epics 3–9 (Project management, Story management, AI generation, Deployment, etc.)
- All API routes currently return mock data — no DB connected
- See `docs/planning/epics.md` for full story list and acceptance criteria

## Tech Stack

- Next.js 16 + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Clerk 5.x for authentication and RBAC
- Vercel AI SDK for AI integration
- PostgreSQL + Drizzle ORM (planned, not yet implemented)

## Developer Workflow

1. Pick a **GitHub Issue** (canonical task store)
2. Create branch: `git checkout -b story/ZPM-<id>-<short-slug>`
3. Open Claude Code — reference the issue number for full acceptance criteria
4. Agent implements; developer checks in at ~30% and ~80% progress
5. Build must pass: `cd zoniq && npm run build`
6. Tests must pass: `npm run test`
7. Create PR → team review → merge
8. Update ZoniqPM story status manually (until the ZoniqPM API exists)

**One story = one branch = one Claude Code session = one PR.**

## Agent Instructions

- All acceptance criteria are in the GitHub issue body — read the issue, not epics.md
- `docs/planning/epics.md` is the original source but is 2500 lines — avoid reading it whole
- Always `cd zoniq/` before running npm commands
- Run `npm run build` before declaring a story done — it must pass clean

### Discovered issues
If you find a bug, missing dependency, or unexpected blocker mid-session:
1. Create a new GitHub Issue in `davidc4ke/ZoniqPM` describing what you found
2. Add the `blocked` label to the current issue if it can't proceed, with a comment linking to the new issue
3. Continue with what you can, or stop cleanly if fully blocked

### Mid-session handoff
If a session ends before the story is complete (build fails, scope too large, etc.):
1. Leave a comment on the GitHub issue with: current status, what's done, what's left, any gotchas
2. Push the WIP branch so work isn't lost
3. Do NOT open a PR for incomplete work

### Blocked label protocol
Before starting, check if the issue has a `blocked` label — if so, read the comments to understand why and do not proceed until the blocker is resolved.

## PR Template

When opening a PR at the end of a story, always use this body format:

```
## What
<1-2 sentence summary of what was implemented>

## GitHub Issue
Closes #<issue-number>

## Testing Checklist
Convert every Given/When/Then block from the issue's acceptance criteria into a checkbox:

- [ ] Given <context>, when <action>, then <expected result>
- [ ] Given <context>, when <action>, then <expected result>
...

## Notes
<anything non-obvious about the implementation, or empty>
```

The testing checklist is what the reviewer clicks through manually before merging. One checkbox per AC scenario — keep them short and action-oriented.

## CLAUDE.md Self-Update Rule

**After completing any story or feature, update this file before ending the session:**

1. Move the completed story from "Not started" to "Done" in `## Current App State`
2. Update the "Next milestone" line to reflect what's next
3. If a new package was added to the stack, add it to `## Tech Stack`

This keeps every new session accurately informed about where the project stands.

## Design System

Prototypes in `docs/planning/` — reference these when building UI.

- Primary orange: `#FF6B35`
- Dark brown: `#2D1810`
- Font: Manrope
- Base spacing unit: 8px
- Desktop-first (1024px+)
- WCAG 2.1 AA accessibility target
