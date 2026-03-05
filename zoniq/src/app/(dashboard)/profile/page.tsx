import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ProfileView } from '@/components/profile/profile-view'

export default async function ProfilePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const client = await clerkClient()
  const currentUser = await client.users.getUser(userId)

    const user = {
    id: currentUser.id,
    emailAddress: currentUser.emailAddresses[0]?.emailAddress,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    privateMetadata: currentUser.privateMetadata,
    publicMetadata: currentUser.publicMetadata,
    banned: currentUser.banned,
    status: currentUser.banned ? 'inactive' as const : 'active' as const,
    createdAt: currentUser.createdAt,
    }

    return <ProfileView initialUser={user} />
}
