import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import StepByStepCart from '@/components/contactcart';

// Mock the useSession hook from next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('StepByStepCart Component', () => {
  const mockSession = {
    data: {
      user: {
        userid: 'test-user-id',
      },
    },
    status: 'authenticated',
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue(mockSession);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial form with mobile number input', () => {
    render(<StepByStepCart />);

    // Check that mobile number input is rendered
    expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument();
    // Check that the "Next" button is rendered
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  test('displays an error when an invalid mobile number is entered', () => {
    render(<StepByStepCart />);

    // Enter invalid mobile number
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Verify error message
    expect(screen.getByText('Please enter a valid 10-digit mobile number.')).toBeInTheDocument();
  });

  test('navigates to WhatsApp number step on valid mobile number', () => {
    render(<StepByStepCart />);

    // Enter valid mobile number
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Verify that the WhatsApp number input is rendered
    expect(screen.getByLabelText('WhatsApp Number')).toBeInTheDocument();
    // Verify that the "Submit" button is rendered
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('displays an error when an invalid WhatsApp number is entered', () => {
    render(<StepByStepCart />);

    // Navigate to WhatsApp step
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Enter invalid WhatsApp number
    fireEvent.change(screen.getByLabelText('WhatsApp Number'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Verify error message
    expect(screen.getByText('Please enter a valid 10-digit WhatsApp number.')).toBeInTheDocument();
  });


  test('navigates back to the mobile number step', () => {
    render(<StepByStepCart />);

    // Navigate to WhatsApp step
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Click back button
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));

    // Verify that mobile number input is rendered again
    expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument();
  });
});
