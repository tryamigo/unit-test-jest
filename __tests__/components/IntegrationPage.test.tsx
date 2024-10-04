import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IntegrationPage from '@/components/IntegrationPage'; // Update path if needed
import { useRouter } from 'next/navigation';

// Mock useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('IntegrationPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<IntegrationPage />);
    expect(screen.getByText('Integrations')).toBeInTheDocument();
  });

  it('navigates to Facebook integration page when the Facebook card is clicked', () => {
    render(<IntegrationPage />);
    
    const facebookCard = screen.getByText('Connect your Facebook account to capture leads from ads.');
    fireEvent.click(facebookCard);

    expect(mockPush).toHaveBeenCalledWith('/integrations/facebook');
  });


});
