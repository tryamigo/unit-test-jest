import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FacebookAuthPage from '@/app/integrations/facebook/page';

// Mock the components and modules
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer" />);
jest.mock('next/link', () => ({ children }: { children: React.ReactNode }) => children);

// Mock window.FB
const mockFB = {
  init: jest.fn(),
  getLoginStatus: jest.fn(),
  login: jest.fn(),
  api: jest.fn(),
  logout: jest.fn(),
};

// Mock the Facebook SDK initialization
jest.mock('@/app/integrations/facebook/page', () => {
  const originalModule = jest.requireActual('@/app/integrations/facebook/page');
  return {
    ...originalModule,
    __esModule: true,
    default: () => {
      const { useEffect } = jest.requireActual('react');
      useEffect(() => {
        // Mock the FB SDK initialization
        window.fbAsyncInit();
      }, []);
      return originalModule.default();
    },
  };
});

describe('FacebookAuthPage', () => {
  beforeEach(() => {
    // @ts-ignore
    global.window.FB = mockFB;
    global.window.fbAsyncInit = jest.fn().mockImplementation(() => {
      mockFB.init({ appId: '123456789', version: 'v12.0' });
    });
  });

  it('renders the header', () => {
    render(<FacebookAuthPage />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('displays the correct title and description', () => {
    render(<FacebookAuthPage />);
    expect(screen.getByText('Facebook Integration')).toBeInTheDocument();
    expect(screen.getByText('Connect your Facebook account')).toBeInTheDocument();
  });

  it('shows login button when user is not logged in', () => {
    mockFB.getLoginStatus.mockImplementation((callback) => {
      callback({ status: 'not_authorized' });
    });
    render(<FacebookAuthPage />);
    expect(screen.getByText('Login with Facebook')).toBeInTheDocument();
  });

  it('calls FB.login when login button is clicked', () => {
    mockFB.getLoginStatus.mockImplementation((callback) => {
      callback({ status: 'not_authorized' });
    });
    render(<FacebookAuthPage />);
    const loginButton = screen.getByText('Login with Facebook');
    fireEvent.click(loginButton);
    expect(mockFB.login).toHaveBeenCalled();
  });

  it('displays user info when logged in', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    mockFB.getLoginStatus.mockImplementation((callback) => {
      callback({ status: 'connected' });
    });
    mockFB.api.mockImplementation((path, options, callback) => {
      callback(mockUser);
    });

    await act(async () => {
      render(<FacebookAuthPage />);
    });

    expect(screen.getByText(`Logged in as: ${mockUser.name}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
  });

  it('shows logout button when user is logged in', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    mockFB.getLoginStatus.mockImplementation((callback) => {
      callback({ status: 'connected' });
    });
    mockFB.api.mockImplementation((path, options, callback) => {
      callback(mockUser);
    });

    await act(async () => {
      render(<FacebookAuthPage />);
    });

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls FB.logout when logout button is clicked', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    mockFB.getLoginStatus.mockImplementation((callback) => {
      callback({ status: 'connected' });
    });
    mockFB.api.mockImplementation((path, options, callback) => {
      callback(mockUser);
    });

    await act(async () => {
      render(<FacebookAuthPage />);
    });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockFB.logout).toHaveBeenCalled();
  });

  it('displays the correct breadcrumb', () => {
    render(<FacebookAuthPage />);
    expect(screen.getByText('Integrations')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });
});