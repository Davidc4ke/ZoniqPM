import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerForm } from '@/components/features/customer-management/customer-form';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('CustomerForm', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create form when open', () => {
    render(
      <CustomerForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByText('New Customer')).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Customer/ }),
    ).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <CustomerForm
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.queryByText('New Customer')).not.toBeInTheDocument();
  });

  it('should render edit form when editCustomer is provided', () => {
    render(
      <CustomerForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        editCustomer={{
          id: '123',
          name: 'Acme Corp',
          description: 'Test description',
        }}
      />,
    );

    expect(screen.getByText('Edit Customer')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Save Changes/ }),
    ).toBeInTheDocument();
  });

  it('should show validation error for empty name on submit', async () => {
    render(
      <CustomerForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', {
      name: /Create Customer/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Customer name is required'),
      ).toBeInTheDocument();
    });
  });

  it('should call onClose when cancel is clicked', () => {
    render(
      <CustomerForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <CustomerForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show character count for description', () => {
    render(
      <CustomerForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByText('0/500')).toBeInTheDocument();

    const textarea = screen.getByLabelText(/Description/);
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    expect(screen.getByText('5/500')).toBeInTheDocument();
  });
});
