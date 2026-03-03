export default function Home() {
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
          <a
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="#"
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  )
}
