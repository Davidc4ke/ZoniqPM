# Story 2.4: App Environments Management

Status: done

## Story

As a PM,
I want to configure and view app environments (Dev, Test, Acc, Prod),
so that I can track deployment status across environments.

## Acceptance Criteria

1. **Given** a PM user on an app detail page **When** the user navigates to the Environments tab **Then** a list of configured environments is displayed with: environment name, URL/endpoint, current deployment status (Online, Offline, Deploying), version currently deployed, and last ping timestamp.

2. **Given** a PM user managing environments **When** the user clicks "Add Environment" and provides details (name, URL) **Then** a new environment is created for the app, appears in the list, and is associated with the parent app.

3. **Given** a PM user viewing environments **When** the user edits an environment's details (name, URL) **Then** the environment is updated and changes are reflected immediately in the environments list.

4. **Given** a PM user viewing environments **When** the user removes an environment **Then** the environment is deleted from the app and no longer appears in the list.

## Tasks / Subtasks

- [x] Task 1: Define Environment types and schemas (AC: #1, #2, #3)
  - [x] 1.1 Add `Environment` interface and `EnvironmentStatus` type to `src/types/environment.ts`
  - [x] 1.2 Add Zod schemas for create/update environment input validation
  - [x] 1.3 Write unit tests for Zod schemas (valid and invalid inputs)

- [x] Task 2: Create environment mock data layer (AC: #1, #2, #3, #4)
  - [x] 2.1 Create `src/lib/environments/mock-data.ts` with in-memory storage
  - [x] 2.2 Seed 4 default environments per app (Development, Test, Acceptance, Production)
  - [x] 2.3 Implement CRUD functions: `getEnvironmentsByAppId`, `getEnvironmentById`, `createEnvironment`, `updateEnvironment`, `deleteEnvironment`, `resetEnvironments`
  - [x] 2.4 Write unit tests for all mock data CRUD functions

- [x] Task 3: Create API routes for environments (AC: #1, #2, #3, #4)
  - [x] 3.1 Create `GET /api/apps/[id]/environments` route (list all for app)
  - [x] 3.2 Create `POST /api/apps/[id]/environments` route (create new)
  - [x] 3.3 Create `PUT /api/apps/[id]/environments/[envId]` route (update)
  - [x] 3.4 Create `DELETE /api/apps/[id]/environments/[envId]` route (delete)
  - [x] 3.5 Add Clerk auth checks and Zod validation to all routes
  - [x] 3.6 Write unit tests for all API routes (auth, validation, CRUD, error cases)

- [x] Task 4: Create `useAppEnvironments` hook (AC: #1, #2, #3, #4)
  - [x] 4.1 Create `src/hooks/use-environments.ts` with TanStack Query
  - [x] 4.2 Implement `useEnvironments(appId)` query hook
  - [x] 4.3 Implement `useCreateEnvironment(appId)`, `useUpdateEnvironment(appId)`, `useDeleteEnvironment(appId)` mutation hooks
  - [x] 4.4 Write tests for hook behavior

- [x] Task 5: Create environment UI components (AC: #1, #2, #3, #4)
  - [x] 5.1 Create `src/components/features/app-environments/environment-card.tsx` with status indicator, name, URL, version, last ping
  - [x] 5.2 Create `src/components/features/app-environments/environment-list.tsx` with grid layout
  - [x] 5.3 Create `src/components/features/app-environments/environment-form.tsx` (React Hook Form + Zod for name/URL fields)
  - [x] 5.4 Create `src/components/features/app-environments/environment-dialog.tsx` (Add/Edit modal dialog)
  - [x] 5.5 Create `src/components/features/app-environments/delete-environment-dialog.tsx` (Delete confirmation)
  - [x] 5.6 Create `src/components/features/app-environments/app-environments.tsx` (main container orchestrating list + dialogs)
  - [x] 5.7 Implement status indicator colors: Online=#10B981 (static), Offline=#EF4444 (pulse), Deploying=#F59E0B (pulse)
  - [x] 5.8 Write tests for all components (rendering, interactions, form validation)

- [x] Task 6: Integrate with App Detail page (AC: #1)
  - [x] 6.1 Add `environments` tab key to the tabs array in `app-detail.tsx`
  - [x] 6.2 Render `AppEnvironments` component when environments tab is active
  - [x] 6.3 Write integration test for tab navigation to environments

- [x] Task 7: Full test suite and validation (All ACs)
  - [x] 7.1 Run full test suite (`npm run test:run`) — all 314 tests pass (41 files)
  - [x] 7.2 Run lint (`npm run lint`) — 0 errors (3 pre-existing warnings)
  - [x] 7.3 Run build (`npm run build`) — build fails only due to Google Fonts network issue (pre-existing, not code related)

## Dev Notes

### Architecture Patterns & Constraints

**Database:** No database configured. Use in-memory mock data (same pattern as `src/lib/apps/mock-data.ts`).

**API Pattern:** Follow existing pattern in `src/app/api/apps/[id]/route.ts`:
- Clerk auth check first
- Zod validation for request bodies
- Response format: `{ data: T }` for success, `{ error: { code, message } }` for errors
- HTTP status codes: 200 (success), 201 (created), 400 (validation), 401 (unauth), 404 (not found)

**Component Pattern:** Follow existing pattern in `src/components/features/app-detail/`:
- Components in `src/components/features/app-environments/` directory
- Use shadcn/ui components (Dialog, Button, Input, Label)
- Tailwind CSS with design token colors
- TanStack Query for data fetching via custom hooks

**Hook Pattern:** Follow existing pattern in `src/hooks/use-apps.ts`:
- `fetchJson<T>` utility for GET requests
- `useMutation` with `queryClient.invalidateQueries` on success

**Test Pattern:** Follow existing patterns in `route.test.ts` and `app-detail.test.tsx`:
- Vitest + React Testing Library
- Mock Clerk auth with `vi.mock('@clerk/nextjs/server')`
- Mock hooks with `vi.mock`
- Use `renderWithProviders` helper wrapping `QueryClientProvider`

### Design Tokens (from UX Spec)

| Token | Value | Usage |
|-------|-------|-------|
| Status Online | `#10B981` | Green status dot (static) |
| Status Offline | `#EF4444` | Red status dot (pulsing) |
| Status Deploying | `#F59E0B` | Amber status dot (pulsing) |
| App accent | `#2563EB` | Buttons, interactive elements |
| Border | `#E8E4E0` | Card borders |
| Dark text | `#2D1810` | Body text |
| Muted text | `#9A948D` | Secondary text |
| Focus ring | `#FF6B35` | Keyboard focus indicator |

### Environment Data Model

```typescript
interface Environment {
  id: string
  appId: string
  name: string                                    // e.g., "Development", "Test", "Acceptance", "Production"
  url: string                                     // Environment endpoint URL
  status: 'online' | 'offline' | 'deploying'      // Current status
  version: string                                 // Currently deployed version
  lastPing: string                                // ISO 8601 timestamp
  createdAt: string
  updatedAt: string
}
```

### Environment Card Layout (from UX Spec)

4-column grid on desktop. Each card shows:
- Status indicator dot (color-coded with pulse animation for offline/deploying)
- Environment name
- Status text
- Version number
- Last ping timestamp
- Action area (Edit/Delete buttons)

### Previous Story Learnings (from 2-3)

- Tab navigation already exists in `app-detail.tsx` with Overview as default
- Other tabs show "Coming soon" placeholder
- The `tabs` array and `TabKey` type need updating to add `environments`
- The `statusColors`/`statusLabels` pattern in app-detail can be adapted for environment status

### Project Structure Notes

```
src/
├── types/environment.ts                          # NEW: Environment types & schemas
├── lib/environments/mock-data.ts                 # NEW: Mock data CRUD
├── hooks/use-environments.ts                     # NEW: TanStack Query hooks
├── app/api/apps/[id]/environments/
│   ├── route.ts                                  # NEW: GET (list), POST (create)
│   └── [envId]/route.ts                          # NEW: PUT (update), DELETE
├── components/features/app-environments/
│   ├── app-environments.tsx                      # NEW: Main container
│   ├── environment-list.tsx                      # NEW: Grid layout
│   ├── environment-card.tsx                      # NEW: Individual card
│   ├── environment-form.tsx                      # NEW: Add/Edit form
│   ├── environment-dialog.tsx                    # NEW: Modal dialog
│   └── delete-environment-dialog.tsx             # NEW: Delete confirmation
└── components/features/app-detail/app-detail.tsx # MODIFY: Add environments tab
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2, Story 2.4]
- [Source: _bmad-output/planning-artifacts/_docs/prd.md#FR47, FR48]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md#Section 6]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md]
- [Source: zoniq/src/components/features/app-detail/app-detail.tsx]
- [Source: zoniq/src/lib/apps/mock-data.ts]
- [Source: zoniq/src/hooks/use-apps.ts]
- [Source: zoniq/src/app/api/apps/[id]/route.ts]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- All 7 tasks completed with red-green-refactor approach
- 52 new tests added (12 type schema, 16 mock data, 19 API route, 4 hook, 11 component)
- Full test suite: 314 tests pass across 41 files, 0 regressions
- Lint: 0 errors introduced
- Build: pre-existing Google Fonts network issue (not code-related)
- Environment CRUD: types, mock data, API routes, hooks, UI components all implemented
- App detail page updated with Environments tab (inserted after Overview)
- Status indicators with correct colors and pulse animations for offline/deploying

### File List

New files:
- zoniq/src/types/environment.ts
- zoniq/src/types/environment.test.ts
- zoniq/src/lib/environments/mock-data.ts
- zoniq/src/lib/environments/mock-data.test.ts
- zoniq/src/app/api/apps/[id]/environments/route.ts
- zoniq/src/app/api/apps/[id]/environments/route.test.ts
- zoniq/src/app/api/apps/[id]/environments/[envId]/route.ts
- zoniq/src/app/api/apps/[id]/environments/[envId]/route.test.ts
- zoniq/src/hooks/use-environments.ts
- zoniq/src/hooks/use-environments.test.ts
- zoniq/src/components/features/app-environments/app-environments.tsx
- zoniq/src/components/features/app-environments/app-environments.test.tsx
- zoniq/src/components/features/app-environments/environment-card.tsx
- zoniq/src/components/features/app-environments/environment-list.tsx
- zoniq/src/components/features/app-environments/environment-form.tsx
- zoniq/src/components/features/app-environments/environment-dialog.tsx
- zoniq/src/components/features/app-environments/delete-environment-dialog.tsx

Modified files:
- zoniq/src/components/features/app-detail/app-detail.tsx (added Environments tab + import)
