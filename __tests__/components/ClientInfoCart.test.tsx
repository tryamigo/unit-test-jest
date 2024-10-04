import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import ClientInfoCard from '@/components/ClientInfoCart';
// Mock the next-auth/react module
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('ClientInfoCard', () => {
  const mockClientInfo = {
    id: '1',
    name: 'John Doe',
    mobile: '1234567890',
    whatsapp: '1234567890',
    email: 'john@example.com',
    notes: 'Some notes',
    status: 'New Lead',
    groups: [],
  };

  const mockSetClientInfo = jest.fn();

  beforeEach(() => {
    // Mock useSession
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { accessToken: 'mock-token', teamId: 'team1' } },
      status: 'authenticated',
    });
  });

  it('renders client info correctly', () => {
    render(<ClientInfoCard clientInfo={mockClientInfo} setClientInfo={mockSetClientInfo} />);

    expect(screen.getByText('Client Info')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('MOBILE NUMBER')).toBeInTheDocument();
    expect(screen.getByText('WHATSAPP NUMBER')).toBeInTheDocument();
    expect(screen.getAllByText('1234567890')).toHaveLength(2);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Some notes')).toBeInTheDocument();
    expect(screen.getByText('New Lead')).toBeInTheDocument();
  });



  it('opens groups popup when clicked', () => {
    render(<ClientInfoCard clientInfo={mockClientInfo} setClientInfo={mockSetClientInfo} />);

    fireEvent.click(screen.getByText('Click to add groups'));

    expect(screen.getByPlaceholderText('Search Groups')).toBeInTheDocument();
    expect(screen.getByText('CREATE NEW GROUP')).toBeInTheDocument();
  });

  it('opens create group dialog when "CREATE NEW GROUP" is clicked', async () => {
    render(<ClientInfoCard clientInfo={mockClientInfo} setClientInfo={mockSetClientInfo} />);

    fireEvent.click(screen.getByText('Click to add groups'));
    fireEvent.click(screen.getByText('CREATE NEW GROUP'));

    await waitFor(() => {
      expect(screen.getByText('Create new group')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('GROUP NAME')).toBeInTheDocument();
    expect(screen.getByText('GROUP COLOUR')).toBeInTheDocument();
  });

  // Add more tests as needed for other functionalities
});