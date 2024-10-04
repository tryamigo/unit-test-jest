import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import QuickResponse from '@/components/sendquickresponse/quickresponse';

// Mock necessary hooks and components
jest.mock('next-auth/react');
jest.mock('@/hooks/use-toast');
jest.mock('@/components/messages/message', () => () => <div data-testid="message-cart">Message Cart</div>);
jest.mock('@/components/files/fileinput', () => () => <div data-testid="file-input">File Input</div>);

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve(new Response(JSON.stringify({}), {
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
  }))
) as jest.Mock;

Object.defineProperty(window, 'open', {
  value: jest.fn(),
});

describe('QuickResponse Component', () => {
  const mockSession = {
    data: {
      user: {
        id: 'user123',
        name: 'Test User',
        teamId: 'team123',
        email: 'test@example.com',
        accessToken: 'mockAccessToken',
      },
    },
    status: 'authenticated',
  };

  const mockToast = {
    toast: jest.fn(),
  };

  const mockClient = {
    id: 'client123',
    name: 'Client Test',
    email: 'client@example.com',
    mobile: '1234567890',
    whatsapp: '0987654321',
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  test('handles sending a message via email', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 'msg1', title: 'Test Message', template: 'Hello, @clientName' }],
    } as Response);

    render(<QuickResponse user_id="user123" client={mockClient} setIsQuickResponseOpen={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/messages/send_messages?teamId=team123`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer mockAccessToken`,
          }),
          body: JSON.stringify({ messageId: 'msg1', clientId: 'client123' }),
        })
      );
    });

    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('mailto:'), '_blank');
  });

  test('shows error toast when data fetch fails', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<QuickResponse user_id="user123" client={mockClient} setIsQuickResponseOpen={jest.fn()} />);

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive',
      }));
    });
  });
});
