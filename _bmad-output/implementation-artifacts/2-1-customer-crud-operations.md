# Story 2.1: Customer CRUD Operations

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a PM,
I want to create, view, edit, and delete customers,
so that I can organize apps by client organization. (FR7)

## Acceptance Criteria

1. **Create Customer** — Given a PM user on the customers page, when the user clicks "Add Customer" and fills in required details (name, description), then a new customer record is created in the database, the customer appears in the customer list, and the customer is assigned to the current user's Clerk organization.

2. **View Customer List** — Given a user viewing the customer list, when the page loads, then all customers for the organization are displayed with name, description, app count, and creation date.

3. **View Customer Detail** — Given a user clicking on a customer, then the customer detail page is displayed with all customer information and linked apps are shown.

4. **Update Customer** — Given a PM user viewing a customer, when the user edits customer details (name, description) and saves, then the customer record is updated and changes are reflected immediately.

5. **Delete Customer (No Linked Apps)** — Given a PM user viewing a customer with no linked apps, when the user deletes the customer, then the customer is soft-deleted from the database and no longer appears in the list.

6. **Delete Customer (With Linked Apps — Error)** — Given a PM user attempting to delete a customer with linked apps, when the user clicks delete, then an error is displayed preventing deletion, informing the user that apps must be removed first.

7. **Role Guard** — Only users with PM or Admin role can create, edit, or delete customers. Consultants have read-only access.

## Tasks / Subtasks

- [ ] Task 1: Set up Drizzle ORM and PostgreSQL connection (AC: all — prerequisite)
  - [ ] 1.1 Install drizzle-orm and postgres driver (already in package.json — verify)
  - [ ] 1.2 Create `src/lib/db/index.ts` — database connection using `postgres` driver
  - [ ] 1.3 Create `src/lib/db/schema.ts` — customers table schema
  - [ ] 1.4 Create `drizzle.config.ts` at project root
  - [ ] 1.5 Run `drizzle-kit generate` and `drizzle-kit push` to create migration and apply schema
  - [ ] 1.6 Add `DATABASE_URL` to `.env.local` (document in `.env.example`)

- [ ] Task 2: Create Customer API routes (AC: 1, 2, 4, 5, 6, 7)
  - [ ] 2.1 Create `src/app/api/customers/route.ts` — GET (list) and POST (create)
  - [ ] 2.2 Create `src/app/api/customers/[id]/route.ts` — GET (detail), PUT (update), DELETE (soft-delete)
  - [ ] 2.3 Add Zod validation schemas in `src/types/customers.ts`
  - [ ] 2.4 Add role-based authorization checks (PM/Admin for write ops)
  - [ ] 2.5 Implement soft-delete (set `deleted_at` timestamp, filter in queries)
  - [ ] 2.6 Implement linked-apps check before delete

- [ ] Task 3: Create Customer list page and components (AC: 2, 3)
  - [ ] 3.1 Create `src/app/(dashboard)/customers/page.tsx` — server component with customer list
  - [ ] 3.2 Create `src/components/features/customers/customer-list.tsx` — customer grid/list
  - [ ] 3.3 Create `src/components/features/customers/customer-card.tsx` — card with name, description, app count
  - [ ] 3.4 Add navigation item "Masterdata" → Customers in topbar (PM/Admin only)

- [ ] Task 4: Create Customer form and dialogs (AC: 1, 4)
  - [ ] 4.1 Create `src/components/features/customers/create-customer-dialog.tsx` — modal with React Hook Form + Zod
  - [ ] 4.2 Create `src/components/features/customers/edit-customer-dialog.tsx` — pre-filled edit modal
  - [ ] 4.3 Install and configure shadcn/ui Dialog, Button, Input, Label components

- [ ] Task 5: Create Customer detail page (AC: 3, 5, 6)
  - [ ] 5.1 Create `src/app/(dashboard)/customers/[id]/page.tsx` — customer detail with linked apps
  - [ ] 5.2 Create `src/components/features/customers/customer-detail.tsx` — detail view
  - [ ] 5.3 Create `src/components/features/customers/delete-customer-dialog.tsx` — confirmation with linked-apps guard

- [ ] Task 6: Testing and verification (AC: all)
  - [ ] 6.1 Add API route tests for CRUD operations
  - [ ] 6.2 Verify role-based access control
  - [ ] 6.3 Verify soft-delete and linked-apps guard
  - [ ] 6.4 Run lint, build, and existing tests to prevent regressions

## Dev Notes

### Critical: Database Setup Required First

**No database/ORM exists yet in the codebase.** Task 1 is a prerequisite for everything else. The architecture specifies:
- **Database:** PostgreSQL 16.x
- **ORM:** Drizzle ORM 0.36.x with `postgres` driver (node-postgres)
- **Migrations:** Drizzle Kit 0.28.x

Dependencies `drizzle-orm` and `drizzle-kit` are NOT yet in `package.json` — install them. The `postgres` driver package is also needed.

### Database Schema

```typescript
// src/lib/db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: varchar('organization_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('idx_customers_organization_id').on(table.organizationId),
])
```

**Naming conventions:**
- Table names: plural, snake_case (`customers`)
- Column names: snake_case in DB (`organization_id`), camelCase in TypeScript (`organizationId`)
- Primary keys: UUID v4 via `defaultRandom()`
- Soft-delete: `deleted_at` timestamp (null = active)
- All queries MUST filter `WHERE deleted_at IS NULL` by default

### API Response Format

All API responses MUST use this format:
```typescript
// Success
{ data: T, meta?: { page: number, pageSize: number, total: number } }

// Error
{ error: { code: string, message: string, details?: unknown } }
```

Error codes: `VALIDATION_ERROR`, `NOT_FOUND`, `FORBIDDEN`, `CONFLICT`

### API Routes

```
POST   /api/customers          → Create customer (PM/Admin)
GET    /api/customers          → List customers (all authenticated)
GET    /api/customers/[id]     → Get customer detail (all authenticated)
PUT    /api/customers/[id]     → Update customer (PM/Admin)
DELETE /api/customers/[id]     → Soft-delete customer (PM/Admin)
```

### Authorization Pattern

Use Clerk's `auth()` to get the current user, then check roles from `privateMetadata`:
```typescript
import { auth, clerkClient } from '@clerk/nextjs/server'

// In API route:
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })

const client = await clerkClient()
const user = await client.users.getUser(userId)
const roles = user.privateMetadata?.roles as string[] || ['consultant']
const canWrite = roles.includes('admin') || roles.includes('pm')
```

This pattern is already established in `src/lib/admin-auth.ts` — **reuse and extend** the existing `verifyAdmin()` pattern for a more generic `verifyRole()` or add a `verifyPMOrAdmin()` helper.

### Component Patterns (from Story 2.0)

- Feature components go in `src/components/features/customers/`
- Use `'use client'` directive for interactive components
- Use Tailwind CSS with project design tokens:
  - Primary orange: `#FF6B35`
  - Dark: `#2D1810`
  - Off-white background: `#FAFAF9`
  - Card background: `#F5F2EF`
  - Customer color (from UX spec): Green `#10B981` with light bg `#F0FDF9`
- Loading states: Use skeleton patterns, NOT spinners
- Forms: React Hook Form + Zod validation
- Toasts: Use Sonner (`toast.success()`, `toast.error()`)
- Typography: Manrope font (already configured in root layout)

### shadcn/ui Components Needed

The `src/components/ui/` directory is currently **empty**. You will need to install shadcn/ui components:
```bash
npx shadcn@latest add dialog button input label textarea
```

The `components.json` config already exists at project root. shadcn/ui is configured.

### Navigation Integration

The topbar already has role-based navigation in `src/components/features/topbar/topbar.tsx`. The "Masterdata" nav item exists but may not have a route yet. Wire it up:
- Route: `/customers` under the `(dashboard)` route group
- Visibility: PM and Admin roles only (already handled by topbar's role-based nav logic)

### UX Requirements

- Customer entity color: **Green** (`#10B981`) — use for customer cards, badges, indicators
- Customer cards should show: name, description (truncated), app count, created date
- Detail page shows full info + linked apps list
- Modals for create/edit (not separate pages)
- Confirmation dialog before delete with clear warning about linked apps

### Project Structure Notes

- All new files follow the established structure from Epic 1 and Story 2.0
- API routes: `src/app/api/customers/` (follows existing `/api/admin/users/` pattern)
- Pages: `src/app/(dashboard)/customers/` (follows existing `/admin/users/` pattern)
- Components: `src/components/features/customers/` (follows existing feature folder pattern)
- No conflicts with existing code detected

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.1]
- [Source: _bmad-output/planning-artifacts/_docs/architecture.md — Database Schema, API Patterns, Code Structure]
- [Source: _bmad-output/planning-artifacts/_docs/prd.md — FR7]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md — Customer Color, Navigation]
- [Source: _bmad-output/implementation-artifacts/2-0-home-page-dashboard-layout.md — Component patterns, design tokens]
- [Source: zoniq/src/lib/admin-auth.ts — Auth pattern to extend]
- [Source: zoniq/src/lib/constants.ts — Role definitions]
- [Source: zoniq/src/components/features/topbar/topbar.tsx — Navigation integration point]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
