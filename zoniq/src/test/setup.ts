import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import React from 'react'


vi.mock('@clerk/nextjs', () => ({
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl: string }) =>
    React.createElement('div', {
      'data-testid': 'user-button',
      'data-after-sign-out-url': afterSignOutUrl,
    }, 'UserButton'),
  SignOutButton: ({ redirectUrl, children }: { redirectUrl: string; children: React.ReactNode }) =>
    React.createElement('div', {
      'data-testid': 'sign-out-button',
      'data-redirect-url': redirectUrl,
    }, children),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))
