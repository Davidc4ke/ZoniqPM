import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TopbarNav } from '@/components/features/topbar/topbar-nav'
import { ZoniqLogo } from '@/components/features/topbar/zoniq-logo'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const client = await clerkClient()
  const currentUser = await client.users.getUser(userId)
  const roles = currentUser.privateMetadata?.roles as string[] | undefined
  const role = currentUser.privateMetadata?.role as string | undefined
  const isAdmin = (roles && roles.includes('admin')) || role === 'admin'

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="sticky top-0 z-50 border-b border-[#E8E4E0] bg-white">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-[#2D1810] hover:opacity-80 transition-opacity">
              <ZoniqLogo />
              <span className="text-[#FF6B35]">Zoniq</span>
            </Link>

            <TopbarNav isAdmin={isAdmin} />
          </div>
        </div>
      </header>
      <main className="bg-[#FAFAF9]">{children}</main>
    </div>
  )
}
