import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Timeline from '@/components/Timeline'; // Update with your actual file path
import '@testing-library/jest-dom';
import { handleAddActivity, handleDeleteActivity } from '@/components/helper';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('@/components/helper', () => ({
  getActivityIcon: jest.fn(() => <div>Icon</div>),
  handleDeleteActivity: jest.fn(),
  handleAddActivity: jest.fn(),
  fetchTimeline: jest.fn(),
  formatDateTime: jest.fn((date) => date),
  truncate: jest.fn((text) => text),
}));

describe('Timeline Component', () => {
  const mockSetTimeline = jest.fn();
  const clientId = 'test-client-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const timelineData = [
    {
      id: '1',
      name: 'Phone Call',
      description: 'Called the client to discuss project updates',
      time: '2023-09-30T10:00:00Z',
      record_type: 'phone_call',
    },
    {
      id: '2',
      name: 'Shared Document',
      description: 'Shared a document for review',
      time: '2023-09-30T12:00:00Z',
      record_type: 'shared_file',
    },
  ];

  it('renders the timeline items', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          accessToken: 'mock-token',
        },
      },
      status: 'authenticated',
    });

    render(
      <Timeline timeline={timelineData} setTimeline={mockSetTimeline} clientId={clientId} />
    );

    expect(screen.getByText(/Phone Call/i)).toBeInTheDocument();
    expect(screen.getByText(/Called the client to discuss project updates/i)).toBeInTheDocument();
    expect(screen.getByText(/Shared Document/i)).toBeInTheDocument();
  });



  it('does not render any timeline item if the timeline is empty', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          accessToken: 'mock-token',
        },
      },
      status: 'authenticated',
    });

    render(<Timeline timeline={[]} setTimeline={mockSetTimeline} clientId={clientId} />);

    expect(screen.queryByText(/Phone Call/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Shared Document/i)).not.toBeInTheDocument();
  });
});
