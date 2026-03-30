# Story 2.1: Customer CRUD Operations

Status: done

## Story

As a PM,
I want to create, view, edit, and delete customers,
So that I can organize apps by client organization. (FR7)

## Acceptance Criteria

1. **Given** a PM user on the masterdata page **When** the user clicks "Add Customer" and fills in required details (name, description) **Then** a new customer record is created **And** the customer appears in the customer list **And** the customer is assigned to the current user's organization.

2. **Given** a user viewing the customer list **When** the user clicks on a customer **Then** the customer detail page is displayed with all customer information **And** linked apps are shown.

3. **Given** a PM user viewing a customer **When** the user edits customer details and saves **Then** the customer record is updated **And** changes are reflected immediately.

4. **Given** a PM user viewing a customer with no linked apps **When** the user deletes the customer **Then** the customer is soft-deleted from the database **And** the customer no longer appears in the list.

5. **Given** a PM user attempting to delete a customer with linked apps **When** the user clicks delete **Then** an error is displayed preventing deletion **And** the user is informed that apps must be removed first.

## Tasks / Subtasks

- [x] Task 1: Create customer types and validation schemas (AC: #1, #2, #3, #4, #5)
  - [x]1.1 Create `src/types/customer.ts` with Customer, CreateCustomerInput, UpdateCustomerInput types
  - [x]1.2 Create Zod validation schemas for create and update operations
  - [x]1.3 Write unit tests for validation schemas (valid input, missing required fields, edge cases)

- [x] Task 2: Create customer mock data service (AC: #1, #2, #3, #4, #5)
  - [x]2.1 Create `src/lib/customers/mock-data.ts` with in-memory customer store and CRUD functions
  - [x]2.2 Include seed data with 3-4 sample customers (some with linked apps, some without)
  - [x]2.3 Write unit tests for mock data CRUD functions (create, read, update, soft-delete, list)

- [x] Task 3: Create customer API routes (AC: #1, #2, #3, #4, #5)
  - [x]3.1 Create `src/app/api/customers/route.ts` — GET (list all non-deleted) and POST (create with Zod validation)
  - [x]3.2 Create `src/app/api/customers/[id]/route.ts` — GET (detail), PUT (update), DELETE (soft-delete with linked-app check)
  - [x]3.3 Write unit tests for all API routes (auth check, validation, CRUD operations, error cases)

- [x] Task 4: Create useCustomers hooks (AC: #1, #2, #3, #4, #5)
  - [x]4.1 Create `src/hooks/use-customers.ts` with hooks: `useCustomers()`, `useCustomer(id)`, `useCreateCustomer()`, `useUpdateCustomer()`, `useDeleteCustomer()` using TanStack Query
  - [x]4.2 Write unit tests for hooks (loading states, mutations, cache invalidation)

- [x] Task 5: Create customer list page at /masterdata (AC: #1, #2)
  - [x]5.1 Create `src/app/(dashboard)/masterdata/page.tsx` — masterdata page with customer list
  - [x]5.2 Create `src/components/features/customer-list/customer-list.tsx` — customer list with green theme cards
  - [x]5.3 Create `src/components/features/customer-list/add-customer-dialog.tsx` — modal form for creating customers
  - [x]5.4 Write unit tests for customer list component (renders customers, add dialog opens, empty state)

- [x] Task 6: Create customer detail page (AC: #2, #3, #4, #5)
  - [x]6.1 Create `src/app/(dashboard)/masterdata/customers/[id]/page.tsx` — customer detail page
  - [x]6.2 Create `src/components/features/customer-detail/customer-detail.tsx` — detail view with edit and delete actions
  - [x]6.3 Create `src/components/features/customer-detail/edit-customer-dialog.tsx` — modal form for editing
  - [x]6.4 Create `src/components/features/customer-detail/delete-customer-dialog.tsx` — confirmation dialog with linked-app check
  - [x]6.5 Write unit tests for customer detail (renders info, edit saves, delete with/without linked apps)

- [x] Task 7: Run full test suite and validation (All ACs)
  - [x]7.1 Run full test suite (`npm run test:run`) — all tests must pass
  - [x]7.2 Run lint (`npm run lint`) — must pass
  - [x]7.3 Run build (`npm run build`) — must compile

## Dev Notes

### Architecture Patterns & Constraints

**Database:** No database is configured yet. Implement with in-memory mock data store (same pattern as dashboard API routes). Add TODO comments for Drizzle ORM migration.

**API Response Format:**
- Success: `{ data: T }` or `{ data: T[], meta: { total: N } }`
- Error: `{ error: { code: 'ERROR_CODE', message: 'User-friendly message' } }`

**Auth:** All API routes must check auth via `auth()` from `@clerk/nextjs/server`. Return 401 if not authenticated.

**Soft Delete:** Use `isDeleted` boolean field. List queries exclude deleted records. Cannot delete if linked apps exist.

### Design Tokens (Customer theme - Green)
- Customer accent: `#10B981`
- Customer card bg: `#F0FDF9`
- Customer page bg: `#ECFDF5`
- Standard borders: `#E8E4E0`
- Dark text: `#2D1810`
- Primary action: `#FF6B35`

### Route Structure
- `/masterdata` — Customer list page (PM/Admin only)
- `/masterdata/customers/[id]` — Customer detail page

### Component Patterns
- Follow existing admin dialog patterns (add-user-dialog.tsx, confirm-dialog.tsx)
- Use sonner for toast notifications
- Use react-hook-form + zod for form handling
- Loading states with skeleton components
