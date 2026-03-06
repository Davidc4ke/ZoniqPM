import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  label: string
  icon?: React.ReactNode
  isActive?: boolean
}

export function NavItem({ href, label, icon, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-[#FFF7F3] text-[#FF6B35]'
          : 'text-[#2D1810] hover:bg-[#E8E4E0]'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
