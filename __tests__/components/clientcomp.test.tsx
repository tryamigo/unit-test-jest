import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientDetails from '@/components/clientcomp';

// Mock the next-auth/react module
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('ClientDetails', () => {
  beforeEach(() => {
    // Mock useSession
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { accessToken: 'mock-token', id: 'user1', teamId: 'team1' } },
      status: 'authenticated',
    });

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it('renders the component and fetches clients', async () => {
    render(<ClientDetails />);

    // Wait for the component to render and fetch data
    await waitFor(() => {
      expect(screen.getByText('Clients')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Search Clients')).toBeInTheDocument();
    
    // Check if the "ADD NEW CLIENT" button is present
    const addButton = screen.getByRole('button', { name: /add new client/i });
    expect(addButton).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/clients?teamId=team1',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json'
          }
        })
      );
    });
  });

  it('opens add client dialog when button is clicked', async () => {
    render(<ClientDetails />);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Clients')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add new client/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Client')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mobile')).toBeInTheDocument();
      expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument();
    });
  });



  it('filters clients based on search term', async () => {
    const mockClients = [
      { id: '1', name: 'John Doe', email: 'john@example.com', mobile: '1234567890', status: 'Contacted', time: '2023-01-01' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', mobile: '0987654321', status: 'Uncontacted', time: '2023-01-02' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockClients),
    });

    render(<ClientDetails />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search Clients'), { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });


});