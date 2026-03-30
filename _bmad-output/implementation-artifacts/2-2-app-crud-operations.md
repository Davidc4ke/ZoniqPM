# Story 2.2: App CRUD Operations

Status: done

## Story

As a PM,
I want to create, view, edit, and delete apps linked to customers,
So that I can track Mendix applications per client. (FR8, FR43-FR48)

## Acceptance Criteria

1. **Given** a PM user on a customer detail page **When** the user clicks "Add App" and fills in required details (name, description, Mendix App ID) **Then** a new app record is created and linked to the customer **And** the app appears in the customer's app list.

2. **Given** a user viewing the apps list **When** the user clicks on an app **Then** the app detail page is displayed with overview tab active **And** app details include name, description, version, status, Mendix App ID.

3. **Given** a PM user viewing an app **When** the user edits app details (name, description, version, status) and saves **Then** the app record is updated **And** changes are reflected immediately.

4. **Given** a PM user viewing an app with no linked projects **When** the user deletes the app **Then** the app is soft-deleted from the database **And** the app no longer appears in the customer's app list.

5. **Given** a PM user attempting to delete an app with linked projects **When** the user clicks delete **Then** an error is displayed preventing deletion **And** the user is informed that projects must be removed first.

## Tasks / Subtasks

- [x] Task 1: Create app types and validation schemas (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Create `src/types/app.ts` with App, CreateAppInput, UpdateAppInput types
  - [x] 1.2 Create Zod validation schemas for create and update operations
  - [x] 1.3 Write unit tests for validation schemas (valid input, missing required fields, edge cases)

- [x] Task 2: Create app mock data service (AC: #1, #2, #3, #4, #5)
  - [x] 2.1 Create `src/lib/apps/mock-data.ts` with in-memory app store and CRUD functions
  - [x] 2.2 Include seed data with 3-4 sample apps linked to existing customer IDs (matching customer mock data)
  - [x] 2.3 Implement `linkedProjectsCount` for delete protection (same pattern as customer's linkedAppsCount)
  - [x] 2.4 Write unit tests for mock data CRUD functions (create, read, update, soft-delete, list, filter by customer)

- [x] Task 3: Create app API routes (AC: #1, #2, #3, #4, #5)
  - [x] 3.1 Create `src/app/api/apps/route.ts` — GET (list all non-deleted, support ?customerId filter) and POST (create with Zod validation, requires customerId)
  - [x] 3.2 Create `src/app/api/apps/[id]/route.ts` — GET (detail), PUT (update), DELETE (soft-delete with linked-project check)
  - [x] 3.3 Write unit tests for all API routes (auth check, validation, CRUD operations, error cases, customerId filtering)

- [x] Task 4: Create useApps hooks (AC: #1, #2, #3, #4, #5)
  - [x] 4.1 Create `src/hooks/use-apps.ts` with hooks: `useApps(customerId?)`, `useApp(id)`, `useCreateApp()`, `useUpdateApp(id)`, `useDeleteApp()`
  - [x] 4.2 Write unit tests for hooks (loading states, mutations, cache invalidation, customerId filtering)

- [x] Task 5: Update customer detail page with linked apps list (AC: #1, #2)
  - [x] 5.1 Create `src/components/features/app-list/app-list.tsx` — app list component with blue theme cards, shows on customer detail page
  - [x] 5.2 Create `src/components/features/app-list/add-app-dialog.tsx` — modal form for creating apps (name, description, mendixAppId required, customerId passed as prop)
  - [x] 5.3 Update `src/components/features/customer-detail/customer-detail.tsx` to render AppList for linked apps section
  - [x] 5.4 Write unit tests for app list component (renders apps, add dialog opens, empty state)

- [x] Task 6: Create app detail page (AC: #2, #3, #4, #5)
  - [x] 6.1 Create `src/app/(dashboard)/apps/[id]/page.tsx` — app detail page (server component)
  - [x] 6.2 Create `src/app/(dashboard)/apps/[id]/app-detail-client.tsx` — client wrapper
  - [x] 6.3 Create `src/components/features/app-detail/app-detail.tsx` — detail view with edit/delete, blue theme header, overview tab showing name, description, version, status, Mendix App ID, linked customer
  - [x] 6.4 Create `src/components/features/app-detail/edit-app-dialog.tsx` — modal form for editing (name, description, version, status)
  - [x] 6.5 Create `src/components/features/app-detail/delete-app-dialog.tsx` — confirmation dialog with linked-project check
  - [x] 6.6 Write unit tests for app detail (renders info, edit saves, delete with/without linked projects)

- [x] Task 7: Update customer mock data to track real linked apps count (AC: #1, #4)
  - [x] 7.1 Update customer mock-data to derive linkedAppsCount from actual app records instead of hardcoded values
  - [x] 7.2 Update customer delete logic to check real app records
  - [x] 7.3 Update existing customer tests if impacted

- [x] Task 8: Run full test suite and validation (All ACs)
  - [x] 8.1 Run full test suite (`npm run test:run`) — all tests must pass (242/242)
  - [x] 8.2 Run lint (`npm run lint`) — no new errors in app files (pre-existing any issues in other test files)
  - [x] 8.3 Run build (`npm run build`) — pre-existing Google Fonts network error in offline env, no code errors

## Dev Notes

### Architecture Patterns & Constraints

**Database:** No database is configured yet. Implement with in-memory mock data store (same pattern as `src/lib/customers/mock-data.ts`). Add TODO comments for Drizzle ORM migration.

**API Response Format:**
- Success: `{ data: T }` or `{ data: T[], meta: { total: N } }`
- Error: `{ error: { code: 'ERROR_CODE', message: 'User-friendly message' } }`

**Auth:** All API routes must check auth via `auth()` from `@clerk/nextjs/server`. Return 401 if not authenticated.

**Soft Delete:** Use `isDeleted` boolean field. List queries exclude deleted records. Cannot delete if `linkedProjectsCount > 0`.

**App Status Values:** Use string union type: `'active' | 'inactive' | 'in-development'`

### Design Tokens (App theme - Blue)
- App accent: `#2563EB`
- App card bg: `#EFF6FF`
- App page header bg: `#DBEAFE`
- Standard borders: `#E8E4E0`
- Dark text: `#2D1810`
- Primary action: `#FF6B35`
- Status badges: Active=green, Inactive=gray, In Development=blue

### Route Structure
- `/apps/[id]` — App detail page
- Customer detail page at `/masterdata/customers/[id]` shows linked apps list

### Component Patterns (replicate from customer CRUD)
- Follow existing customer dialog patterns (add-customer-dialog.tsx, edit-customer-dialog.tsx, delete-customer-dialog.tsx)
- Use sonner for toast notifications
- Use useState for form handling (not react-hook-form, matching existing customer patterns)
- Loading states with skeleton components
- Card links with hover effects and chevron icon

### App Interface Fields
```typescript
interface App {
  id: string
  name: string
  description: string | null
  customerId: string
  customerName: string      // Denormalized for display
  mendixAppId: string       // Mendix platform App ID
  version: string           // e.g., "1.0.0"
  status: 'active' | 'inactive' | 'in-development'
  organizationId: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  linkedProjectsCount: number
}
```

### Customer Detail Integration
The existing customer detail page (`customer-detail.tsx`) has a TODO placeholder for linked apps at line 122-130. Replace this with the actual AppList component that:
- Fetches apps filtered by `customerId`
- Shows app cards with blue theme
- Includes "Add App" button
- Links each app to `/apps/{id}`

### Previous Story Intelligence (2-1-customer-crud-operations)
- Mock data pattern: in-memory array with filter/find functions, nextId counter, resetFunction for tests
- API route params pattern: `{ params }: { params: Promise<{ id: string }> }` (Next.js 16 async params)
- Hook pattern: TanStack React Query with `fetchJson<T>()` helper
- Dialog pattern: useState-based forms, no react-hook-form, Escape key handling, isPending guards
- Test setup mocks `@clerk/nextjs/server` auth in `src/test/setup.ts`
- Customer cards use green theme (#10B981), apps should use blue theme (#2563EB)

### Project Structure Notes

New files to create:
- `src/types/app.ts`
- `src/lib/apps/mock-data.ts`
- `src/lib/apps/mock-data.test.ts`
- `src/app/api/apps/route.ts`
- `src/app/api/apps/[id]/route.ts`
- `src/hooks/use-apps.ts`
- `src/hooks/use-apps.test.ts`
- `src/components/features/app-list/app-list.tsx`
- `src/components/features/app-list/add-app-dialog.tsx`
- `src/app/(dashboard)/apps/[id]/page.tsx`
- `src/app/(dashboard)/apps/[id]/app-detail-client.tsx`
- `src/components/features/app-detail/app-detail.tsx`
- `src/components/features/app-detail/edit-app-dialog.tsx`
- `src/components/features/app-detail/delete-app-dialog.tsx`

Files to modify:
- `src/components/features/customer-detail/customer-detail.tsx` (add linked apps section)
- `src/lib/customers/mock-data.ts` (derive linkedAppsCount from real app data)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2: App CRUD Operations]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#Implementation Patterns]
- [Source: _bmad-output/implementation-artifacts/2-1-customer-crud-operations.md]
- [Source: zoniq/src/types/customer.ts] — Type pattern reference
- [Source: zoniq/src/lib/customers/mock-data.ts] — Mock data pattern reference
- [Source: zoniq/src/app/api/customers/route.ts] — API route pattern reference
- [Source: zoniq/src/hooks/use-customers.ts] — Hook pattern reference
- [Source: zoniq/src/components/features/customer-list/] — Component pattern reference
- [Source: zoniq/src/components/features/customer-detail/] — Detail page pattern reference

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (autonomous build agent)

### Debug Log References

### Completion Notes List

- Implemented full App CRUD stack following customer CRUD patterns
- Types: App interface with AppStatus union, Zod create/update schemas
- Mock data: 5 seed apps linked to customers 1 and 2, with CRUD functions and linkedProjectsCount protection
- API routes: GET (with ?customerId filter), POST, PUT, DELETE with auth, validation, and error handling
- Hooks: useApps(customerId?), useApp(id), useCreateApp, useUpdateApp, useDeleteApp using TanStack Query
- App list: Blue-themed cards with status badges, integrated into customer detail page replacing TODO placeholder
- App detail: Full detail page at /apps/[id] with edit dialog (name, description, version, status), delete dialog with linked-project protection
- Customer mock data refactored: linkedAppsCount now derived dynamically from actual app records
- All 242 tests pass (68 new tests added), zero regressions
- Build fails only due to pre-existing Google Fonts network issue in offline environment

### File List

New files:
- zoniq/src/types/app.ts
- zoniq/src/types/app.test.ts
- zoniq/src/lib/apps/mock-data.ts
- zoniq/src/lib/apps/mock-data.test.ts
- zoniq/src/app/api/apps/route.ts
- zoniq/src/app/api/apps/route.test.ts
- zoniq/src/app/api/apps/[id]/route.ts
- zoniq/src/app/api/apps/[id]/route.test.ts
- zoniq/src/hooks/use-apps.ts
- zoniq/src/hooks/use-apps.test.ts
- zoniq/src/components/features/app-list/app-list.tsx
- zoniq/src/components/features/app-list/add-app-dialog.tsx
- zoniq/src/components/features/app-list/app-list.test.tsx
- zoniq/src/app/(dashboard)/apps/[id]/page.tsx
- zoniq/src/app/(dashboard)/apps/[id]/app-detail-client.tsx
- zoniq/src/components/features/app-detail/app-detail.tsx
- zoniq/src/components/features/app-detail/edit-app-dialog.tsx
- zoniq/src/components/features/app-detail/delete-app-dialog.tsx
- zoniq/src/components/features/app-detail/app-detail.test.tsx

Modified files:
- zoniq/src/components/features/customer-detail/customer-detail.tsx (added AppList integration)
- zoniq/src/lib/customers/mock-data.ts (derived linkedAppsCount from real app data)
- zoniq/src/lib/customers/mock-data.test.ts (added resetApps in beforeEach)
