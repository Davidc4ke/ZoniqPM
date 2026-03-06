# Story 2.0: Home Page Dashboard Layout

Status: done

## Story

As a user,
I want to see a dashboard layout with navigation and quick actions when I log in,
So that I can quickly understand my work and navigate to relevant areas.

**FRs covered:** FR-new31, FR-new36, FR-new37

## Acceptance Criteria

1. **Given** an authenticated user **When** the user navigates to the home page (`/dashboard`) **Then** a dashboard layout is displayed with a responsive grid of widgets

2. **Given** a user viewing the dashboard **When** the user views the topbar **Then** role-aware navigation items are displayed (Dashboard, Kanban, Projects, Apps, Masterdata, Accounts) **And** navigation items are shown/hidden based on user role (Admins/PMs see Masterdata and Accounts)

3. **Given** a user viewing the topbar **When** the user clicks the Create dropdown **Then** quick create options are displayed: New Ticket, New Project, New Story, New Document

4. **Given** a user on the dashboard **When** the user clicks a quick create option **Then** the appropriate creation form opens (modal or navigation to creation page)

5. **Given** a user viewing the topbar **When** the user clicks the profile avatar **Then** a dropdown shows profile options: View Profile, Settings, Sign Out

6. **Given** a user on the dashboard **When** the page loads **Then** the following widgets are displayed in a responsive grid:
   - Assigned Stories (stories assigned to current user)
   - Review Queue (stories awaiting review)
   - Projects (active projects with mini kanban)
   - Apps (app environment status)
   - Team Activity (recent activity feed)

7. **Given** an authenticated user **When** the user logs in successfully **Then** they are redirected to `/dashboard` as the default home page

## Tasks / Subtasks

- [x] Task 1: Create Dashboard Layout Structure (AC: #1, #6)
  - [x] 1.1 Create `src/app/(dashboard)/dashboard/page.tsx` as the main dashboard route
  - [x] 1.2 Create responsive grid layout using Tailwind CSS with `grid-cols-[repeat(auto-fit,minmax(320px,1fr))]`
  - [x] 1.3 Create dashboard container component with max-width 1280px
  - [x] 1.4 Implement loading skeleton for dashboard widgets

- [x] Task 2: Create Unified Topbar Component (AC: #2, #3, #5)
  - [x] 2.1 Create `src/components/features/topbar/topbar.tsx` with sticky positioning
  - [x] 2.2 Implement navigation items with role-based visibility using Clerk's `useAuth` hook
  - [x] 2.3 Create `src/components/features/topbar/nav-item.tsx` for individual navigation links
  - [x] 2.4 Create dropdown integrated in topbar (create-dropdown functionality)
  - [x] 2.5 Create `src/components/features/topbar/profile-dropdown.tsx` with user menu
  - [x] 2.6 Add Zoniq logo SVG component

- [x] Task 3: Implement Navigation Items (AC: #2)
  - [x] 3.1 Dashboard nav item (visible to all users)
  - [x] 3.2 Kanban nav item (visible to all users)
  - [x] 3.3 Projects nav item (visible to all users)
  - [x] 3.4 Apps nav item (visible to all users)
  - [x] 3.5 Masterdata nav item (visible to admins/PMs only)
  - [x] 3.6 Accounts nav item (visible to admins/PMs only)
  - [x] 3.7 Implement active state styling (orange background)

- [x] Task 4: Create Dashboard Widget Components (AC: #6)
  - [x] 4.1 Create `src/components/features/dashboard/assigned-stories-widget.tsx`
  - [x] 4.2 Create `src/components/features/dashboard/review-queue-widget.tsx`
  - [x] 4.3 Create `src/components/features/dashboard/projects-widget.tsx`
  - [x] 4.4 Create `src/components/features/dashboard/apps-widget.tsx`
  - [x] 4.5 Create `src/components/features/dashboard/team-activity-widget.tsx`

- [x] Task 5: Create Story Card Component (AC: #6)
  - [x] 5.1 Create StoryCard component (created in Task 1 at `src/components/features/dashboard/story-card.tsx`)
  - [x] 5.2 Implement priority dot indicators (high=red, medium=amber, low=gray)
  - [x] 5.3 Implement status badges (Ready=green, In Progress=amber, In Review=blue, etc.)
  - [x] 5.4 Add assignee avatar initials display
  - [x] 5.5 Add project name and folder icon
  - [x] 5.6 Use warm gray background (#F5F2EF) for cards

- [x] Task 6: Create Mini Kanban Component (AC: #6)
  - [x] 6.1 Create `src/components/features/mini-kanban/mini-kanban.tsx`
  - [x] 6.2 Implement 5 columns: Backlog (gray), Active (amber), Testing (purple), Review (blue), Done (green)
  - [x] 6.3 Add progress bar with animated fill
  - [x] 6.4 Display story counts per column

- [x] Task 7: Create Activity Feed Component (AC: #6)
  - [x] 7.1 Create `src/components/features/activity-feed/activity-feed.tsx`
  - [x] 7.2 Implement horizontal scrollable feed
  - [x] 7.3 Display user avatar, action description, and relative timestamp
  - [x] 7.4 Support activity types: status changes, story creation, story completion, AI generation

- [x] Task 8: Update Root Layout and Redirect (AC: #7)
  - [x] 8.1 Root redirect already implemented in Epic 1
  - [x] 8.2 Dashboard layout redirects unauthenticated users to sign-in

- [x] Task 9: Testing and Polish
  - [x] 9.1 Manual test: All navigation items display correctly based on role
  - [x] 9.2 Manual test: Create dropdown opens and closes properly
  - [x] 9.3 Manual test: Profile dropdown displays all options
  - [x] 9.4 Manual test: Dashboard widgets render with placeholder data
  - [x] 9.5 Run `npm run lint` - passed (2 warnings, 0 errors)
  - [x] 9.6 Run `npm run build` - compiled successfully
  - [x] 9.7 Run `npm run test` - 4/4 tests passed

## Dev Notes

### Architecture Patterns & Constraints

**Tech Stack (from architecture.md):**
- Next.js 16 with React 19 and TypeScript 5
- Tailwind CSS 4 with shadcn/ui components
- Clerk 5.x for authentication and RBAC
- App Router with `src-dir` convention

**Naming Conventions:**
- React components: `PascalCase.tsx`
- Component folders: `kebab-case/`
- All components in `src/components/features/{feature-name}/`

**API Response Format:**
```typescript
// Success: { data: T, meta?: {...} }
// Error: { error: { code: string, message: string } }
```

### Project Structure Notes

Follow the established project structure from Epic 1:

```
src/
├── app/(dashboard)/
│   ├── layout.tsx           # Dashboard layout with topbar
│   ├── dashboard/
│   │   └── page.tsx         # Main dashboard page
│   ├── kanban/
│   ├── projects/
│   ├── apps/
│   ├── masterdata/          # Admin only
│   └── accounts/            # Admin only
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── features/
│       ├── topbar/
│       ├── story-card/
│       ├── mini-kanban/
│       ├── activity-feed/
│       └── dashboard/
└── lib/
    └── utils/
        └── cn.ts            # Tailwind class merge utility
```

### Design Tokens (from UX spec & shared-styles.css)

**Colors:**
- Primary Orange: `#FF6B35`
- Dark Brown: `#2D1810`
- Off-White Background: `#FAFAF9`
- Warm Gray: `#E8E4E0`
- Medium Gray: `#9A948D`
- Success Green: `#10B981`
- Warning Amber: `#F59E0B`
- Error Red: `#EF4444`
- Card Background: `#F5F2EF`

**Kanban Column Colors:**
- Backlog: `#9A948D`
- Active: `#F59E0B`
- Testing: `#9333EA`
- Review: `#2563EB`
- Done: `#10B981`

**Typography:**
- Font: Manrope (single font family)
- H1: 32px / ExtraBold (800)
- H2: 24px / Bold (700)
- H3: 18px / SemiBold (600)
- Body: 16px / Regular (400)

**Spacing:**
- Base unit: 8px
- Card padding: 20px
- Gap between widgets: 20px

### Component Styling Patterns

**Story Card Structure:**
```
┌─────────────────────────────────────────────┐
│ 🔴  #47 Approval Workflow            [A]    │  ← Priority · Title · Assignee
│                                             │
│ Implement multi-level approval based on     │  ← Description
│ user role and amount                        │
│                                             │
│ 📂 Claims Portal · In Progress              │  ← Project · Status
└─────────────────────────────────────────────┘
```

**Topbar Navigation Items:**
- Default: transparent, text color #2D1810
- Hover: warm gray background (#E8E4E0)
- Active: orange background (#F5F2EF), orange text (#FF6B35)

### Role-Based Navigation Logic

```typescript
// Use Clerk's metadata for role checking
import { useUser } from '@clerk/nextjs';

const ADMIN_ROLES = ['org:admin'];
const PM_ROLES = ['org:admin', 'org:pm'];

function isVisibleToUser(navItem: string, userRole: string | undefined): boolean {
  switch (navItem) {
    case 'Masterdata':
    case 'Accounts':
      return ADMIN_ROLES.includes(userRole || '') || PM_ROLES.includes(userRole || '');
    default:
      return true;
  }
}
```

### Clerk Role Mapping (from architecture.md)

| Zoniq Role | Clerk Role |
|------------|------------|
| Admin | org:admin |
| PM | org:pm |
| Consultant | org:member |

### Previous Story Intelligence (from Epic 1)

**Patterns Established:**
1. Dashboard layout uses route groups `(dashboard)/` for authenticated routes
2. Topbar integrated in dashboard layout, not root layout
3. Clerk's `SignedIn` / `SignedOut` components used for conditional rendering
4. User profile picture from Clerk displayed in topbar
5. Role-based visibility implemented via Clerk's user publicMetadata

**Files Created in Epic 1:**
- `src/app/(auth)/` - Authentication routes
- `src/app/(dashboard)/layout.tsx` - Dashboard layout
- `src/app/(dashboard)/profile/page.tsx` - Profile page
- `src/middleware.ts` - Clerk middleware for route protection

### Design File Reference

**HTML Prototype:** `_bmad-output/planning-artifacts/design-home-page.html`
**Shared Styles:** `_bmad-output/planning-artifacts/shared-styles.css`

Key elements from prototype:
- Hero universal input at top (placeholder for future story)
- Responsive grid with 3+ columns
- Story cards with warm gray background
- Project cards with mini kanban
- Apps widget with environment status indicators
- Team activity horizontal scroll

### Implementation Order

1. **Topbar First** - Core navigation and branding
2. **Dashboard Layout** - Grid structure and containers
3. **Widget Components** - Individual dashboard sections
4. **Story Card** - Reusable across widgets
5. **Mini Kanban** - For project widgets
6. **Activity Feed** - Final widget
7. **Integration** - Connect all components
8. **Testing** - Verify all acceptance criteria

### shadcn/ui Components to Use

From existing installation:
- Button (`src/components/ui/button.tsx`)
- Card (`src/components/ui/card.tsx`)
- Avatar (`src/components/ui/avatar.tsx`)
- Badge (`src/components/ui/badge.tsx`)
- Dropdown Menu (`src/components/ui/dropdown-menu.tsx`)
- Skeleton (`src/components/ui/skeleton.tsx`)

May need to add:
- Separator (for dropdown dividers)

### References

- [Source: _bmad-output/planning-artifacts/_docs/architecture.md#Project-Structure]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md#Design-System-Foundation]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md#Unified-Topbar-Navigation]
- [Source: _bmad-output/planning-artifacts/_docs/ux-design-specification.md#Story-Card-Design]
- [Source: _bmad-output/planning-artifacts/design-home-page.html]
- [Source: _bmad-output/planning-artifacts/shared-styles.css]

## Dev Agent Record

### Agent Model Used

Claude 4 (claude-4-5)

### Debug Log References

N/A

### Completion Notes List

1. StoryCard component was created during Task 1, so Task 5 was verification only
2. Create dropdown functionality integrated directly into topbar (no separate create-dropdown.tsx file)
3. Root redirect already implemented in Epic 1
4. Test mocks updated during verification to support new clerkClient usage

### File List

### Created Files

| File | Description |
|------|-------------|
| `zoniq/src/components/features/dashboard/story-card.tsx` | Reusable story card component with priority dots, status badges, assignee avatars |
| `zoniq/src/components/features/dashboard/apps-widget.tsx` | Apps widget displaying environment status (Dev/Test/Acc/Prod) |
| `zoniq/src/components/features/topbar/topbar.tsx` | Unified topbar with navigation, create dropdown, profile |
| `zoniq/src/components/features/topbar/profile-dropdown.tsx` | Custom profile dropdown with View Profile, Settings, Sign Out |
| `zoniq/src/components/features/mini-kanban/mini-kanban.tsx` | Reusable mini kanban component with 5 columns and progress bar |
| `zoniq/src/components/features/activity-feed/activity-feed.tsx` | Horizontal scrollable activity feed component |

### Modified Files

| File | Description |
|------|-------------|
| `zoniq/src/components/features/dashboard/widget.tsx` | Reusable widget wrapper component |
| `zoniq/src/components/features/dashboard/projects-widget.tsx` | Projects widget with mini kanban integration |
| `zoniq/src/app/(dashboard)/dashboard/page.tsx` | Main dashboard page with responsive grid |
| `zoniq/src/components/features/topbar/zoniq-logo.tsx` | Official Zoniq logo SVG |
| `zoniq/src/components/features/topbar/index.ts` | Topbar exports |
| `zoniq/src/app/(dashboard)/layout.tsx` | Dashboard layout with Topbar integration and clerkClient |
| `zoniq/src/components/features/topbar/topbar-nav.tsx` | Navigation items styling |
| `zoniq/src/components/features/topbar/nav-item.tsx` | NavItem component with active state |
| `zoniq/src/components/features/dashboard/assigned-stories-widget.tsx` | Assigned stories widget |
| `zoniq/src/components/features/dashboard/review-queue-widget.tsx` | Review queue widget |
| `zoniq/src/components/features/dashboard/team-activity-widget.tsx` | Team activity widget using ActivityFeed |
| `zoniq/src/test/logout.test.tsx` | Updated test mocks for clerkClient, useClerk, useUser |

---
**Last Updated:** 2026-03-06
**Completed by:** David
