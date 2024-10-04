import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowUpScheduler from '@/components/followupscheduler';
import { formatDateTime } from '@/components/helper';

// Mocking the DateTimeInput component
jest.mock('@/components/DateTimeInput', () => ({
  initialDate,
  initialTime,
  onDateChange,
  onTimeChange,
}: {
  initialDate: Date | null;
  initialTime: { hours: string; minutes: string; period: string } | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: { hours: string; minutes: string; period: string }) => void;
}) => (
  <div>
    <label htmlFor="date-input">Date:</label>
    <input
      id="date-input"
      type="date"
      value={initialDate ? initialDate.toISOString().split('T')[0] : ''}
      onChange={(e) => onDateChange(new Date(e.target.value))}
    />
    <label htmlFor="time-input">Time:</label>
    <input
      id="time-input"
      type="time"
      value={initialTime ? `${initialTime.hours}:${initialTime.minutes}` : ''}
      onChange={(e) => {
        const [hours, minutes] = e.target.value.split(':');
        const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
        onTimeChange({ hours, minutes, period });
      }}
    />
  </div>
));

describe('FollowUpScheduler Component', () => {
  const mockOnScheduleFollowUp = jest.fn();
  const mockOnRemoveFollowUp = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with no follow-up scheduled', () => {
    render(
      <FollowUpScheduler
        currentFollowUp={undefined}
        onScheduleFollowUp={mockOnScheduleFollowUp}
        onRemoveFollowUp={mockOnRemoveFollowUp}
      />
    );

    // Verify button displays correct initial text
    expect(screen.getByRole('button', { name: /No follow up scheduled/i })).toBeInTheDocument();
  });

  test('renders with a current follow-up scheduled', () => {
    const followUpDate = '2024-10-03T10:00:00Z';
    render(
      <FollowUpScheduler
        currentFollowUp={followUpDate}
        onScheduleFollowUp={mockOnScheduleFollowUp}
        onRemoveFollowUp={mockOnRemoveFollowUp}
      />
    );

    // Verify button displays correct follow-up text
    expect(screen.getByText(`Follow Up: ${formatDateTime(followUpDate)}`)).toBeInTheDocument();
  });

  test('opens popover when clicking the button', () => {
    render(
      <FollowUpScheduler
        currentFollowUp={undefined}
        onScheduleFollowUp={mockOnScheduleFollowUp}
        onRemoveFollowUp={mockOnRemoveFollowUp}
      />
    );

    const triggerButton = screen.getByRole('button', { name: /No follow up scheduled/i });
    fireEvent.click(triggerButton);

    // Verify that the popover content appears
    expect(screen.getByLabelText('Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('Time:')).toBeInTheDocument();
  });


  test('calls onRemoveFollowUp when remove button is clicked', () => {
    render(
      <FollowUpScheduler
        currentFollowUp="2024-10-03T10:00:00Z"
        onScheduleFollowUp={mockOnScheduleFollowUp}
        onRemoveFollowUp={mockOnRemoveFollowUp}
      />
    );

    // Open the popover
    fireEvent.click(screen.getByRole('button', { name: /Follow Up: /i }));

    // Click Remove Follow Up button
    fireEvent.click(screen.getByRole('button', { name: /Remove follow up/i }));

    // Verify onRemoveFollowUp was called
    expect(mockOnRemoveFollowUp).toHaveBeenCalled();
  });
});
