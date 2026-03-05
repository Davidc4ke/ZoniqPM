# Story 1.9: User Profile View

Status: ready-for-dev

## Story

As a user,
I want to view my own profile information,
So that I can verify my account details. (FR6)

## Acceptance Criteria

1. **Given** an authenticated user **When** the user navigates to the profile page **Then** the user's profile information is displayed (name, email, role) **And** the user can see their assigned role and permissions summary

2. **Given** a user viewing their profile **When** the user wants to edit profile information **Then** editable fields (name) are available **And** email and role are displayed as read-only

## Tasks / Subtasks

- [ ] Task 1: Create profile page route (AC: #1)
  - [ ] Create `zoniq/src/app/(dashboard)/profile/page.tsx` 
  - [ ] Use Clerk's `useUser()` hook to get current user data
  - [ ] Display user's name, email, and role(s)

- [ ] Task 2: Create profile display component (AC: #1, #2)
  - [ ] Create `zoniq/src/components/profile/profile-view.tsx` 
  - [ ] Show profile information in card layout
  - [ ] Display role badge with appropriate styling
  - [ ] Show permissions summary based on role

- [ ] Task 3: Add profile editing capability (AC: #2)
  - [ ] Add edit mode for name fields (firstName, lastName)
  - [ ] Use Clerk's `user.update()` to save changes
  - [ ] Show email and role as read-only fields
  - [ ] Add loading state during save
  - [ ] Show success/error toast on save

- [ ] Task 4: Add navigation link to profile (AC: #1)
  - [ ] Update topbar profile dropdown to include "View Profile" link
  - [ ] Link should navigate to `/profile`

- [ ] Task 5: Run validation (All ACs)
  - [ ] Run `npm run lint` - must pass
  - [ ] Run `npm run build` - must compile successfully
  - [ ] Manual test: authenticated user can view profile page
  - [ ] Manual test: user can see their name, email, and role
  - [ ] Manual test: user can edit their name
  - [ ] Manual test: email and role are read-only

## Dev Notes

### Architecture Patterns & Constraints

**From Architecture Document - Authentication & Security:**
- Clerk 5.x for authentication
- Session management handled by Clerk
- RBAC: Clerk Organizations + custom roles (Admin, PM, Consultant)

**Profile Data Source:**
- Use Clerk's `useUser()` hook for client-side user data
- Role information from `user.publicMetadata.role` or `user.privateMetadata.roles`

### Previous Story Context (Story 1.8)

**Existing Files & Patterns:**
- `zoniq/src/lib/constants.ts` - ROLES constant, getUserRoles() function
- `zoniq/src/lib/admin-auth.ts` - verifyAdmin() pattern
- `zoniq/src/components/admin/` - Admin component patterns
- Topbar component in `zoniq/src/components/features/topbar/`

**Existing AdminUser Type (from lib/constants.ts):**
```typescript
export interface AdminUser {
  id: string
  emailAddress?: string
  firstName?: string
  lastName?: string
  roles?: string[]
  status: 'active' | 'pending' | 'inactive'
  banned?: boolean
  createdAt?: number
  privateMetadata?: { roles?: string[] }
  publicMetadata?: { role?: string; name?: string }
}
```

### Required Implementation

**1. Profile Page Route:**

```typescript
// zoniq/src/app/(dashboard)/profile/page.tsx
import { useUser } from '@clerk/nextjs'
import { ProfileView } from '@/components/profile/profile-view'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return <ProfileSkeleton />
  }
  
  if (!user) {
    return <div>Not authenticated</div>
  }
  
  return <ProfileView user={user} />
}
```

**2. Profile View Component:**

```typescript
// zoniq/src/components/profile/profile-view.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ROLES } from '@/lib/constants'

interface ProfileViewProps {
  user: ReturnType<typeof useUser>['user']
}

export function ProfileView({ user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [isSaving, setIsSaving] = useState(false)
  
  // Get roles from metadata
  const roles = user?.publicMetadata?.roles as string[] || 
                user?.privateMetadata?.roles as string[] || []
  
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await user?.update({
        firstName,
        lastName,
      })
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }
  
  // ... rest of component
}
```

**3. Role Badge Styling:**

| Role | Badge Style |
|------|-------------|
| Admin | Orange/Primary |
| PM | Blue |
| Consultant | Gray/Neutral |

**4. Permissions Summary by Role:**

| Role | Permissions |
|------|-------------|
| Admin | Full system access, user management, all projects |
| PM | Create/manage customers, apps, projects, stories |
| Consultant | View assigned projects, update assigned stories |

### Project Structure After This Story

```
zoniq/src/
├── app/(dashboard)/
│   └── profile/
│       └── page.tsx                 # Profile page (NEW)
├── components/
│   ├── profile/
│   │   └── profile-view.tsx         # Profile display component (NEW)
│   └── features/
│       └── topbar/
│           └── profile-dropdown.tsx # MODIFIED - add profile link
└── lib/
    └── constants.ts                 # Existing - ROLES constant
```

### Clerk API Reference

| Action | Method | Notes |
|--------|--------|-------|
| Get current user | `useUser()` hook | Client-side hook |
| Update user | `user.update({ firstName, lastName })` | Updates Clerk user |
| Email | `user.emailAddresses[0].emailAddress` | Read-only |
| Metadata | `user.publicMetadata` / `user.privateMetadata` | Contains roles |

### Testing Standards

- Run `npm run lint` - must pass with 0 errors
- Run `npm run build` - must compile successfully
- Manual testing checklist:
  1. Log in as any user
  2. Click profile dropdown → "View Profile"
  3. Verify profile page displays name, email, role
  4. Click "Edit" button
  5. Modify first name
  6. Save changes
  7. Verify success toast and updated name
  8. Verify email field is read-only
  9. Verify role badge is displayed

### Security Considerations

- Profile page should be accessible to all authenticated users
- Only allow editing of own profile (enforced by Clerk)
- Email and role are read-only (cannot be changed by user)
- Role changes must go through admin (existing flow)

### References

- [Clerk useUser Hook](https://clerk.com/docs/reference/clerk-react/use-user)
- [Clerk User Update](https://clerk.com/docs/reference/javascript/user/user#update)
- [Architecture Document](_bmad-output/planning-artifacts/_docs/architecture.md) - Authentication & Security section
- [Previous Story: 1-8-admin-user-management-deactivate-users](1-8-admin-user-management-deactivate-users.md)
- [Epics File](_bmad-output/planning-artifacts/epics.md) - Story 1.8

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
