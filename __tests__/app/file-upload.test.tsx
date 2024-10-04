import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/file-upload/page';

// Mock the next-auth session
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  CardFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  Download: () => <span>Download Icon</span>,
  Upload: () => <span>Upload Icon</span>,
  FileUp: () => <span>FileUp Icon</span>,
  CheckCircle2: () => <span>CheckCircle2 Icon</span>,
  X: () => <span>X Icon</span>,
}));

describe('FileUpload', () => {
  const mockSession = { user: { id: 'test-user-id' } };
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the component', () => {
    render(<FileUpload />);
    expect(screen.getByText('Import Clients')).toBeInTheDocument();
  });

  it('displays file input and upload button', () => {
    render(<FileUpload />);
    expect(screen.getByText('Choose CSV file')).toBeInTheDocument();
    expect(screen.getByText('Upload and Import')).toBeInTheDocument();
  });

  it('shows error message for non-CSV file', async () => {
    render(<FileUpload />);
    const input = screen.getByLabelText('Choose CSV file');
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Please select a CSV file.')).toBeInTheDocument();
    });
  });

  it('shows error message for file size exceeding limit', async () => {
    render(<FileUpload />);
    const input = screen.getByLabelText(/choose csv file/i);
    const file = new File(['test'.repeat(3 * 1024 * 1024)], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('File size should not exceed 10MB.')).toBeInTheDocument();
    });
  });

  it('validates CSV format', async () => {
    render(<FileUpload />);
    const input = screen.getByLabelText(/choose csv file/i);
    const file = new File(['Client Name,Display Name,Phone Number,Email Address,Notes'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('CSV format is valid.')).toBeInTheDocument();
    });
  });

  it('shows error for invalid CSV format', async () => {
    render(<FileUpload />);
    const input = screen.getByLabelText(/choose csv file/i);
    const file = new File(['Invalid,Headers'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Invalid CSV format. Please ensure all required columns are present.')).toBeInTheDocument();
    });
  });

  it('allows file removal', async () => {
    render(<FileUpload />);
    const input = screen.getByLabelText(/choose csv file/i);
    const file = new File(['Client Name,Display Name,Phone Number,Email Address,Notes'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remove File'));

    await waitFor(() => {
      expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
    });
  });

  it('handles file upload', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Upload successful' }),
    });

    render(<FileUpload />);
    const input = screen.getByLabelText(/choose csv file/i);
    const file = new File(['Client Name,Display Name,Phone Number,Email Address,Notes'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('CSV format is valid.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Upload and Import'));

    await waitFor(() => {
      expect(screen.getByText('Upload successful')).toBeInTheDocument();
    });
  });

  it('handles upload error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Upload failed'));

    render(<FileUpload />);
    const input = screen.getByLabelText('Choose CSV file');
    const file = new File(['Client Name,Display Name,Phone Number,Email Address,Notes'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('CSV format is valid.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Upload and Import'));

    await waitFor(() => {
      expect(screen.getByText('An error occurred during the upload.')).toBeInTheDocument();
    });
  });

  it('navigates back when back button is clicked', () => {
    render(<FileUpload />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockRouter.push).toHaveBeenCalledWith('/integration');
  });
});