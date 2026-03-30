# Story 2.6: Feature CRUD Operations

Status: done

## Story

As a PM,
I want to create, view, edit, and delete features within a module,
so that I can track granular functionality and link to stories.

## Acceptance Criteria

1. **Create Feature**: PM on module detail view clicks "Add Feature" -> modal opens with name and description fields -> fills in details and saves -> new feature record created and linked to module -> feature appears in module's feature list.

2. **View Feature List**: User viewing a module's features sees a list/grid of features showing name and description.

3. **View Feature Detail**: User clicks on a feature -> feature detail panel shows name, description, and linked stories.

4. **Edit Feature**: PM viewing a feature edits the feature name or description and saves -> feature record is updated -> changes are reflected immediately.

5. **Delete Feature**: PM viewing a feature with no linked stories clicks delete -> feature is soft-deleted -> feature no longer appears in the list.

6. **View Linked Stories**: User viewing a feature sees a list of stories referencing this feature. Each story shows title, status, and project.

## Tasks / Subtasks

- [x] Task 1: Create Feature type definitions and Zod schemas (AC: #1, #4)
  - [x] 1.1: Write tests for Feature types and Zod schemas in `src/types/feature.test.ts`
  - [x] 1.2: Create `src/types/feature.ts` with `Feature` interface, `LinkedStory` interface, `CreateFeatureInput`, `UpdateFeatureInput` types, and Zod schemas (`createFeatureSchema`, `updateFeatureSchema`)
  - [x] 1.3: Run tests — 17 tests pass

- [x] Task 2: Create Feature mock data layer (AC: #1, #2, #3, #4, #5, #6)
  - [x] 2.1: Write tests for mock data CRUD functions in `src/lib/features/mock-data.test.ts`
  - [x] 2.2: Create `src/lib/features/mock-data.ts` with pre-seeded features per module, and functions: `getFeaturesByModuleId`, `getFeatureById`, `createFeature`, `updateFeature`, `deleteFeature`, `resetFeatures`
  - [x] 2.3: Add linked stories mock support — `getLinkedStoriesByFeatureId` returning story stubs with title, status, project
  - [x] 2.4: Run tests — 25 tests pass

- [x] Task 3: Create Feature API routes (AC: #1, #2, #3, #4, #5)
  - [x] 3.1: Write tests for API routes in `src/app/api/apps/[id]/modules/[moduleId]/features/route.test.ts` and `[featureId]/route.test.ts`
  - [x] 3.2: Create `src/app/api/apps/[id]/modules/[moduleId]/features/route.ts` — GET (list) and POST (create)
  - [x] 3.3: Create `src/app/api/apps/[id]/modules/[moduleId]/features/[featureId]/route.ts` — GET (detail with linked stories), PUT (update), DELETE (soft-delete with dependency check)
  - [x] 3.4: Run tests — 28 tests pass

- [x] Task 4: Create Feature TanStack Query hooks (AC: #1, #2, #4, #5)
  - [x] 4.1: Write tests for hooks in `src/hooks/use-features.test.ts`
  - [x] 4.2: Create `src/hooks/use-features.ts` with `useFeatures(appId, moduleId)`, `useCreateFeature(appId, moduleId)`, `useUpdateFeature(appId, moduleId)`, `useDeleteFeature(appId, moduleId)`
  - [x] 4.3: Run tests — 7 tests pass

- [x] Task 5: Create Feature UI components (AC: #1, #2, #3, #4, #5, #6)
  - [x] 5.1: Write tests for UI components in `src/components/features/app-features/app-features.test.tsx`
  - [x] 5.2: Create `src/components/features/app-features/feature-card.tsx` — card displaying feature name, description, linked story count; Edit and Delete buttons
  - [x] 5.3: Create `src/components/features/app-features/feature-form.tsx` — reusable form with name (required) and description fields using React Hook Form + Zod
  - [x] 5.4: Create `src/components/features/app-features/feature-dialog.tsx` — modal dialog for create/edit, uses FeatureForm
  - [x] 5.5: Create `src/components/features/app-features/delete-feature-dialog.tsx` — confirmation dialog for delete with linked stories check
  - [x] 5.6: Create `src/components/features/app-features/feature-detail-panel.tsx` — detail view showing name, description, and linked stories list (AC: #3, #6)
  - [x] 5.7: Create `src/components/features/app-features/app-features.tsx` — main container with list, empty state, loading skeleton, Add Feature button, and all dialog state management
  - [x] 5.8: Run tests — 10 tests pass

- [x] Task 6: Integrate Features into Module detail view (AC: #2, #3)
  - [x] 6.1: Component test for AppFeatures covers feature display within module context
  - [x] 6.2: Updated `AppModules` component: clicking a module card navigates to `AppFeatures` view for that module with back navigation
  - [x] 6.3: Updated `ModuleCard` to be clickable (onClick prop) with keyboard accessibility
  - [x] 6.4: Run full test suite — 482 tests pass, 0 regressions

- [x] Task 7: Final validation
  - [x] 7.1: Run full test suite (`npm test`) — 482 tests pass across 53 files, 0 regressions
  - [x] 7.2: Run linter (`npm run lint`) — 0 errors (3 pre-existing warnings)
  - [x] 7.3: Run build — pre-existing Google Fonts network error (not related to changes)
  - [x] 7.4: All 6 acceptance criteria verified and satisfied

## Dev Notes

### Architecture Patterns (MUST FOLLOW)

Follow **exact same patterns** as Module CRUD (story 2-5). Feature is a child of Module, just as Module is a child of App.

**Data hierarchy**: Customer -> App -> Module -> Feature -> (linked Stories)

### Type Definition Pattern
- File: `src/types/feature.ts`
- Interface: `Feature` with fields: `id`, `moduleId`, `appId`, `name`, `description` (nullable), `linkedStoriesCount`, `isDeleted`, `createdAt`, `updatedAt`
- Zod schemas: `createFeatureSchema` (name required, description optional), `updateFeatureSchema` (all optional)
- Max lengths: name 100 chars, description 500 chars
- Reference: `src/types/module.ts` for exact pattern

### Mock Data Pattern
- File: `src/lib/features/mock-data.ts`
- Pre-seed 2-3 features per module (for modules in apps 1-5)
- All list queries filter `!isDeleted`
- Soft-delete: set `isDeleted = true`, never remove from array
- ID format: `feat-{nextId++}`
- Include `resetFeatures()` for test isolation
- For linked stories: return mock story stubs `{ id, title, status, projectName }` — use hardcoded mock data since stories aren't implemented yet
- Reference: `src/lib/modules/mock-data.ts` for exact pattern

### API Route Pattern
- List + Create: `src/app/api/apps/[id]/modules/[moduleId]/features/route.ts`
- Detail + Update + Delete: `src/app/api/apps/[id]/modules/[moduleId]/features/[featureId]/route.ts`
- **Auth check first**: `const { userId } = await auth(); if (!userId) return 401`
- **Parent validation chain**: Validate app exists -> validate module exists -> then operate on feature
- **Response format**: `{ data: T }` success, `{ error: { code, message } }` error
- **Status codes**: 200 (GET/PUT), 201 (POST), 400 (validation), 401 (unauth), 404 (not found)
- **Zod validation** on POST/PUT request body
- Reference: `src/app/api/apps/[id]/modules/route.ts` and `[moduleId]/route.ts`

### Hook Pattern
- File: `src/hooks/use-features.ts`
- Query key: `['features', moduleId]`
- `useFeatures(moduleId)` — list query with `enabled: !!moduleId`
- `useCreateFeature(appId, moduleId)` — POST mutation, invalidates `['features', moduleId]`
- `useUpdateFeature(appId, moduleId)` — PUT mutation, invalidates query
- `useDeleteFeature(appId, moduleId)` — DELETE mutation, invalidates query
- Hooks need both `appId` and `moduleId` for API URL: `/api/apps/${appId}/modules/${moduleId}/features`
- Reference: `src/hooks/use-modules.ts`

### UI Component Pattern
- Directory: `src/components/features/app-features/`
- Components: `app-features.tsx`, `feature-card.tsx`, `feature-form.tsx`, `feature-dialog.tsx`, `delete-feature-dialog.tsx`, `feature-detail-panel.tsx`
- All components use `'use client'` directive
- Design tokens: Primary `#FF6B35`, Dark `#2D1810`, Border `#E8E4E0`, Background `#F5F2EF`, Text secondary `#9A948D`, Error `#DC2626`/`#EF4444`
- Modal: max-w-[480px], backdrop `bg-black/50`, Escape key close, backdrop click close
- Empty state: "No features yet" in rounded border container
- Loading: Skeleton component matching final layout
- Cards: grid layout `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Reference: `src/components/features/app-modules/` for all component patterns

### Integration Pattern
- Features display within the modules context on the App Detail page
- When user clicks a module, show its features (expand or navigate pattern)
- The "Modules & Features" tab already exists in app-detail.tsx
- Update module card or add click behavior to show features for that module
- Feature count on module card should reflect actual feature data

### Linked Stories Display (AC: #6)
- Feature detail panel shows list of linked stories
- Each story shows: title, status badge, project name
- Use mock data for stories since story CRUD (epic 4) isn't built yet
- Simple list format, no interaction needed yet

### Testing Standards
- Framework: Vitest (see `vitest.config.ts`)
- Test files mirror source structure: `tests/unit/types/`, `tests/unit/lib/`, `tests/unit/api/`, `tests/unit/hooks/`, `tests/unit/components/`
- Use `resetFeatures()` in `beforeEach` for test isolation
- API tests mock `auth()` from `@clerk/nextjs/server`
- Component tests use `@testing-library/react` with TanStack Query wrapper
- Run full suite after each task to catch regressions
- Reference: `tests/unit/` for existing test patterns from story 2-5

### Delete Constraints
- Feature can only be deleted if it has no linked stories (AC: #5)
- If feature has linked stories, return error: `{ error: { code: 'HAS_DEPENDENCIES', message: 'Cannot delete feature with linked stories' } }`
- This mirrors the module delete pattern (can't delete module with features/stories)

### What NOT to Do
- Do NOT use Drizzle ORM — all data is in-memory mock layer (DB integration is a future story)
- Do NOT create new shadcn/ui components — use existing ones or plain Tailwind
- Do NOT add navigation/routing for feature detail pages — features are displayed within the module context
- Do NOT implement actual story linking — use mock story data
- Do NOT modify the app-detail tab structure beyond integration

### Project Structure Notes

- All new files follow existing kebab-case folder naming
- Component files use kebab-case: `feature-card.tsx`, `feature-dialog.tsx`
- Type files use kebab-case: `feature.ts`
- Hook files use kebab-case with `use-` prefix: `use-features.ts`
- API routes follow Next.js App Router nested dynamic segments

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.6]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#File Structure]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#API Patterns]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#Database Schemas]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md#Modal Patterns]
- [Source: _bmad-output/implementation-artifacts/2-5-module-crud-operations.md]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None

### Completion Notes List

- Implemented full Feature CRUD operations following exact Module CRUD patterns from story 2-5
- Feature types with Zod validation schemas (create/update) matching module patterns
- In-memory mock data layer with pre-seeded features (2 per module), soft-delete with linked stories dependency check
- Nested API routes under /api/apps/[id]/modules/[moduleId]/features with full parent chain validation
- TanStack Query hooks for all CRUD operations with cache invalidation
- Complete UI component set: card, form, dialog, delete dialog, detail panel with linked stories
- Integrated features into modules tab — clicking a module shows its features with back navigation
- All 87 new tests pass (17 type + 25 mock data + 28 API + 7 hooks + 10 components)
- Full suite: 482 tests, 53 files, 0 regressions

### File List

- zoniq/src/types/feature.ts (new)
- zoniq/src/types/feature.test.ts (new)
- zoniq/src/lib/features/mock-data.ts (new)
- zoniq/src/lib/features/mock-data.test.ts (new)
- zoniq/src/app/api/apps/[id]/modules/[moduleId]/features/route.ts (new)
- zoniq/src/app/api/apps/[id]/modules/[moduleId]/features/route.test.ts (new)
- zoniq/src/app/api/apps/[id]/modules/[moduleId]/features/[featureId]/route.ts (new)
- zoniq/src/app/api/apps/[id]/modules/[moduleId]/features/[featureId]/route.test.ts (new)
- zoniq/src/hooks/use-features.ts (new)
- zoniq/src/hooks/use-features.test.ts (new)
- zoniq/src/components/features/app-features/app-features.tsx (new)
- zoniq/src/components/features/app-features/app-features.test.tsx (new)
- zoniq/src/components/features/app-features/feature-card.tsx (new)
- zoniq/src/components/features/app-features/feature-form.tsx (new)
- zoniq/src/components/features/app-features/feature-dialog.tsx (new)
- zoniq/src/components/features/app-features/delete-feature-dialog.tsx (new)
- zoniq/src/components/features/app-features/feature-detail-panel.tsx (new)
- zoniq/src/components/features/app-modules/app-modules.tsx (modified - added feature drill-down)
- zoniq/src/components/features/app-modules/module-card.tsx (modified - added onClick prop)
