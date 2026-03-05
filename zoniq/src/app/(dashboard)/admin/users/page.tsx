import { auth, clerkClient } from '@clerk/nextjs/server'
import { UsersPageClient } from '@/components/admin/users-page-client'

export default async function UsersPage() {
  const { userId } = await auth()
  const client = await clerkClient()
  const [usersResponse, invitationsResponse] = await Promise.all([
    client.users.getUserList(),
    client.invitations.getInvitationList(),
  ])

  const users = usersResponse.data.map((user) => ({
    id: user.id,
    emailAddress: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    privateMetadata: user.privateMetadata,
    banned: user.banned,
    status: user.banned ? 'inactive' as const : 'active' as const,
  createdAt: user.createdAt,
  }))

  const pendingInvitations = invitationsResponse.data.map((invitation) => ({
    id: invitation.id,
    emailAddress: invitation.emailAddress,
    firstName: (invitation.publicMetadata?.firstName as string) || undefined,
    lastName: (invitation.publicMetadata?.lastName as string) || undefined,
    publicMetadata: { role: invitation.publicMetadata?.role as string | undefined },
    banned: false,
    status: 'pending' as const,
    createdAt: invitation.createdAt,
  }))

  const allUsers = [...users, ...pendingInvitations]

  return <UsersPageClient initialUsers={allUsers} totalCount={usersResponse.totalCount + invitationsResponse.data.length} currentUserId={userId ?? ''} />
}
