import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import MessageTemplate from '@/components/messages/message';
// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock use-toast
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: '1', title: 'Test Template', template: 'Test Message' }),
  })
) as jest.Mock;

describe('MessageTemplate', () => {
  const mockFetchMessages = jest.fn();
  const mockSetIsMessageCartOpen = jest.fn();

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { teamId: '1', id: '1', accessToken: 'mock-token' } },
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
  });

  test('renders the component', () => {
    render(<MessageTemplate user_id="1" fetchMessages={mockFetchMessages} setIsMessageCartOpen={mockSetIsMessageCartOpen} />);
    expect(screen.getByText('New Message Template')).toBeInTheDocument();
  });

  test('allows input in title and message fields', () => {
    render(<MessageTemplate user_id="1" fetchMessages={mockFetchMessages} setIsMessageCartOpen={mockSetIsMessageCartOpen} />);
    const titleInput = screen.getByLabelText('Title');
    const messageInput = screen.getByLabelText('Template Message');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    expect(titleInput).toHaveValue('Test Title');
    expect(messageInput).toHaveValue('Test Message');
  });

  test('submits the form and calls API', async () => {
    render(<MessageTemplate user_id="1" fetchMessages={mockFetchMessages} setIsMessageCartOpen={mockSetIsMessageCartOpen} />);
    const titleInput = screen.getByLabelText('Title');
    const messageInput = screen.getByLabelText('Template Message');
    const submitButton = screen.getByText('Save Template');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/messages'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: 'Test Title',
            template: 'Test Message',
            user_id: '1',
          }),
        })
      );
    });

    expect(mockFetchMessages).toHaveBeenCalled();
    expect(mockSetIsMessageCartOpen).toHaveBeenCalledWith(false);
  });


  test('disables submit button when fields are empty', () => {
    render(<MessageTemplate user_id="1" fetchMessages={mockFetchMessages} setIsMessageCartOpen={mockSetIsMessageCartOpen} />);
    const submitButton = screen.getByText('Save Template');
    expect(submitButton).toBeDisabled();

    const titleInput = screen.getByLabelText('Title');
    const messageInput = screen.getByLabelText('Template Message');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    expect(submitButton).not.toBeDisabled();
  });
});