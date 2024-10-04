import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Homepage from '@/components/Homepage';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

describe('Homepage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useSession as jest.Mock).mockReturnValue({
      data: null, // Mock an unauthenticated user
      status: 'unauthenticated',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('navigates to sign-in page on "Get Started Now" button click', () => {
    render(<Homepage />);

    const getStartedButton = screen.getByRole('button', { name: /Get Started Now/i });
    fireEvent.click(getStartedButton);

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  test('navigates to sign-in page on "Sign Up Free" button click', () => {
    render(<Homepage />);

    const signUpButton = screen.getByRole('button', { name: /Sign Up Free/i });
    fireEvent.click(signUpButton);

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  test('renders all feature sections correctly', () => {
    render(<Homepage />);

    // Verify that feature headings are rendered
    expect(screen.getByText('Multi-Channel Lead Capture')).toBeInTheDocument();
    expect(screen.getByText('Smart Lead Prioritization')).toBeInTheDocument();
    expect(screen.getByText('Streamlined Deal Closing')).toBeInTheDocument();
  });

  test('renders team empowerment section', () => {
    render(<Homepage />);

    // Verify that the team empowerment section is rendered
    expect(screen.getByText('Empower Your Small Team')).toBeInTheDocument();
    expect(screen.getByText(/Boost your team's efficiency with amigo CRM's powerful analytics/)).toBeInTheDocument();
  });

  test('renders CTA section', () => {
    render(<Homepage />);

    // Verify that the call-to-action section is rendered
    expect(screen.getByText('Transform Your Lead Management Today')).toBeInTheDocument();
    expect(screen.getByText(/Join hundreds of small sales teams already using amigo CRM/)).toBeInTheDocument();
    expect(screen.getByText(/No credit card required. Start using amigo CRM for free today!/)).toBeInTheDocument();
  });
});
