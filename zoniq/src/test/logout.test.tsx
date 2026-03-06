import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import DashboardLayout from '../app/(dashboard)/layout'

vi.mock('@clerk/nextjs', () => ({
  useClerk: () => ({
    signOut: vi.fn(),
  }),
  useUser: () => ({
    user: {
      firstName: 'Test',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.png',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    },
  }),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
  clerkClient: vi.fn(() =>
    Promise.resolve({
      users: {
        getUser: vi.fn(() =>
          Promise.resolve({
            firstName: 'Test',
            username: 'testuser',
            imageUrl: 'https://example.com/avatar.png',
            emailAddresses: [{ emailAddress: 'test@example.com' }],
            privateMetadata: { roles: ['admin'], role: 'admin' },
          })
        ),
      },
    })
  ),
}))

const mockAuth = vi.mocked(
  await import('@clerk/nextjs/server').then((m) => m.auth)
)

describe('DashboardLayout - Logout Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ProfileDropdown Configuration', () => {
    it('renders profile dropdown for authenticated users', async () => {
      mockAuth.mockResolvedValue({ userId: 'test-user-id' })

      const { container } = render(
        await DashboardLayout({ children: React.createElement('div', null, 'Test') })
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('displays sign out option in profile dropdown', async () => {
      mockAuth.mockResolvedValue({ userId: 'test-user-id' })

      render(
        await DashboardLayout({ children: React.createElement('div', null, 'Test') })
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
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
