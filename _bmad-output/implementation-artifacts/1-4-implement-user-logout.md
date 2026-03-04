# Story 1.4: Implement User Logout

Status: done

## Story

As a user,
I want to log out of the system,
So that my session is terminated and my data remains secure. (FR2)

## Acceptance Criteria

1. **Given** an authenticated user **When** the user clicks the logout button in the navigation **Then** the Clerk session is terminated **And** the user is redirected to the login page **And** all protected routes become inaccessible

2. **Given** a logged-out user **When** the user attempts to access a protected route **Then** the user is redirected to the login page

## Tasks / Subtasks

- [x] Task 1: Add SignOutButton to dashboard layout topbar (AC: #1)
  - [x] Create or update topbar component with user menu
  - [x] Add SignOutButton from @clerk/nextjs within dropdown menu
  - [x] Configure redirect after sign-out to /sign-in
- [x] Task 2: Add SignOutButton to home page for authenticated users (AC: #1)
  - [x] Update home page to show SignOutButton when logged in (if not redirecting)
  - **Note:** Deemed unnecessary - home page already redirects authenticated users to dashboard
- [x] Task 3: Verify protected route behavior after logout (AC: #2)
  - [x] Test that middleware redirects to /sign-in for protected routes
  - [x] Verify session is fully terminated
- [x] Task 4: Run validation (All ACs)
  - [x] Run `npm run lint` - must pass
  - [x] Run `npm run build` - must compile successfully
  - [x] Manual test: logout flow, protected route access

## Dev Notes

### Architecture Patterns & Constraints

**From Architecture Document - Authentication & Security:**
- Clerk 5.x (installed: 6.39.0) for authentication
- Session Management: Clerk (built-in)
- RBAC: Clerk Organizations + custom roles (future stories)

**Key Architecture Decisions:**
- Use route groups `(dashboard)` for protected routes
- middleware.ts protects routes using `clerkMiddleware`
- Sign-out should redirect to `/sign-in`

### Previous Story Learnings (Story 1.3)

- @clerk/nextjs 6.39.0 installed and working
- ClerkProvider configured in `src/app/layout.tsx`
- Proxy middleware at `src/proxy.ts` using `clerkMiddleware`
- Dashboard route group exists with auth protection in layout
- Current files:
  - `zoniq/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Sign-in page
  - `zoniq/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Sign-up page
  - `zoniq/src/app/(dashboard)/layout.tsx` - Protected dashboard layout
  - `zoniq/src/app/(dashboard)/dashboard/page.tsx` - Dashboard page
  - `zoniq/src/app/page.tsx` - Home page (redirects authenticated users)
  - `zoniq/src/proxy.ts` - Middleware with clerkMiddleware

### Current Implementation State

**Existing Dashboard Layout (`zoniq/src/app/(dashboard)/layout.tsx`):**
```typescript
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return <>{children}</>
}
```

**Existing Dashboard Page (`zoniq/src/app/(dashboard)/dashboard/page.tsx`):**
```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to Zoniq{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Your AI-powered requirements and project management workspace.
        </p>
      </main>
    </div>
  )
}
```

**Existing Proxy/Middleware (`zoniq/src/proxy.ts`):**
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!x)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webm)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### Required Changes for This Story

**1. Update Dashboard Layout with Topbar containing SignOutButton:**

```typescript
// zoniq/src/app/(dashboard)/layout.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignOutButton, UserButton } from '@clerk/nextjs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">Zoniq</span>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
```

**Note:** Clerk's `UserButton` component includes a built-in sign-out option. Using `UserButton` with `afterSignOutUrl="/sign-in"` provides:
- User profile display
- Sign out dropdown option
- Automatic redirect after sign-out

Alternatively, for explicit SignOutButton:

```typescript
import { SignOutButton } from '@clerk/nextjs'

// In your component:
<SignOutButton redirectUrl="/sign-in">
  <button className="text-sm text-muted-foreground hover:text-foreground">
    Sign Out
  </button>
</SignOutButton>
```

**2. Update Proxy/Middleware (if needed):**

The existing middleware at `zoniq/src/proxy.ts` already protects routes. Verify it handles the sign-out redirect correctly.

### Clerk SignOut Component Props Reference

| Prop | Description | Usage |
|------|-------------|-------|
| `redirectUrl` | URL to redirect after sign-out | `/sign-in` |
| `children` | Custom trigger element | Button or link |

### Clerk UserButton Props Reference

| Prop | Description | Usage |
|------|-------------|-------|
| `afterSignOutUrl` | URL after sign-out | `/sign-in` |
| `afterSwitchSessionUrl` | URL after session switch | Optional |
| `appearance` | Custom styling | Optional |

### Protected Route Behavior

After sign-out:
1. Clerk clears session cookies
2. User is redirected to `/sign-in`
3. Middleware (`clerkMiddleware`) detects no session
4. Protected routes (`/dashboard/*`) redirect to `/sign-in`

### Project Structure After This Story

```
zoniq/src/app/
├── globals.css
├── layout.tsx              # Root with ClerkProvider
├── page.tsx                # Landing (redirects if authenticated)
├── (auth)/
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx        # Login page
│   └── sign-up/[[...sign-up]]/
│       └── page.tsx        # Signup page
└── (dashboard)/            # Protected route group
    ├── layout.tsx          # Auth protection + topbar (UPDATED)
    └── dashboard/
        └── page.tsx        # Dashboard page
```

### Testing Standards

- Run `npm run lint` - must pass with 0 errors
- Run `npm run build` - must compile successfully
- Manual testing checklist:
  1. Log in as authenticated user
  2. Click sign-out from UserButton dropdown
  3. Verify redirect to `/sign-in`
  4. Attempt to navigate to `/dashboard` - should redirect to `/sign-in`
  5. Verify session cookies are cleared

### References

- [Clerk SignOutButton Documentation](https://clerk.com/docs/components/authentication/sign-out)
- [Clerk UserButton Documentation](https://clerk.com/docs/components/user/user-button)
- [Clerk Next.js Overview](https://clerk.com/docs/references/nextjs/overview)
- [Architecture Document](_bmad-output/planning-artifacts/_docs/architecture.md)
- [Previous Story: 1-3-implement-user-login](1-3-implement-user-login.md)

## Dev Agent Record

### Agent Model Used

glm-5 (Claude Code)

### Debug Log References

### Completion Notes List

- Implemented UserButton component in dashboard layout with afterSignOutUrl="/sign-in" configuration
- UserButton provides built-in sign-out functionality via dropdown menu
- Home page already redirects authenticated users to dashboard, no changes needed
- Protected routes are already handled by existing middleware (clerkMiddleware) and dashboard layout auth check
- All tests pass: lint (0 errors), build (successful compilation)

**Code Review Fixes Applied (First Review):**
- Added Vitest test framework with @testing-library/react for automated testing
- Created logout.test.tsx with UserButton configuration tests
- Added clickable Link to dashboard from header branding
- Removed redundant min-h-screen from dashboard page (layout handles it)
- Added loading.tsx for streaming suspense boundary

**Code Review Fixes Applied (Second Review - 2026-03-04):**
- Enhanced test coverage: tests now render actual DashboardLayout component instead of just mocking UserButton
- Added tests for protected route behavior (children rendering when authenticated)
- Added test for header branding link to dashboard
- Updated Task 2 with clarifying note that home page changes were deemed unnecessary

### File List

- zoniq/src/app/(dashboard)/layout.tsx (modified)
- zoniq/src/app/(dashboard)/loading.tsx (created)
- zoniq/src/app/(dashboard)/dashboard/page.tsx (modified)
- zoniq/vitest.config.ts (created)
- zoniq/src/test/setup.ts (created)
- zoniq/src/test/logout.test.tsx (created)
- zoniq/package.json (modified - added test scripts and dependencies)
