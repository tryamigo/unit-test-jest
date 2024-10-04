import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientDetails from '@/components/clientpage';
// Mock the next-auth/react module
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the helper functions
jest.mock('@/components/helper', () => ({
  fetchClientInfo: jest.fn(),
  fetchTimeline: jest.fn(),
}));

// Mock child components
jest.mock('@/components/followupscheduler', () => () => <div data-testid="follow-up-scheduler" />);
jest.mock('@/components/timeline', () => () => <div data-testid="timeline" />);
jest.mock('@/components/sendquickresponse/quickresponse', () => () => <div data-testid="quick-response" />);
jest.mock('@/components/ClientInfoCart', () => () => <div data-testid="client-info-card" />);

describe('ClientDetails', () => {
  const mockClientInfo = {
    id: '1',
    name: 'John Doe',
    mobile: '1234567890',
    whatsapp: '1234567890',
    email: 'john@example.com',
    notes: 'Some notes',
    status: 'Active',
    user_id: 'user1',
    groups: [],
  };

  beforeEach(() => {
    // Mock useSession
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { accessToken: 'mock-token' } },
      status: 'authenticated',
    });

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

   
    require('@/components/helper').fetchClientInfo.mockResolvedValue(mockClientInfo);
    require('@/components/helper').fetchTimeline.mockResolvedValue([]);

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });
  });

  it('renders client details correctly', async () => {
    render(<ClientDetails id="1" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Send Quick Response')).toBeInTheDocument();
      expect(screen.getByText('Options')).toBeInTheDocument();
      expect(screen.getByTestId('follow-up-scheduler')).toBeInTheDocument();
      expect(screen.getByTestId('client-info-card')).toBeInTheDocument();
      expect(screen.getByTestId('timeline')).toBeInTheDocument();
    });
  });


  // Add more tests as needed for other functionalities
});