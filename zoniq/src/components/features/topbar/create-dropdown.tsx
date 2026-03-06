'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface MenuItem {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
}

const menuItems: MenuItem[] = [
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    label: 'New Ticket',
    onClick: () => {},
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: 'New Project',
    href: '/projects/new',
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </svg>
    ),
    label: 'New Story',
    href: '/stories/new',
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    label: 'New Document',
    href: '/documents/new',
  },
]

interface CreateDropdownProps {
  onClose?: () => void
}

export function CreateDropdown({ onClose }: CreateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item: MenuItem) => {
    setIsOpen(false)
    if (item.onClick) {
      item.onClick()
    }
    onClose?.()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 rounded-lg border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#2D1810] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-[9999] mt-1 min-w-[180px] animate-in fade-in-0 duration-200 rounded-lg border border-[#E8E4E0] bg-white shadow-lg">
          {menuItems.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-[#2D1810] transition-colors first:rounded-t-none hover:bg-[#FFF7F3] hover:text-[#FF6B35]"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#2D1810] transition-colors hover:bg-[#FFF7F3] hover:text-[#FF6B35]"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          )}
          <div className="my-1 border-t border-[#E8E4E0]" />
        </div>
      )}
    </div>
  )
}
