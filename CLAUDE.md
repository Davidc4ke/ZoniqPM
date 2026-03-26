# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BMAD Zoniq** is an AI-powered requirements and project management tool for Mendix low-code development teams. It transforms documentation into a speed advantage by converting unstructured notes into acceptance criteria, development plans, and automated test scripts.

## Project Structure

```
_bmad/                  # BMAD Method framework (do not modify)
  core/                 # Core workflows and tasks
  bmm/                  # BMAD Method Module (project management workflows)
  _memory/              # Agent memory and documentation standards

_bmad-output/           # Generated artifacts (planning & implementation)
  planning-artifacts/   # PRD, UX specs, architecture, design prototypes
  implementation-artifacts/  # Sprint plans, stories, code (when implemented)

docs/                   # Project knowledge documentation
```

## Design Prototypes

HTML prototypes are in `_bmad-output/planning-artifacts/`:
- `design-home-page.html` - Main dashboard view
- `design-kanban-board.html` - Kanban board view
- `design-story-details.html` - Story detail view
- `design-project-details.html` - Project details
- `design-app-management.html` - App management
- `design-context-library.html` - Context library
- `shared-styles.css` - Shared design system styles

### Design Tokens (from shared-styles.css)
- Primary orange: `#FF6B35`
- Dark: `#2D1810`
- Font: Manrope

## BMAD Workflows

This project uses the BMAD Method. Key workflow phases:

1. **Analysis** - Product briefs, research (market/domain/technical)
2. **Planning** - PRD creation, UX design
3. **Solutioning** - Architecture, epics/stories, implementation readiness
4. **Implementation** - Sprint planning, story development, code review

### Key Workflow Commands
- `bmad-bmm-create-prd` - Create Product Requirements Document
- `bmad-bmm-create-architecture` - Create architecture decisions
- `bmad-bmm-sprint-planning` - Generate sprint plan
- `bmad-bmm-dev-story` - Execute story implementation
- `bmad-bmm-automate-workflow` - **Automated pipeline**: create story + develop + code review in one go (no human intervention, ideal for scheduled runs)
- `bmad-bmm-quick-spec` / `bmad-bmm-quick-dev` - For small one-off tasks

### Autopilot Mode
The workflow engine supports an `autopilot` execution mode for fully unattended runs:
- Activated automatically by `bmad-bmm-automate-workflow` or by passing `autopilot=true`
- Skips all user confirmations and `<ask>` prompts
- Auto-discovers stories from sprint-status.yaml
- Auto-fixes code review findings
- HALTs gracefully on error conditions (missing sprint-status, no backlog stories)
- Ideal for Claude Code scheduled events

## Configuration

- Project name: `BMAD Zoniq`
- User: David
- Output folder: `_bmad-output/`
- Language: English
