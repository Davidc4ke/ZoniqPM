'use client'

import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { NavItem } from './nav-item'
import { CreateDropdown } from './create-dropdown'

interface TopbarNavProps {
  isAdmin: boolean
}

export function TopbarNav({ isAdmin }: TopbarNavProps) {
  const pathname = usePathname()

  return (
    <>
      <nav className="flex items-center gap-1">
        <NavItem
          href="/dashboard"
          label="Dashboard"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          }
          isActive={pathname === '/dashboard'}
        />
        <NavItem
          href="/kanban"
          label="Kanban"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          }
          isActive={pathname === '/kanban'}
        />
        <NavItem
          href="/projects"
          label="Projects"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
          isActive={pathname === '/projects'}
        />
        <NavItem
          href="/apps"
          label="Apps"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          }
          isActive={pathname === '/apps'}
        />
        {isAdmin && (
          <>
            <NavItem
              href="/masterdata"
              label="Masterdata"
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              }
              isActive={pathname === '/masterdata'}
            />
            <NavItem
              href="/admin/users"
              label="Accounts"
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              isActive={pathname === '/admin/users'}
            />
          </>
        )}
      </nav>

      <div className="flex items-center gap-3">
        <CreateDropdown />
        <button
          className="flex items-center justify-center rounded-lg p-2 text-[#2D1810] transition-colors hover:bg-[#E8E4E0]"
          title="Open AI Chat"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
        </button>
        <UserButton afterSignOutUrl="/sign-in" userProfileUrl="/profile" />
      </div>
    </>
  )
}
