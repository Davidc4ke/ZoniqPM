import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import DashboardLayout from '../app/(dashboard)/layout'

vi.mock('@clerk/nextjs', () => ({
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl: string }) =>
    React.createElement('div', {
      'data-testid': 'user-button',
      'data-after-sign-out-url': afterSignOutUrl,
    }, 'UserButton'),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

const mockAuth = vi.mocked(
  await import('@clerk/nextjs/server').then((m) => m.auth)
)

describe('DashboardLayout - Logout Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('UserButton Configuration', () => {
    it('renders UserButton with correct sign-out redirect URL', async () => {
      mockAuth.mockResolvedValue({ userId: 'test-user-id' })

      const { container } = render(
        await DashboardLayout({ children: React.createElement('div', null, 'Test') })
      )

      const userButton = container.querySelector('[data-testid="user-button"]')
      expect(userButton).toBeInTheDocument()
      expect(userButton?.getAttribute('data-after-sign-out-url')).toBe('/sign-in')
    })

    it('displays UserButton in header for authenticated users', async () => {
      mockAuth.mockResolvedValue({ userId: 'test-user-id' })

      const { container } = render(
        await DashboardLayout({ children: React.createElement('div', null, 'Test') })
      )

      const userButton = container.querySelector('[data-testid="user-button"]')
      expect(userButton).toBeInTheDocument()
    })
  })

  describe('Protected Route Behavior', () => {
    it('renders children when user is authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: 'test-user-id' })

      const { container } = render(
        await DashboardLayout({ children: React.createElement('div', { 'data-testid': 'child-content' }, 'Dashboard Content') })
      )

      expect(container.querySelector('[data-testid="child-content"]')).toBeInTheDocument()
    })

    it('includes header with branding link to dashboard', async () => {
      mockAuth.mockResolvedValue({ userId: 'test-user-id' })

      const { container } = render(
        await DashboardLayout({ children: React.createElement('div', null, 'Test') })
      )

      const brandingLink = container.querySelector('a[href="/dashboard"]')
      expect(brandingLink).toBeInTheDocument()
      expect(brandingLink?.textContent).toBe('Zoniq')
    })
  })
})
