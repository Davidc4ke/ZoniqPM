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

- **Done:** Epic 1 (Auth + User Management) + Epic 2 core (Dashboard, Customer/App/Module/Feature CRUD, Test Coverage, AI Chat)
- **Not started:** Epics 3–9 (Project management, Story management, AI generation, Deployment, etc.)
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
3. Open Claude Code — reference the issue number and `docs/planning/epics.md` for full acceptance criteria
4. Agent implements; developer checks in at ~30% and ~80% progress
5. Build must pass: `cd zoniq && npm run build`
6. Tests must pass: `npm run test`
7. Create PR → team review → merge
8. Update ZoniqPM story status manually (until the ZoniqPM API exists)

**One story = one branch = one Claude Code session = one PR.**

## Agent Instructions

- Read `docs/planning/epics.md` to find acceptance criteria for the current story
- Always `cd zoniq/` before running npm commands
- Run `npm run build` before declaring a story done — it must pass clean
- Use `bd` (beads) for local sub-task tracking within a session only — not as canonical storage
- See `AGENTS.md` for beads sub-task workflow

## Design System

Prototypes in `docs/planning/` — reference these when building UI.

- Primary orange: `#FF6B35`
- Dark brown: `#2D1810`
- Font: Manrope
- Base spacing unit: 8px
- Desktop-first (1024px+)
- WCAG 2.1 AA accessibility target
