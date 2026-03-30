# Story 2.3: App Detail Overview Tab

Status: done

## Story

As a user,
I want to view an app's overview with details, version, status, and description,
So that I can quickly understand the app's current state. (FR43-FR48)

## Acceptance Criteria

1. **Given** a user navigating to an app detail page **When** the page loads **Then** the overview tab is displayed by default **And** the following information is shown: app name, description, current version, status, Mendix App ID, linked customer.

2. **Given** a user on the app overview tab **When** the user views the status **Then** status is displayed with a color-coded badge (Active, Inactive, In Development).

3. **Given** a user on the app overview tab **When** the user views the modules section **Then** a summary of modules count is displayed **And** a quick link to modules tab is available.

## Tasks / Subtasks

- [ ] Task 1: Add modulesCount field to App type and mock data (AC: #3)
  - [ ] 1.1 Add `modulesCount` field to App interface in `src/types/app.ts`
  - [ ] 1.2 Update mock data in `src/lib/apps/mock-data.ts` with modulesCount values
  - [ ] 1.3 Update reset function and create/update functions to handle modulesCount
  - [ ] 1.4 Write tests for modulesCount in mock data

- [ ] Task 2: Add tab navigation to app detail page (AC: #1)
  - [ ] 2.1 Create tab navigation component with Overview as default active tab
  - [ ] 2.2 Add placeholder tabs: Modules & Features, Tests, Workflows, Context, Projects, Metrics (matching design prototype)
  - [ ] 2.3 Implement tab switching state management
  - [ ] 2.4 Write tests for tab navigation (default tab, tab switching)

- [ ] Task 3: Create overview tab content (AC: #1, #2, #3)
  - [ ] 3.1 Refactor existing app detail info grid into overview tab content
  - [ ] 3.2 Ensure color-coded status badges display correctly (Active=green, Inactive=gray, In Development=blue)
  - [ ] 3.3 Add modules summary section with count and quick link to modules tab
  - [ ] 3.4 Write tests for overview tab content (info display, status badges, modules summary)

- [ ] Task 4: Run full test suite and validation (All ACs)
  - [ ] 4.1 Run full test suite (`npm run test:run`) — all tests must pass
  - [ ] 4.2 Run lint (`npm run lint`) — no new errors
  - [ ] 4.3 Run build (`npm run build`) — no new code errors

## Dev Notes

### Architecture Patterns & Constraints

**Database:** No database configured. Use in-memory mock data (same pattern as existing).

**Design Tokens (App theme - Blue)**
- App accent: `#2563EB`
- Tab active: border-bottom `#2563EB`, text `#2563EB`
- Tab inactive text: `#9A948D`
- Standard borders: `#E8E4E0`
- Dark text: `#2D1810`

### Tab Navigation (from design prototype)
Tabs: Overview (default), Modules & Features, Tests, Workflows, Context, Projects, Metrics
- Only Overview tab has content in this story
- Other tabs show placeholder "Coming soon" content

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3]
- [Source: _bmad-output/planning-artifacts/design-app-management.html]
- [Source: zoniq/src/components/features/app-detail/app-detail.tsx]
