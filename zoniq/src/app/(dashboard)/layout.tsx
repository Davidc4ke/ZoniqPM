import { auth } from '@clerk/nextjs/server'
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-lg hover:opacity-80 transition-opacity">
              Zoniq
            </Link>
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
