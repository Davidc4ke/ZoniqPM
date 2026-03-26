import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomerCard } from '@/components/features/customer-management/customer-card';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CustomerCard', () => {
  const activeCustomer = {
    id: 'test-id-123',
    name: 'Acme Insurance Corp',
    description: 'Leading insurance provider in the Netherlands',
    isActive: true,
    createdAt: '2026-03-01T10:00:00Z',
  };

  const inactiveCustomer = {
    ...activeCustomer,
    id: 'test-id-456',
    name: 'Inactive Corp',
    isActive: false,
  };

  it('should render customer name', () => {
    render(<CustomerCard customer={activeCustomer} />);
    expect(
      screen.getByText('Acme Insurance Corp'),
    ).toBeInTheDocument();
  });

  it('should render customer description', () => {
    render(<CustomerCard customer={activeCustomer} />);
    expect(
      screen.getByText(
        'Leading insurance provider in the Netherlands',
      ),
    ).toBeInTheDocument();
  });

  it('should render Active badge for active customers', () => {
    render(<CustomerCard customer={activeCustomer} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render Inactive badge for inactive customers', () => {
    render(<CustomerCard customer={inactiveCustomer} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should render created date', () => {
    render(<CustomerCard customer={activeCustomer} />);
    expect(screen.getByText(/Mar 1, 2026/)).toBeInTheDocument();
  });

  it('should link to customer detail page', () => {
    render(<CustomerCard customer={activeCustomer} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/masterdata/customers/test-id-123',
    );
  });

  it('should handle missing description gracefully', () => {
    const noDescCustomer = { ...activeCustomer, description: null };
    render(<CustomerCard customer={noDescCustomer} />);
    expect(
      screen.getByText('Acme Insurance Corp'),
    ).toBeInTheDocument();
  });
});
