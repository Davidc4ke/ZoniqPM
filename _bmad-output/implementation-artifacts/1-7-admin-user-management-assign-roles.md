# Story 1.7: Admin User Management - Assign Roles

Status: done

## Story

As an admin,
I want to assign roles (Admin, PM, Consultant) to users,
So that users have appropriate permissions. (FR4)

## Acceptance Criteria

1. **Given** an admin user viewing the user list **When** the admin selects a user and changes their role **Then** the user's role is updated in Clerk metadata **And** the change is reflected immediately in the UI **And** the user's permissions are updated on next request

2. **Given** an admin assigning roles **When** the admin attempts to remove the last admin role **Then** an error is displayed preventing the action **And** at least one admin must always exist in the system

## Tasks / Subtasks

- [x] Task 1: Add role edit capability to user list (AC: #1)
  - [x] Add "Edit Role" dropdown/menu to each user row in UserList component
  - [x] Show current role as selected in dropdown
  - [x] Disable role editing for pending invitations (they have no userId yet)
- [x] Task 2: Create API route for role updates (AC: #1, #2)
  - [x] Create PATCH `/api/admin/users/[id]/role` route
  - [x] Add admin role verification using existing `verifyAdmin()` pattern
  - [x] Validate role value using `ROLES` constant from `lib/constants.ts`
  - [x] Update user's `privateMetadata.roles` in Clerk
  - [x] Implement last-admin protection check
- [x] Task 3: Update UserList to handle role changes (AC: #1)
  - [x] Add `onRoleChange` callback prop to UserList
  - [x] Add loading state during role update
  - [x] Refresh user list after successful role change
  - [x] Display success/error toast notifications
- [x] Task 4: Implement last-admin protection (AC: #2)
  - [x] Count current admin users before allowing role change
  - [x] If user is last admin and changing to non-admin, block with error
  - [x] Prevent self-demotion if user is last admin
- [x] Task 5: Run validation (All ACs)
  - [x] Run `npm run lint` - must pass
  - [x] Run `npm run build` - must compile successfully
  - [x] Manual test: admin can change user role (change reflects immediately)
  - [x] Manual test: cannot remove last admin role (error displayed)
  - [x] Manual test: role change updates Clerk privateMetadata
  - [x] Manual test: pending invitations cannot have role edited

## Dev Notes

### Architecture Patterns & Constraints

**From Architecture Document - Authentication & Security:**
- Clerk 5.x for authentication
- RBAC: Clerk Organizations + custom roles
- Role mapping: Admin → org:admin, PM → org:pm, Consultant → org:member

**Role Storage (from Story 1.6 learnings):**
- Active users: Store roles in `privateMetadata.roles` (array format)
- Pending invitations: Roles stored in `publicMetadata` (Clerk limitation)
- Migration handled via Clerk webhook when user accepts invitation

### Previous Story Context (Story 1.6)

**Files Already Created:**
- `zoniq/src/app/(dashboard)/admin/layout.tsx` - Admin-only layout with role check
- `zoniq/src/app/(dashboard)/admin/users/page.tsx` - User management page
- `zoniq/src/app/api/admin/users/route.ts` - GET/POST for users
- `zoniq/src/app/api/webhooks/clerk/route.ts` - Clerk webhook for role migration
- `zoniq/src/components/admin/add-user-dialog.tsx` - Add user form
- `zoniq/src/components/admin/users-page-client.tsx` - User list client component
- `zoniq/src/lib/constants.ts` - ROLES constant: `['admin', 'pm', 'consultant']`

**Existing Patterns to Follow:**
- Use `verifyAdmin()` from route.ts for admin verification
- Use `clerkClient()` from `@clerk/nextjs/server`
- Use zod for input validation
- Use `ROLES` constant from `lib/constants.ts`
- Follow existing error response format: `{ error: "message" }`

### Current Implementation State

**Existing User Type (from users-page-client.tsx):**
```typescript
interface User {
  id: string
  emailAddress?: string
  firstName?: string
  lastName?: string
  roles?: string[]
  status: 'active' | 'pending'
  createdAt?: number
  privateMetadata?: { roles?: string[] }
  publicMetadata?: { role?: string; name?: string }
}
```

**Existing `getRole()` function (from users-page-client.tsx):**
```typescript
function getRole(user: User): string {
  if (user.privateMetadata?.roles && user.privateMetadata.roles.length > 0) {
    return user.privateMetadata.roles[0]
  }
  if (user.publicMetadata?.role) {
    return user.publicMetadata.role
  }
  return 'consultant'
}
```

### Required Changes for This Story

**1. Create Role Update API Route:**

```typescript
// zoniq/src/app/api/admin/users/[id]/role/route.ts
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ROLES } from '@/lib/constants'

const updateRoleSchema = z.object({
  roles: z.array(z.enum(ROLES as [string, ...string[]])).min(1),
})

async function verifyAdmin(userId: string) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const roles = user.privateMetadata?.roles as string[] | undefined
  if (!roles?.includes('admin')) {
    throw new Error('Unauthorized: Admin role required')
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await verifyAdmin(userId)

    const { id: targetUserId } = await params
    const body = await request.json()
    const { roles } = updateRoleSchema.parse(body)

    const client = await clerkClient()
    
    // Check for last admin protection
    const currentTargetUser = await client.users.getUser(targetUserId)
    const currentRoles = currentTargetUser.privateMetadata?.roles as string[] | undefined
    
    if (currentRoles?.includes('admin') && !roles.includes('admin')) {
      // Count remaining admins
      const usersResponse = await client.users.getUserList()
      const adminCount = usersResponse.data.filter(
        (u) => (u.privateMetadata?.roles as string[] | undefined)?.includes('admin')
      ).length
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last admin role. At least one admin must exist.' },
          { status: 400 }
        )
      }
    }

    // Update user's role
    await client.users.updateUser(targetUserId, {
      privateMetadata: {
        ...currentTargetUser.privateMetadata,
        roles,
      },
    })

    return NextResponse.json({ data: { id: targetUserId, roles } })
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}
```

**2. Update UserList Component:**

Add role editing capability to the user list:

```typescript
// In users-page-client.tsx - add RoleDropdown component
interface RoleDropdownProps {
  user: User
  onRoleChange: (userId: string, roles: string[]) => Promise<void>
  disabled?: boolean
}

function RoleDropdown({ user, onRoleChange, disabled }: RoleDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedRole, setSelectedRole] = useState(getRole(user))
  
  const handleRoleChange = async (newRole: string) => {
    if (newRole === selectedRole) return
    setIsUpdating(true)
    try {
      await onRoleChange(user.id, [newRole])
      setSelectedRole(newRole)
      toast.success('Role updated successfully')
    } catch (error) {
      toast.error('Failed to update role')
    } finally {
      setIsUpdating(false)
    }
  }

  if (user.status === 'pending') {
    return (
      <span className="text-sm text-muted-foreground">
        {getRole(user)} (pending)
      </span>
    )
  }

  return (
    <select
      value={selectedRole}
      onChange={(e) => handleRoleChange(e.target.value)}
      disabled={disabled || isUpdating}
      className="text-sm border rounded px-2 py-1"
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </option>
      ))}
    </select>
  )
}
```

**3. Add Role Update Handler to Page:**

In `users-page-client.tsx`, add the role update handler:

```typescript
const handleRoleChange = async (userId: string, roles: string[]) => {
  const response = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roles }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to update role')
  }

  // Refresh the user list
  await refreshUsers()
}
```

### Project Structure After This Story

```
zoniq/src/app/api/admin/users/
├── route.ts                    # GET/POST users (existing)
└── [id]/
    └── role/
        └── route.ts            # PATCH role (NEW)
```

### Role Definitions

| Role | Clerk Metadata | Permissions |
|------|----------------|-------------|
| Admin | `org:admin` / `roles: ['admin']` | Full system access, user management |
| PM | `org:pm` / `roles: ['pm']` | Project management, create/edit projects |
| Consultant | `org:member` / `roles: ['consultant']` | View and update assigned stories |

### Testing Standards

- Run `npm run lint` - must pass with 0 errors
- Run `npm run build` - must compile successfully
- Manual testing checklist:
  1. Log in as admin user
  2. Navigate to /admin/users
  3. Change a user's role via dropdown
  4. Verify role updates immediately in UI
  5. Verify role persisted in Clerk (check dashboard)
  6. Attempt to remove last admin - should show error
  7. Verify pending invitations show role as non-editable
  8. Log in as changed user - verify permissions updated

### References

- [Clerk User Update API](https://clerk.com/docs/reference/backend-api/tag/Users#operation/patchUser)
- [Clerk Private Metadata](https://clerk.com/docs/users/metadata)
- [Architecture Document](_bmad-output/planning-artifacts/_docs/architecture.md)
- [Previous Story: 1-6-admin-user-management-create-users](1-6-admin-user-management-create-users.md)
- [Epics File](_bmad-output/planning-artifacts/epics.md) - Story 1.6

## Dev Agent Record

### Agent Model Used

Claude Code (claude-5)

### Debug Log References

N/A

### Completion Notes List

- ✅ Created PATCH `/api/admin/users/[id]/role` route with admin verification, zod validation, and last-admin protection
- ✅ Updated `users-page-client.tsx` with `RoleDropdown` component for inline role editing
- ✅ Pending invitations display role as non-editable with "(pending)" label
- ✅ Last-admin protection prevents removing the only admin role from the system
- ✅ Role changes trigger immediate UI refresh via `refreshUsers()` callback
- ✅ Error messages display inline below the dropdown for 3 seconds
- ✅ Loading state shows "Updating..." text during API call
- ✅ All lint and build checks pass

### Code Review Fixes Applied

- ✅ Extracted `AdminUser` interface and `getUserRoles()` function to shared `lib/constants.ts`
- ✅ Removed duplicate `User` interface definitions from both components
- ✅ Removed duplicate `UserListProps` interface (dead code)
- ✅ Added banned user check in API route (cannot change roles for banned users)
- ✅ Implemented pagination for admin count query (handles large orgs)
- ✅ Added optimistic UI update with rollback on error
- ✅ Fixed `&middot;` HTML entity to proper Unicode `\u00b7`
- ✅ Added missing file to File List: `edit-role-dialog.tsx`

### File List

- `zoniq/src/lib/constants.ts` (MODIFIED) - Added shared `AdminUser` interface and `getUserRoles()` function
- `zoniq/src/app/api/admin/users/[id]/role/route.ts` (NEW) - API route for role updates with banned user check and paginated admin count
- `zoniq/src/components/admin/users-page-client.tsx` (MODIFIED) - Added RoleDisplay, optimistic updates, uses shared types
- `zoniq/src/components/admin/edit-role-dialog.tsx` (NEW) - Modal dialog for editing user roles
