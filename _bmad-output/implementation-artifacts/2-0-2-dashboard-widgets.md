# Story 2.0.2: Dashboard Widgets

Status: review

## Story

As a user,
I want to see widgets on the dashboard showing my work, project status, and team activity,
so that I can quickly understand the current state of work. (FR-new31, FR-new34, FR-new35)

## Acceptance Criteria

1. **Given** a user on the dashboard, **When** the Assigned Stories widget loads, **Then** stories assigned to the current user are displayed with title, project, status, and priority **And** each story card shows the assignee avatar and priority indicator **And** clicking a story card navigates to the story detail page.

2. **Given** a user with stories awaiting review, **When** the Review Queue widget loads, **Then** stories in "Ready" or "In Review" status are displayed **And** a count badge shows the total number of items in the queue.

3. **Given** a user on the dashboard, **When** the Projects widget loads, **Then** active projects are displayed with progress percentage and progress bar **And** a mini-kanban view shows story counts by status (Backlog, Active, Testing, Review, Done) **And** clicking a project navigates to the project detail page.

4. **Given** a user on the dashboard, **When** the Apps widget loads, **Then** apps are displayed with environment status indicators (Dev, Test, Acc, Prod) **And** warning counts are shown for apps with issues **And** clicking an app navigates to the app detail page.

5. **Given** a user on the dashboard, **When** the Team Activity widget loads, **Then** recent team activity is displayed in a horizontal scrollable feed **And** each activity item shows user avatar, action description, and timestamp **And** activities include: story status changes, story creation, story completion, AI generation actions.

## Tasks / Subtasks

- [x] Task 1: Create dashboard widget types and mock data service (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Create `src/types/dashboard.ts` with types for AssignedStory, ReviewStory, ProjectSummary, AppSummary, TeamActivity
  - [x] 1.2 Create `src/lib/dashboard/mock-data.ts` with mock data generators for all 5 widgets (extract from existing hardcoded data in widget components)
  - [x] 1.3 Write unit tests for mock data generators (verify correct shape and types)

- [x] Task 2: Install TanStack Query and create provider (AC: #1, #2, #3, #4, #5)
  - [x] 2.1 Install `@tanstack/react-query` package
  - [x] 2.2 Create `src/components/providers/query-provider.tsx` — client component wrapping QueryClientProvider
  - [x] 2.3 Add QueryProvider to root layout (`src/app/layout.tsx`)
  - [x] 2.4 Write unit test to verify QueryProvider renders children

- [x] Task 3: Create dashboard API routes (AC: #1, #2, #3, #4, #5)
  - [x] 3.1 Create `src/app/api/dashboard/assigned-stories/route.ts` — GET endpoint returning mock assigned stories for current user, wrapped in `{ data: [...] }` format with auth check
  - [x] 3.2 Create `src/app/api/dashboard/review-queue/route.ts` — GET endpoint returning mock review queue stories, wrapped in `{ data: [...], meta: { total: N } }` format
  - [x] 3.3 Create `src/app/api/dashboard/projects/route.ts` — GET endpoint returning mock project summaries with progress and column counts
  - [x] 3.4 Create `src/app/api/dashboard/apps/route.ts` — GET endpoint returning mock app summaries with environment statuses
  - [x] 3.5 Create `src/app/api/dashboard/activity/route.ts` — GET endpoint returning mock team activity feed
  - [x] 3.6 Write unit tests for all 5 API routes (verify auth check, response format, data shape)

- [x] Task 4: Create useDashboard hooks with TanStack Query (AC: #1, #2, #3, #4, #5)
  - [x] 4.1 Create `src/hooks/use-dashboard.ts` with hooks: `useAssignedStories()`, `useReviewQueue()`, `useProjects()`, `useApps()`, `useTeamActivity()` — each using `useQuery` to fetch from dashboard API routes
  - [x] 4.2 Write unit tests for all hooks: verify loading states, data fetching, error handling

- [x] Task 5: Update widget components with data fetching, navigation, and loading states (AC: #1, #2, #3, #4, #5)
  - [x] 5.1 Update `AssignedStoriesWidget` — use `useAssignedStories()` hook, add skeleton loading state, add `onClick` to StoryCard that navigates to `/stories/{id}` via `useRouter()`
  - [x] 5.2 Update `ReviewQueueWidget` — use `useReviewQueue()` hook, add skeleton loading state, dynamic count badge from `meta.total`
  - [x] 5.3 Update `ProjectsWidget` — use `useProjects()` hook, add skeleton loading state, wrap each project card in `Link` to `/projects/{id}`
  - [x] 5.4 Update `AppsWidget` — use `useApps()` hook, add skeleton loading state, wrap each app card in `Link` to `/apps/{id}`
  - [x] 5.5 Update `TeamActivityWidget` — use `useTeamActivity()` hook, add skeleton loading state
  - [x] 5.6 Add `'use client'` directive to any widget components that don't yet have it (hooks require client components)
  - [x] 5.7 Write unit tests for all updated widgets: renders loading skeleton, renders data after fetch, click navigation works

- [x] Task 6: Create Widget skeleton component (AC: #1, #2, #3, #4, #5)
  - [x] 6.1 Create `src/components/features/dashboard/widget-skeleton.tsx` — reusable skeleton with configurable row count, matching Widget container dimensions
  - [x] 6.2 Write unit test for WidgetSkeleton: renders correct number of skeleton rows

- [x] Task 7: Integration test and polish (AC: #1, #2, #3, #4, #5)
  - [x] 7.1 Write integration test for dashboard-client: all 5 widgets render, loading states show then resolve to data
  - [x] 7.2 Run full test suite and fix any regressions

## Dev Notes

### Architecture Compliance

- **State management**: Use TanStack Query (React Query) for server state — this is specified in the architecture doc. Install `@tanstack/react-query` (not yet in package.json).
- **API response format**: All endpoints MUST return `{ data: T }` or `{ data: T, meta: {...} }` for success, `{ error: { code, message } }` for errors.
- **Auth check**: All API routes must check auth via `auth()` from `@clerk/nextjs/server`. Return 401 if not authenticated.
- **Mock data**: No database exists yet — use mock data in API routes. Add TODO comments for real database integration.
- **Navigation**: Use Next.js `useRouter().push()` for programmatic navigation or `<Link>` component for declarative links.
- **Loading states**: Use Skeleton components (architecture mandates skeletons, not spinners).

### Design Tokens (from shared-styles.css and existing components)

- **Widget container**: `rounded-xl border border-[#E8E4E0] bg-white p-5 shadow-sm`
- **Story card**: `rounded-lg border border-[#E8E4E0] bg-[#F5F2EF] p-3`, hover: `border-[#FF6B35]`
- **Priority colors**: high=`#EF4444`, medium=`#F59E0B`, low=`#9A948D`
- **Status colors**: backlog=`#9A948D`, ready=`#10B981`, in-progress=`#F59E0B`, review=`#2563EB`, testing=`#9333EA`, done=`#10B981`
- **Project card bg**: `bg-[#F3E8FF]`, hover: `bg-[#E9D5FF]`
- **App card bg**: `bg-[#DBEAFE]`, hover: `bg-[#BFDBFE]`
- **Environment status dots**: healthy=`#10B981`, warning=`#F59E0B`, error=`#EF4444`, offline=`#9A948D`
- **Activity feed item**: `rounded-lg bg-[#F5F2EF] px-4 py-2.5`
- **Count badge**: `rounded-full px-2 py-1 text-xs font-semibold bg-[#E8E4E0] text-[#2D1810]`
- **Skeleton**: Use `animate-pulse bg-[#E8E4E0] rounded` pattern

### Existing Widget Components (from story 2-0)

All widget components already exist with hardcoded mock data:
- `src/components/features/dashboard/widget.tsx` — reusable Widget wrapper (title, icon, count, action)
- `src/components/features/dashboard/story-card.tsx` — StoryCard with priority/status (has `onClick` prop)
- `src/components/features/dashboard/assigned-stories-widget.tsx` — hardcoded mock stories
- `src/components/features/dashboard/review-queue-widget.tsx` — hardcoded mock review stories
- `src/components/features/dashboard/projects-widget.tsx` — hardcoded mock projects with MiniKanban
- `src/components/features/dashboard/apps-widget.tsx` — hardcoded mock apps with env status
- `src/components/features/dashboard/team-activity-widget.tsx` — hardcoded mock activity
- `src/components/features/dashboard/mini-kanban.tsx` — UNUSED duplicate, ignore (real one is in `mini-kanban/`)
- `src/components/features/mini-kanban/mini-kanban.tsx` — proper MiniKanban used by ProjectsWidget
- `src/components/features/activity-feed/activity-feed.tsx` — ActivityFeed used by TeamActivityWidget
- `src/app/(dashboard)/dashboard/dashboard-client.tsx` — client wrapper with grid layout

**Key changes needed**: Replace hardcoded mock data in widgets with hook-based data fetching. Add loading skeletons. Add click navigation.

### File Structure

```
src/
├── types/
│   └── dashboard.ts                         # NEW: Dashboard widget types
├── lib/
│   └── dashboard/
│       └── mock-data.ts                     # NEW: Mock data generators
├── hooks/
│   └── use-dashboard.ts                     # NEW: TanStack Query hooks
├── components/
│   ├── providers/
│   │   └── query-provider.tsx               # NEW: QueryClientProvider wrapper
│   └── features/
│       └── dashboard/
│           ├── widget.tsx                    # EXISTING (no change needed)
│           ├── story-card.tsx               # EXISTING (no change needed)
│           ├── widget-skeleton.tsx           # NEW: Reusable skeleton
│           ├── assigned-stories-widget.tsx   # MODIFY: Add data fetching, navigation
│           ├── review-queue-widget.tsx       # MODIFY: Add data fetching
│           ├── projects-widget.tsx           # MODIFY: Add data fetching, navigation
│           ├── apps-widget.tsx              # MODIFY: Add data fetching, navigation
│           └── team-activity-widget.tsx      # MODIFY: Add data fetching
├── app/
│   ├── layout.tsx                           # MODIFY: Add QueryProvider
│   └── api/
│       └── dashboard/
│           ├── assigned-stories/
│           │   └── route.ts                 # NEW: Assigned stories endpoint
│           ├── review-queue/
│           │   └── route.ts                 # NEW: Review queue endpoint
│           ├── projects/
│           │   └── route.ts                 # NEW: Projects endpoint
│           ├── apps/
│           │   └── route.ts                 # NEW: Apps endpoint
│           └── activity/
│               └── route.ts                 # NEW: Activity feed endpoint
```

### Testing Standards

- **Framework**: Vitest + React Testing Library (already configured)
- **Test files**: Co-locate as `*.test.ts` / `*.test.tsx` next to source files
- **Mocks**: Clerk auth is mocked in `src/test/setup.ts`. Mock fetch for TanStack Query hooks.
- **Pattern**: Write tests BEFORE implementation (red-green-refactor)
- **Coverage expectations**: All widgets render loading state, render data, handle click events. All API routes return correct format. All hooks manage states correctly.
- **TanStack Query test wrapper**: Create a test utility that wraps components in QueryClientProvider for testing.

### Previous Story Intelligence (2-0-1-universal-ai-input-field)

- Dashboard page is at `src/app/(dashboard)/dashboard/page.tsx` — server component
- DashboardClient wraps UniversalInput + ChatOverlay + widget grid
- Topbar chat button is wired via custom event `zoniq:open-chat`
- Widget grid: 4-column layout with `grid grid-cols-4 gap-5`, TeamActivity is full-width below
- CSS animations use keyframes (not framer-motion) for test compatibility
- 57 tests pass including dashboard integration tests
- Clerk auth mocked in `src/test/setup.ts`

### Key Implementation Decisions

1. **TanStack Query for data fetching**: Architecture specifies this. Install and set up QueryClientProvider. Use `useQuery` with `queryKey` arrays and `queryFn` that calls fetch.
2. **Mock data in API routes**: Since no database yet, API routes return hardcoded mock data. Add `// TODO: Replace with database query` comments.
3. **Skeleton loading**: Use `animate-pulse` Tailwind class on div placeholders. Match the widget's content layout shape.
4. **Navigation via Link**: Use Next.js `<Link>` for project/app cards (SEO-friendly). Use `useRouter().push()` for StoryCard onClick (already has onClick prop).
5. **Keep dashboard/mini-kanban.tsx**: It's unused but from story 2-0 — don't delete it, just ignore it.

### References

- [Source: _bmad-output/planning-artifacts/epics.md - Story 2.0.2]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md - State Management, API Response Formats]
- [Source: _bmad-output/planning-artifacts/design-home-page.html - Widget layout and design]
- [Source: _bmad-output/planning-artifacts/shared-styles.css - Design tokens]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No issues encountered during implementation

### Completion Notes List

- Created dashboard types (AssignedStory, ReviewStory, ProjectSummary, AppSummary, TeamActivity) in src/types/dashboard.ts
- Extracted hardcoded mock data from widget components into centralized mock-data service (src/lib/dashboard/mock-data.ts)
- Installed @tanstack/react-query and created QueryProvider wrapping root layout
- Created 5 dashboard API routes (assigned-stories, review-queue, projects, apps, activity) with Clerk auth checks and { data } response format
- Created 5 TanStack Query hooks (useAssignedStories, useReviewQueue, useProjects, useApps, useTeamActivity)
- Updated all 5 widget components to use hooks for data fetching, added WidgetSkeleton loading states
- Added navigation: StoryCard onClick navigates to /stories/{id}, project cards use Link to /projects/{id}, app cards use Link to /apps/{id}
- Created reusable WidgetSkeleton component with configurable row count
- Added data-testid="story-card" to StoryCard for test targeting
- 93 total tests (36 new + 57 existing), all passing with zero regressions

### File List

**Created:**
- zoniq/src/types/dashboard.ts
- zoniq/src/lib/dashboard/mock-data.ts
- zoniq/src/lib/dashboard/mock-data.test.ts
- zoniq/src/components/providers/query-provider.tsx
- zoniq/src/components/providers/query-provider.test.tsx
- zoniq/src/hooks/use-dashboard.ts
- zoniq/src/hooks/use-dashboard.test.ts
- zoniq/src/components/features/dashboard/widget-skeleton.tsx
- zoniq/src/components/features/dashboard/widget-skeleton.test.tsx
- zoniq/src/components/features/dashboard/assigned-stories-widget.test.tsx
- zoniq/src/components/features/dashboard/review-queue-widget.test.tsx
- zoniq/src/components/features/dashboard/projects-widget.test.tsx
- zoniq/src/components/features/dashboard/apps-widget.test.tsx
- zoniq/src/components/features/dashboard/team-activity-widget.test.tsx
- zoniq/src/app/api/dashboard/assigned-stories/route.ts
- zoniq/src/app/api/dashboard/assigned-stories/route.test.ts
- zoniq/src/app/api/dashboard/review-queue/route.ts
- zoniq/src/app/api/dashboard/review-queue/route.test.ts
- zoniq/src/app/api/dashboard/projects/route.ts
- zoniq/src/app/api/dashboard/projects/route.test.ts
- zoniq/src/app/api/dashboard/apps/route.ts
- zoniq/src/app/api/dashboard/apps/route.test.ts
- zoniq/src/app/api/dashboard/activity/route.ts
- zoniq/src/app/api/dashboard/activity/route.test.ts

**Modified:**
- zoniq/src/app/layout.tsx (added QueryProvider)
- zoniq/src/components/features/dashboard/assigned-stories-widget.tsx (data fetching, navigation, loading)
- zoniq/src/components/features/dashboard/review-queue-widget.tsx (data fetching, loading)
- zoniq/src/components/features/dashboard/projects-widget.tsx (data fetching, navigation, loading)
- zoniq/src/components/features/dashboard/apps-widget.tsx (data fetching, navigation, loading)
- zoniq/src/components/features/dashboard/team-activity-widget.tsx (data fetching, loading)
- zoniq/src/components/features/dashboard/story-card.tsx (added data-testid)
