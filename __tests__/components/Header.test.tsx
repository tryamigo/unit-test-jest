import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

// Mocking next-auth and next/navigation
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Header Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the Sign In button when the user is not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Header />);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    expect(signInButton).toBeInTheDocument();
  });

  it('renders the team selection dropdown when the user is authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: '12345',
          teamId: 'team1',
          teamName: 'Team One',
          teams: [{ id: 'team1', name: 'Team One' }, { id: 'team2', name: 'Team Two' }],
        },
      },
      status: 'authenticated',
    });

    render(<Header />);
    // Check if the team selection dropdown trigger is rendered
    const selectTrigger = screen.getByTestId('team-select-trigger');
    expect(selectTrigger).toBeInTheDocument();
  });

 

  it('navigates to /sign-in page when the Sign In button is clicked', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Header />);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('renders the mobile menu button and toggles the menu', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: '12345',
          teams: [{ id: 'team1', name: 'Team One' }],
        },
      },
      status: 'authenticated',
    });

    render(<Header />);

    // Check for the mobile menu button
    const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(mobileMenuButton).toBeInTheDocument();

    // Simulate clicking the mobile menu button
    fireEvent.click(mobileMenuButton);
    const clientsMenuItem = screen.getByText(/clients/i);
    expect(clientsMenuItem).toBeInTheDocument();
  });


  
});
