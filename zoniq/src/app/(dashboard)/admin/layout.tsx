import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const roles = user.privateMetadata?.roles as string[] | undefined
  const role = user.privateMetadata?.role as string | undefined

  const isAdmin = (roles && roles.includes('admin')) || role === 'admin'
  if (!isAdmin) {
    redirect('/dashboard?error=unauthorized')
  }

  return <>{children}</>
}
