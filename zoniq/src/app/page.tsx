import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignedOut, SignInButton } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to Zoniq
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          AI-powered requirements and project management for Mendix low-code development teams.
        </p>
        <div className="flex gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </main>
    </div>
  )
}
