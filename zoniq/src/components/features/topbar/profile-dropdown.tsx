'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useClerk, useUser } from '@clerk/nextjs'

interface ProfileDropdownProps {
  userName?: string
  userEmail?: string
  userImageUrl?: string
}

export function ProfileDropdown({ userName, userEmail, userImageUrl }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { signOut } = useClerk()
  const { user } = useUser()

  const displayName = userName || user?.firstName || 'User'
  const displayEmail = userEmail || user?.emailAddresses?.[0]?.emailAddress || ''
  const avatarUrl = userImageUrl || user?.imageUrl

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut({ redirectUrl: '/sign-in' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 overflow-hidden rounded-full border-2 border-[#E8E4E0] transition-all hover:border-[#FF6B35] hover:shadow-[0_0_0_3px_rgba(255,107,53,0.2)]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#FF6B35] text-sm font-semibold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[9999] mt-1 min-w-[200px] animate-in fade-in-0 duration-200 rounded-lg border border-[#E8E4E0] bg-white shadow-lg">
          <div className="border-b border-[#E8E4E0] px-3.5 py-2.5">
            <div className="text-sm font-semibold text-[#2D1810]">{displayName}</div>
            <div className="text-xs text-[#9A948D]">{displayEmail}</div>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#FFF7F3] hover:text-[#FF6B35]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            View Profile
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#FFF7F3] hover:text-[#FF6B35]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>

          <div className="my-1 border-t border-[#E8E4E0]" />

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
