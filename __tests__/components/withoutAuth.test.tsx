import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import withoutAuth from '@/components/withoutauth';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('withoutAuth HOC', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const MockComponent = () => <div>Mock Component Content</div>;
  const WrappedComponent = withoutAuth(MockComponent);

  it('renders the loading state when status is "loading"', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<WrappedComponent />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders the wrapped component when user is not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<WrappedComponent />);
    expect(screen.getByText(/mock component content/i)).toBeInTheDocument();
  });

  it('redirects to /clients when the user is authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });

    render(<WrappedComponent />);
    expect(mockPush).toHaveBeenCalledWith('/clients');
  });

  it('does not render the wrapped component when the user is authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });

    render(<WrappedComponent />);
    expect(screen.queryByText(/mock component content/i)).not.toBeInTheDocument();
  });
});
