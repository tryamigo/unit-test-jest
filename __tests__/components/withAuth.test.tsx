import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import withAuth from '@/components/withauth';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('withAuth HOC', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const MockComponent = () => <div>Mock Component Content</div>;
  const WrappedComponent = withAuth(MockComponent);

  it('renders a loading state while session status is "loading"', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<WrappedComponent />);
    expect(screen.queryByText(/mock component content/i)).not.toBeInTheDocument();
  });

  it('redirects to "/" if user is not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<WrappedComponent />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects to "/sign-in" if session exists but accessToken is missing', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } }, // No accessToken
      status: 'authenticated',
    });

    render(<WrappedComponent />);
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('renders the wrapped component when user is authenticated and has an accessToken', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User', accessToken: 'valid-token' } },
      status: 'authenticated',
    });

    render(<WrappedComponent />);
    expect(screen.getByText(/mock component content/i)).toBeInTheDocument();
  });
});
