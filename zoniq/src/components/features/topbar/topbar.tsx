'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ZoniqLogo } from './zoniq-logo'
import { NavItem } from './nav-item'
import { CreateDropdown } from './create-dropdown'
import { ProfileDropdown } from './profile-dropdown'

interface TopbarProps {
  isAdmin?: boolean
  userName?: string
  userEmail?: string
  userImageUrl?: string
}

export function Topbar({ isAdmin, userName, userEmail, userImageUrl }: TopbarProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E4E0] bg-white">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold text-lg text-[#2D1810] transition-opacity hover:opacity-80"
          >
            <ZoniqLogo />
            <span className="text-[#FF6B35]">Zoniq</span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavItem
              href="/dashboard"
              label="Dashboard"
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
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
                  <path d="M4 10h16" />
                  <path d="M10 4v16" />
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
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M3 9h6" />
                  <path d="M3 15h6" />
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
        </div>

        <div className="flex items-center gap-3">
          <CreateDropdown />
          <button
            className="flex items-center justify-center rounded-lg border border-[#E8E4E0] p-2 text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
            title="Open AI Chat"
            onClick={() => window.dispatchEvent(new CustomEvent('zoniq:open-ai-chat'))}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01M12 10h.01M16 10h.01" />
            </svg>
          </button>
          <ProfileDropdown userName={userName} userEmail={userEmail} userImageUrl={userImageUrl} />
        </div>
      </div>
    </header>
  )
}
