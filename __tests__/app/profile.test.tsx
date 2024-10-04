import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserProfile from '@/app/profile/page';

// Mock the necessary modules and components
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/withauth', () => (Component: React.ComponentType) => Component);

describe('UserProfile Component', () => {
  const mockSession = {
    user: { id: 'user123', accessToken: 'mock-token' },
  };
  const mockRouter = { push: jest.fn() };
  const mockUserData = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '1234567890',
    whatsapp: '9876543210',
    companyName: 'Acme Inc',
    avatar: '/avatar.jpg',
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: 'authenticated' });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    ) as jest.Mock;
  });

  it('renders the header', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });
  });

  it('displays the user profile title', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });

  it('fetches and displays user data', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('allows editing user profile', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Profile'));
    });
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile')).toBeInTheDocument();
  });

  it('disables editing of email field', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Profile'));
    });
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
  });

  it('submits updated user data', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Profile'));
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByText('Save Changes'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('Jane Doe'),
        })
      );
    });
  });

  it('cancels editing', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Profile'));
    });
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });



  it('handles fetch error gracefully', async () => {
    console.error = jest.fn();
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch failed'))) as jest.Mock;

    render(<UserProfile />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error));
    });
  });
});