import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import SignIn from '@/app/sign-in/page';

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/GoogleSignInButton', () => () => <button>Sign in with Google</button>);

describe('SignInPage Component', () => {
  const mockRouter = { push: jest.fn() };
  const mockSearchParams = { get: jest.fn() };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: "unauthenticated" });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue('/');
  });


  it('switches to registration form when "Register" is clicked', () => {
    render(<SignIn />);
    fireEvent.click(screen.getByText("Don't have an account? Register"));
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('displays error when passwords do not match during registration', async () => {
    render(<SignIn />);
    fireEvent.click(screen.getByText("Don't have an account? Register"));
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('calls signIn function with correct parameters on form submission', async () => {
    render(<SignIn />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
        action: 'login',
        callbackUrl: '/'
      });
    });
  });

  it('displays error message when sign in fails', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
    
    render(<SignIn />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('redirects to callbackUrl on successful sign in', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
    mockSearchParams.get.mockReturnValue('/dashboard');
    
    render(<SignIn />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects to callbackUrl if user is already authenticated', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { accessToken: 'token' } }, status: "authenticated" });
    mockSearchParams.get.mockReturnValue('/profile');
    
    render(<SignIn />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });
  });

  it('renders Google Sign In button', () => {
    render(<SignIn />);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });
});