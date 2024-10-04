import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import MessageTable from '@/components/messages/meassagetable';
// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the helper functions
jest.mock('@/components/helper', () => ({
  truncate: jest.fn((str, length) => str.substring(0, length) + '...'),
  formatDateTime: jest.fn((date) => '2023-01-01 12:00'),
}));

describe('MessageTable Component', () => {
  const mockMessages = [
    { id: '1', title: 'Message 1', template: 'Template 1', sendCount: 5, lastSentTime: '2023-01-01T12:00:00Z' },
    { id: '2', title: 'Message 2', template: 'Template 2', sendCount: 3, lastSentTime: null },
  ];

  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('renders desktop view for larger screens', () => {
    render(<MessageTable messages={mockMessages} />);
    
    const desktopView = screen.getByRole('table');
    expect(within(desktopView).getByText('TITLE')).toBeInTheDocument();
    expect(within(desktopView).getByText('MESSAGE PREVIEW')).toBeInTheDocument();
    expect(within(desktopView).getByText('SENT')).toBeInTheDocument();
    expect(within(desktopView).getByText('LAST SENT')).toBeInTheDocument();
    
    expect(within(desktopView).getByText('Message 1')).toBeInTheDocument();
    expect(within(desktopView).getByText('Template 1...')).toBeInTheDocument();
    expect(within(desktopView).getByText('5')).toBeInTheDocument();
    expect(within(desktopView).getByText('2023-01-01 12:00')).toBeInTheDocument();
    
    expect(within(desktopView).getByText('Message 2')).toBeInTheDocument();
    expect(within(desktopView).getByText('Template 2...')).toBeInTheDocument();
    expect(within(desktopView).getByText('3')).toBeInTheDocument();
    expect(within(desktopView).getByText('-')).toBeInTheDocument();
  });


  test('navigates to content page when a message is clicked', () => {
    render(<MessageTable messages={mockMessages} />);
    
    const desktopView = screen.getByRole('table');
    fireEvent.click(within(desktopView).getByText('Message 1'));
    expect(mockPush).toHaveBeenCalledWith('/content/1');

    fireEvent.click(within(desktopView).getByText('Message 2'));
    expect(mockPush).toHaveBeenCalledWith('/content/2');
  });

  test('handles empty messages array', () => {
    render(<MessageTable messages={[]} />);
    
    const desktopView = screen.getByRole('table');
    expect(within(desktopView).getByText('TITLE')).toBeInTheDocument();
    expect(within(desktopView).getByText('MESSAGE PREVIEW')).toBeInTheDocument();
    expect(within(desktopView).getByText('SENT')).toBeInTheDocument();
    expect(within(desktopView).getByText('LAST SENT')).toBeInTheDocument();
    
    expect(screen.queryByText('Message 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Message 2')).not.toBeInTheDocument();
  });
});