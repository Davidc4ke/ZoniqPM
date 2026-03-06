import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Topbar } from '@/components/features/topbar/topbar'

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

  const userName = currentUser.firstName || currentUser.username || undefined
  const userEmail = currentUser.emailAddresses?.[0]?.emailAddress
  const userImageUrl = currentUser.imageUrl

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Topbar
        isAdmin={isAdmin}
        userName={userName}
        userEmail={userEmail}
        userImageUrl={userImageUrl}
      />
      <main className="bg-[#FAFAF9]">{children}</main>
    </div>
  )
}
