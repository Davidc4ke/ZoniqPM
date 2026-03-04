import { currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to Zoniq{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Your AI-powered requirements and project management workspace.
        </p>
      </main>
    </div>
  )
}
