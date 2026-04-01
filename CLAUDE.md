# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ZoniqPM** is an AI-powered requirements and project management tool for Mendix low-code development teams. It transforms documentation into a speed advantage by converting unstructured notes into acceptance criteria, development plans, and automated test scripts.

## Project Structure

```
zoniq/              # Main Next.js application
docs/
  planning/         # PRD, UX specs, architecture, design prototypes
.beads/             # Project issue tracking (beads CLI)
```

## Design Prototypes

HTML prototypes are in `docs/planning/`:
- `design-home-page.html` - Main dashboard view
- `design-kanban-board.html` - Kanban board view
- `design-story-details.html` - Story detail view
- `design-project-modules.html` - Project details
- `design-app-management.html` - App management
- `design-context-library.html` - Context library
- `shared-styles.css` - Shared design system styles

### Design Tokens (from shared-styles.css)
- Primary orange: `#FF6B35`
- Dark: `#2D1810`
- Font: Manrope

## Planning Documents

Key docs in `docs/planning/`:
- `prd.md` - Product Requirements Document
- `architecture.md` - Architecture decisions
- `epics.md` - Epics and user stories breakdown
- `ux-design-specification.md` - UX specifications

## Task Tracking

This project uses [beads](https://github.com/gastownhall/beads) for issue and task tracking. See `AGENT_INSTRUCTIONS.md` for agent workflow guidance.

## Configuration

- Project name: `ZoniqPM`
- User: David
- Language: English
