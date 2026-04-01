export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import './globals.css'

const manrope = localFont({
  src: '../fonts/manrope-latin-variable.woff2',
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zoniq',
  description: 'AI-powered requirements and project management for Mendix teams',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={manrope.variable}>
        <body className="font-sans antialiased">
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
