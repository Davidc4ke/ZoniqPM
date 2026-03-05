import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold text-lg hover:opacity-80 transition-opacity">
              Zoniq
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Users
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/sign-in" userProfileUrl="/profile" />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
