# Story 2.7: App Test Coverage Tab

Status: done

## Story

As a user,
I want to view test coverage status for an app's modules and features,
so that I can understand what's tested and what needs attention.

## Acceptance Criteria

1. **View Module-Level Coverage Summary**: Given a user on an app detail page, when the user navigates to the Test Coverage tab, then a summary of test coverage is displayed per module showing module name, total tests, coverage percentage, and a health indicator (Excellent >=80%, Good >=50%, Critical <50%).

2. **Expand Module for Feature Coverage**: Given a user viewing test coverage, when the user expands a module, then feature-level coverage is displayed. Each feature shows test count and coverage percentage.

3. **View Feature Test Details**: Given a user viewing test coverage, when the user clicks on a feature, then linked test scripts and UAT steps are displayed. Each shows name, type (test script / UAT step), and pass/fail status.

## Tasks / Subtasks

- [x] Task 1: Create Test Coverage type definitions and Zod schemas (AC: #1, #2, #3)
  - [x] 1.1: Write tests for Test Coverage types in `src/types/test-coverage.test.ts`
  - [x] 1.2: Create `src/types/test-coverage.ts` with interfaces: `ModuleCoverage`, `FeatureCoverage`, `TestItem` (representing test scripts and UAT steps), `CoverageHealthStatus` type, and helper `getCoverageHealth` function
  - [x] 1.3: Run tests — 15 tests pass

- [x] Task 2: Create Test Coverage mock data layer (AC: #1, #2, #3)
  - [x] 2.1: Write tests for mock data functions in `src/lib/test-coverage/mock-data.test.ts`
  - [x] 2.2: Create `src/lib/test-coverage/mock-data.ts` with functions: `getModuleCoverage(appId)` returns array of ModuleCoverage, `getFeatureCoverage(moduleId)` returns array of FeatureCoverage, `getFeatureTestItems(featureId)` returns array of TestItem
  - [x] 2.3: Pre-seed mock data that links to existing module/feature mock data IDs where possible
  - [x] 2.4: Run tests — 14 tests pass

- [x] Task 3: Create Test Coverage API routes (AC: #1, #2, #3)
  - [x] 3.1: Write tests for API routes in `src/app/api/apps/[id]/test-coverage/route.test.ts`
  - [x] 3.2: Create `src/app/api/apps/[id]/test-coverage/route.ts` — GET returns module-level coverage summary for the app
  - [x] 3.3: Write tests for feature coverage in `src/app/api/apps/[id]/test-coverage/modules/[moduleId]/route.test.ts`
  - [x] 3.4: Create `src/app/api/apps/[id]/test-coverage/modules/[moduleId]/route.ts` — GET returns feature-level coverage for a module
  - [x] 3.5: Write tests for feature test items in `src/app/api/apps/[id]/test-coverage/features/[featureId]/route.test.ts`
  - [x] 3.6: Create `src/app/api/apps/[id]/test-coverage/features/[featureId]/route.ts` — GET returns linked test scripts and UAT steps for a feature
  - [x] 3.7: Run tests — 12 tests pass

- [x] Task 4: Create Test Coverage TanStack Query hooks (AC: #1, #2, #3)
  - [x] 4.1: Write tests for hooks in `src/hooks/use-test-coverage.test.ts`
  - [x] 4.2: Create `src/hooks/use-test-coverage.ts` with `useModuleCoverage(appId)`, `useFeatureCoverage(appId, moduleId)`, `useFeatureTestItems(appId, featureId)`
  - [x] 4.3: Run tests — 7 tests pass

- [x] Task 5: Create Test Coverage UI components (AC: #1, #2, #3)
  - [x] 5.1: Write tests for UI components in `src/components/features/app-test-coverage/app-test-coverage.test.tsx`
  - [x] 5.2: Create `src/components/features/app-test-coverage/coverage-health-badge.tsx` — badge showing Excellent (green), Good (amber), Critical (red) based on percentage
  - [x] 5.3: Create `src/components/features/app-test-coverage/module-coverage-row.tsx` — expandable row showing module name, test count, coverage %, health badge; click to expand/collapse feature list
  - [x] 5.4: Create `src/components/features/app-test-coverage/feature-coverage-row.tsx` — row showing feature name, test count, coverage %; clickable to show test items
  - [x] 5.5: Create `src/components/features/app-test-coverage/test-item-list.tsx` — list of test scripts and UAT steps with name, type badge, pass/fail status icon
  - [x] 5.6: Create `src/components/features/app-test-coverage/app-test-coverage.tsx` — main container with overall summary header, list of ModuleCoverageRows, loading skeleton, empty state
  - [x] 5.7: Run tests — 10 tests pass

- [x] Task 6: Integrate Test Coverage tab into AppDetail (AC: #1)
  - [x] 6.1: Write/update test in `src/components/features/app-detail/app-detail.test.tsx` for Tests tab rendering AppTestCoverage
  - [x] 6.2: Import `AppTestCoverage` in `app-detail.tsx` and render it when `activeTab === 'tests'`
  - [x] 6.3: Run full test suite — 541 tests pass, 0 regressions

- [x] Task 7: Final validation
  - [x] 7.1: Run full test suite (`npm run test:run`) — 541 tests pass across 60 files, 0 regressions
  - [x] 7.2: Run linter (`npm run lint`) — 0 errors (3 pre-existing warnings)
  - [x] 7.3: All 3 acceptance criteria verified and satisfied

## Dev Notes

### Architecture Patterns (MUST FOLLOW)

Follow **exact same patterns** as previous stories (2-4, 2-5, 2-6). This is a **read-only tab** — no CRUD operations, no forms, no dialogs.

**Data hierarchy**: App → Module (coverage) → Feature (coverage) → Test Items (scripts + UAT steps)

### Type Definition Pattern
- File: `src/types/test-coverage.ts`
- Use Zod v4 for schema definitions (`import { z } from 'zod'`)
- Export both interface and Zod schema versions
- `CoverageHealthStatus` = `'excellent' | 'good' | 'critical'`
- Helper function `getCoverageHealth(percentage: number): CoverageHealthStatus`
  - >= 80 → 'excellent', >= 50 → 'good', < 50 → 'critical'

### Mock Data Pattern
- File: `src/lib/test-coverage/mock-data.ts`
- Follow same pattern as `src/lib/modules/mock-data.ts` and `src/lib/features/mock-data.ts`
- Use `TODO: Replace with Drizzle ORM` comment at top
- Pre-seed realistic test coverage data for existing mock modules/features
- Test items should have types: `'test-script'` and `'uat-step'`
- Test items should have status: `'passed' | 'failed' | 'pending'`

### API Route Pattern
- Routes nest under `/api/apps/[id]/test-coverage/...`
- Follow same patterns as environment/module/feature routes
- All routes are GET-only (read-only tab)
- Validate `appId` exists before returning data
- Response format: `{ data: T }` for success, `{ error: { code, message } }` for errors
- Return 404 if app not found

### Hook Pattern
- File: `src/hooks/use-test-coverage.ts`
- Follow same TanStack Query pattern as `use-modules.ts`
- Query keys: `['test-coverage', appId]`, `['feature-coverage', appId, moduleId]`, `['feature-test-items', appId, featureId]`
- All hooks are read-only (no mutations needed)
- Enable queries only when IDs are provided (`enabled: !!appId`)

### UI Component Pattern
- Directory: `src/components/features/app-test-coverage/`
- Follow same component structure as `app-modules/` and `app-features/`
- Use design tokens from existing code:
  - Primary Blue: `#2563EB`
  - Primary Orange: `#FF6B35`
  - Success Green: `#16A34A` / bg `#DCFCE7`
  - Warning Amber: `#D97706` / bg `#FEF3C7`
  - Danger Red: `#DC2626` / bg `#FEF2F2`
  - Neutral: `#9A948D`, `#E8E4E0`, `#F5F2EF`
  - Text Dark: `#2D1810`
- Loading skeleton pattern: `animate-pulse` divs matching layout
- Empty state: centered message with icon
- Expandable rows: use `useState` for open/closed state, chevron icon rotation

### Coverage Health Badge Colors
- Excellent (>=80%): green bg `#DCFCE7` text `#16A34A`
- Good (>=50%): amber bg `#FEF3C7` text `#D97706`
- Critical (<50%): red bg `#FEF2F2` text `#DC2626`

### Testing Standards
- Framework: Vitest + React Testing Library
- Write tests BEFORE implementation (red-green-refactor)
- Test file naming: `*.test.ts` or `*.test.tsx` colocated with source
- Mock fetch with `vi.spyOn(globalThis, 'fetch')`
- Mock hooks with `vi.mock('@/hooks/use-test-coverage')`
- Use `QueryClientProvider` wrapper for hook tests
- Test: loading states, error states, empty states, data display, expand/collapse interaction, click interactions

### Integration Point
- File to modify: `src/components/features/app-detail/app-detail.tsx`
- Import `AppTestCoverage` from `../app-test-coverage/app-test-coverage`
- Replace the "Coming soon" fallback for `tests` tab with `<AppTestCoverage appId={appId} />`
- This is the same pattern used for `environments` and `modules` tabs

### Project Structure Notes
- All new files go under `zoniq/src/`
- Types: `src/types/test-coverage.ts`
- Mock data: `src/lib/test-coverage/mock-data.ts`
- API routes: `src/app/api/apps/[id]/test-coverage/`
- Hooks: `src/hooks/use-test-coverage.ts`
- Components: `src/components/features/app-test-coverage/`

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.7]
- [Source: _bmad-output/planning-artifacts/_docs/prd.md#FR59-FR65 Test Coverage Tab]
- [Source: _bmad-output/implementation-artifacts/2-6-feature-crud-operations.md - patterns]
- [Source: zoniq/src/components/features/app-detail/app-detail.tsx - integration point]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- 59 new tests added (15 type + 14 mock data + 12 API + 7 hooks + 10 UI + 1 integration)
- All 541 tests pass across 60 test files with 0 regressions
- Linter: 0 errors (3 pre-existing warnings)
- All 3 acceptance criteria satisfied
- Red-green-refactor cycle followed for every task

### File List

New files:
- zoniq/src/types/test-coverage.ts
- zoniq/src/types/test-coverage.test.ts
- zoniq/src/lib/test-coverage/mock-data.ts
- zoniq/src/lib/test-coverage/mock-data.test.ts
- zoniq/src/app/api/apps/[id]/test-coverage/route.ts
- zoniq/src/app/api/apps/[id]/test-coverage/route.test.ts
- zoniq/src/app/api/apps/[id]/test-coverage/modules/[moduleId]/route.ts
- zoniq/src/app/api/apps/[id]/test-coverage/modules/[moduleId]/route.test.ts
- zoniq/src/app/api/apps/[id]/test-coverage/features/[featureId]/route.ts
- zoniq/src/app/api/apps/[id]/test-coverage/features/[featureId]/route.test.ts
- zoniq/src/hooks/use-test-coverage.ts
- zoniq/src/hooks/use-test-coverage.test.ts
- zoniq/src/components/features/app-test-coverage/app-test-coverage.tsx
- zoniq/src/components/features/app-test-coverage/app-test-coverage.test.tsx
- zoniq/src/components/features/app-test-coverage/coverage-health-badge.tsx
- zoniq/src/components/features/app-test-coverage/module-coverage-row.tsx
- zoniq/src/components/features/app-test-coverage/feature-coverage-row.tsx
- zoniq/src/components/features/app-test-coverage/test-item-list.tsx

Modified files:
- zoniq/src/components/features/app-detail/app-detail.tsx
- zoniq/src/components/features/app-detail/app-detail.test.tsx
