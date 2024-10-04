import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Client from '@/app/clients/[id]/page';
import { Head } from 'next/document';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the components used in Client
jest.mock('@/components/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('@/components/clientpage', () => ({ id }: { id: string }) => <div data-testid="mock-client-page">Client Page {id}</div>);

describe('Client Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Provide a default mock implementation for useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      // Add any other router methods you're using in your component
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:3000/clients/123' },
      writable: true,
    });
  });

  it('renders without crashing', () => {
    render(<Client params={{ id: '123' }} />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-client-page')).toBeInTheDocument();
  });

  it('passes the correct id to ClientPage', () => {
    render(<Client params={{ id: '456' }} />);
    expect(screen.getByText('Client Page 456')).toBeInTheDocument();
  });

});