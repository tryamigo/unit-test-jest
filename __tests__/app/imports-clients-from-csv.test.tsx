import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/integrations/import-clients-from-csv/page';

// Mock the components and hooks
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/CSVUpload', () => ({ setCurrentStep }: any) => (
  <div data-testid="csv-upload">
    <button onClick={() => setCurrentStep('preview')}>Next</button>
  </div>
));
jest.mock('@/components/CSVPreview', () => ({ setCurrentStep }: any) => (
  <div data-testid="csv-preview">
    <button onClick={() => setCurrentStep('preferences')}>Next</button>
    <button onClick={() => setCurrentStep('upload')}>Back</button>
  </div>
));
jest.mock('@/components/CSVPrefrence', () => ({ handleUpload }: any) => (
  <div data-testid="csv-preferences">
    <button onClick={() => handleUpload('2023-01-01', 'active', true)}>Upload</button>
  </div>
));
jest.mock('@/components/CSVSucess', () => ({ onDone }: any) => (
  <div data-testid="csv-success">
    <button onClick={onDone}>Done</button>
  </div>
));

describe('FileUpload Component', () => {
  const mockSession = {
    user: { accessToken: 'mock-token', teamId: 'mock-team-id' },
  };
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ importedCount: 10, skippedCount: 2 }),
      })
    ) as jest.Mock;
  });

  it('renders the header', () => {
    render(<FileUpload />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('displays the correct title and description', () => {
    render(<FileUpload />);
    const titleElements = screen.getAllByText('Import Clients from CSV');
    expect(titleElements[0]).toBeInTheDocument();
    expect(screen.getByText(/Select the CSV file containing the list of contacts/)).toBeInTheDocument();
  });

  it('starts with the upload step', () => {
    render(<FileUpload />);
    expect(screen.getByTestId('csv-upload')).toBeInTheDocument();
  });


});