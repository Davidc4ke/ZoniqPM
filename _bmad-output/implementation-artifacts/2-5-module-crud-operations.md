# Story 2.5: Module CRUD Operations

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a PM,
I want to create, view, edit, and delete modules within an app,
so that I can organize app functionality into logical units. (FR49-FR51)

## Acceptance Criteria

1. **Create Module:**
   - Given a PM user on an app detail page
   - When the user navigates to the modules tab and clicks "Add Module"
   - Then a modal opens to create a new module with name and description fields

2. **Module Creation Save:**
   - Given a PM user creating a module
   - When the user fills in name and description and saves
   - Then a new module record is created and linked to the app
   - And the module appears in the modules list

3. **View Module Details:**
   - Given a user viewing the modules tab
   - When the user clicks on a module
   - Then the module detail panel shows name, description, and linked features count

4. **Edit Module:**
   - Given a PM user viewing a module
   - When the user edits the module name or description and saves
   - Then the module record is updated
   - And changes are reflected immediately

5. **Delete Module (No Dependencies):**
   - Given a PM user viewing a module with no linked features or stories
   - When the user deletes the module
   - Then the module is soft-deleted
   - And the module no longer appears in the list

## Tasks / Subtasks

- [x] Task 1: Create Module type definitions and Zod schemas (AC: #1, #2)
  - [x] 1.1 Create `zoniq/src/types/module.ts` with Module interface, CreateModuleInput, UpdateModuleInput schemas
  - [x] 1.2 Write tests for `zoniq/src/types/module.test.ts` validating Zod schemas

- [x] Task 2: Create Module mock data layer (AC: #1, #2, #3, #4, #5)
  - [x] 2.1 Create `zoniq/src/lib/modules/mock-data.ts` with CRUD functions (getModulesByAppId, getModuleById, createModule, updateModule, deleteModule — soft-delete pattern)
  - [x] 2.2 Write tests for `zoniq/src/lib/modules/mock-data.test.ts`

- [x] Task 3: Create Module API routes (AC: #1, #2, #3, #4, #5)
  - [x] 3.1 Create `zoniq/src/app/api/apps/[id]/modules/route.ts` (GET list, POST create)
  - [x] 3.2 Write tests `zoniq/src/app/api/apps/[id]/modules/route.test.ts`
  - [x] 3.3 Create `zoniq/src/app/api/apps/[id]/modules/[moduleId]/route.ts` (GET single, PUT update, DELETE soft-delete)
  - [x] 3.4 Write tests `zoniq/src/app/api/apps/[id]/modules/[moduleId]/route.test.ts`

- [x] Task 4: Create useModules hook (AC: #1, #2, #3, #4, #5)
  - [x] 4.1 Create `zoniq/src/hooks/use-modules.ts` with useModules, useCreateModule, useUpdateModule, useDeleteModule hooks
  - [x] 4.2 Write tests `zoniq/src/hooks/use-modules.test.ts`

- [x] Task 5: Create Module UI components (AC: #1, #2, #3, #4, #5)
  - [x] 5.1 Create `zoniq/src/components/features/app-modules/app-modules.tsx` — main modules tab component with list and empty state
  - [x] 5.2 Create `zoniq/src/components/features/app-modules/module-card.tsx` — individual module card display
  - [x] 5.3 Create `zoniq/src/components/features/app-modules/module-form.tsx` — reusable form for create/edit with React Hook Form + Zod
  - [x] 5.4 Create `zoniq/src/components/features/app-modules/module-dialog.tsx` — modal dialog for create/edit module
  - [x] 5.5 Create `zoniq/src/components/features/app-modules/delete-module-dialog.tsx` — confirmation dialog for delete
  - [x] 5.6 Write tests `zoniq/src/components/features/app-modules/app-modules.test.tsx`

- [x] Task 6: Integrate modules tab in App Detail page (AC: #1, #3)
  - [x] 6.1 Update `zoniq/src/components/features/app-detail/app-detail.tsx` to render AppModules component for the "modules" tab
  - [x] 6.2 Write/update test `zoniq/src/components/features/app-detail/app-detail.test.tsx` to verify modules tab renders

- [x] Task 7: Run full test suite and fix any regressions
  - [x] 7.1 Run `npx vitest run` and ensure all tests pass (0 regressions)
  - [x] 7.2 Run `npx next lint` and fix any lint errors

## Dev Notes

### Architecture Patterns (MUST FOLLOW)

- **No database** — use in-memory mock data pattern (same as `src/lib/environments/mock-data.ts`, `src/lib/apps/mock-data.ts`)
- **API pattern:** Clerk auth check → Zod validation → response format `{ data: T }` for success, `{ error: { code, message } }` for errors
- **HTTP status codes:** 200 (success), 201 (created), 400 (validation), 401 (unauth), 404 (not found)
- **Component pattern:** shadcn/ui components, Tailwind CSS, TanStack Query for data fetching
- **Soft-delete:** Module has `isDeleted` boolean field. Delete sets `isDeleted = true`. List queries filter out deleted modules.
- **Query key pattern:** `['modules', appId]` for list queries

### Module Data Model

```typescript
interface Module {
  id: string
  appId: string
  name: string
  description: string | null
  featuresCount: number       // Count of linked features (always 0 for now, future story 2-6)
  isDeleted: boolean          // Soft-delete flag
  createdAt: string           // ISO 8601
  updatedAt: string           // ISO 8601
}
```

### Design Tokens

- **App accent:** `#2563EB` (blue) — modules are sub-entities of apps, use same theming
- **Card background:** `#F5F2EF` (warm gray)
- **Border:** `#E8E4E0`
- **Focus ring:** `#FF6B35` (orange)
- **Primary action button:** `#FF6B35` fill, white text
- **Secondary button:** `#2D1810` outline
- **Destructive button:** `#EF4444` (red), requires confirmation dialog
- **Empty state text:** `#9A948D`
- **Font:** Manrope (already configured globally)

### UX Requirements

- **Modal-based creation:** "Add Module" button opens a centered dialog (max-width 480px)
- **Form layout:** Single-column, labels above inputs, required fields marked with asterisk
- **Validation:** Real-time on blur, red border + error message for errors
- **Module list:** Card-based layout showing module name, description (truncated), features count
- **Empty state:** "No modules yet" with prompt to add first module
- **Delete confirmation:** Red confirm button, modal requires explicit confirmation
- **Toast notifications:** Success on create/edit/delete using Sonner
- **Immediate UI updates:** Invalidate TanStack Query cache after mutations

### Project Structure Notes

New files follow the exact same structure as existing environments CRUD:
```
zoniq/src/
├── types/module.ts                                    # Type + Zod schemas
├── lib/modules/mock-data.ts                           # In-memory CRUD
├── app/api/apps/[id]/modules/
│   ├── route.ts                                       # GET list, POST create
│   └── [moduleId]/route.ts                            # GET, PUT, DELETE
├── hooks/use-modules.ts                               # TanStack Query hooks
└── components/features/app-modules/
    ├── app-modules.tsx                                # Main tab component
    ├── module-card.tsx                                # Card display
    ├── module-form.tsx                                # Form (create/edit)
    ├── module-dialog.tsx                              # Create/Edit modal
    └── delete-module-dialog.tsx                       # Delete confirmation
```

Modified files:
- `zoniq/src/components/features/app-detail/app-detail.tsx` — import and render AppModules for modules tab

### Testing Approach

- **Framework:** Vitest + React Testing Library
- **Mock Clerk auth:** `vi.mock('@clerk/nextjs/server')` returning `{ auth: () => Promise.resolve({ userId: 'user-1' }) }`
- **Use `renderWithProviders`** helper wrapping `QueryClientProvider` (if it exists; otherwise create inline wrapper)
- **Red-green-refactor:** Write failing tests first, then implement
- **Pattern:** Follow existing tests in `route.test.ts` and `app-detail.test.tsx`

### Previous Story Intelligence (from 2-4)

- All 7 tasks completed with red-green-refactor approach
- 52 new tests added in story 2-4
- Full test suite: 314 tests pass across 41 files, 0 regressions
- Lint: 0 errors introduced
- Build: pre-existing Google Fonts network issue (not code-related, ignore)
- Agent model: Claude Opus 4.6

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.5]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md — Tech Stack, API Patterns, Naming Conventions]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md — Forms, Modals, Card Patterns]
- [Source: zoniq/src/types/environment.ts — Type definition pattern]
- [Source: zoniq/src/lib/environments/mock-data.ts — Mock data CRUD pattern]
- [Source: zoniq/src/hooks/use-environments.ts — TanStack Query hook pattern]
- [Source: zoniq/src/app/api/apps/[id]/environments/route.ts — API route pattern]
- [Source: zoniq/src/components/features/app-detail/app-detail.tsx — Tab integration pattern]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- All 7 tasks completed with red-green-refactor approach
- 81 new tests added (16 type schema, 21 mock data, 27 API route, 7 hook, 10 component)
- Full test suite: 395 tests pass across 47 files, 0 regressions
- Lint: 0 errors on new code (2 pre-existing warnings in other files)
- Module CRUD fully implemented: types, mock data, API routes, hooks, UI components
- App detail page updated with Modules tab rendering AppModules component
- Soft-delete pattern implemented for module deletion
- Modal-based create/edit with React Hook Form + Zod validation
- Delete confirmation dialog with destructive styling

### File List

New files:
- zoniq/src/types/module.ts
- zoniq/src/types/module.test.ts
- zoniq/src/lib/modules/mock-data.ts
- zoniq/src/lib/modules/mock-data.test.ts
- zoniq/src/app/api/apps/[id]/modules/route.ts
- zoniq/src/app/api/apps/[id]/modules/route.test.ts
- zoniq/src/app/api/apps/[id]/modules/[moduleId]/route.ts
- zoniq/src/app/api/apps/[id]/modules/[moduleId]/route.test.ts
- zoniq/src/hooks/use-modules.ts
- zoniq/src/hooks/use-modules.test.ts
- zoniq/src/components/features/app-modules/app-modules.tsx
- zoniq/src/components/features/app-modules/app-modules.test.tsx
- zoniq/src/components/features/app-modules/module-card.tsx
- zoniq/src/components/features/app-modules/module-form.tsx
- zoniq/src/components/features/app-modules/module-dialog.tsx
- zoniq/src/components/features/app-modules/delete-module-dialog.tsx

Modified files:
- zoniq/src/components/features/app-detail/app-detail.tsx
- zoniq/src/components/features/app-detail/app-detail.test.tsx
