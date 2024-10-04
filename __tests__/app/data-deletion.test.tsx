import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataDeletionPage from '@/app/data-deletion/page';

// Mock the components and modules
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));
jest.mock('lucide-react', () => ({
  Mail: () => <span data-testid="mail-icon">Mail Icon</span>,
}));
jest.mock('@/components/footer', () => () => <footer data-testid="mock-footer">Footer</footer>);
jest.mock('@/components/header', () => () => <header data-testid="mock-header">Header</header>);

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('DataDeletionPage', () => {
  beforeEach(() => {
    render(<DataDeletionPage />);
  });

  it('renders without crashing', () => {
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    expect(screen.getByText('Data Deletion Request')).toBeInTheDocument();
  });

  it('displays the instructions for data deletion', () => {
    expect(screen.getByText(/Removing Your Facebook Profile Data/i)).toBeInTheDocument();
    expect(screen.getByText(/We value your privacy/i)).toBeInTheDocument();
  });

  it('lists the steps for data deletion request', () => {
    expect(screen.getByText(/Send an email to our support team/i)).toBeInTheDocument();
    expect(screen.getByText(/Use the subject line:/i)).toBeInTheDocument();
    expect(screen.getByText(/In the body of the email, please include:/i)).toBeInTheDocument();
  });

  it('displays the contact support button', () => {
    const button = screen.getByRole('button', { name: /Contact Support/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('opens email client when contact support button is clicked', () => {
    const button = screen.getByRole('button', { name: /Contact Support/i });
    fireEvent.click(button);

    expect(mockOpen).toHaveBeenCalledWith(
      'mailto:support@amigo.gg?subject=Facebook%20Data%20Deletion%20Request',
      '_blank'
    );
  });

  it('has correct title tag', () => {
    expect(document.title).toBe('Data Deletion Request - Amigo');
  });
});