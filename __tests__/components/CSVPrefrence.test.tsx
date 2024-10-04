import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImportPreferences from '@/components/CSVPrefrence';

describe('ImportPreferences Component', () => {
  const mockHandleBack = jest.fn();
  const mockHandleUpload = jest.fn();
  const initialDateTime = new Date();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with initial state', () => {
    render(
      <ImportPreferences 
        handleBack={mockHandleBack} 
        handleUpload={mockHandleUpload} 
        isUploading={false}
      />
    );

    // Verify that headings are rendered
    expect(screen.getByText('Import Preferences')).toBeInTheDocument();
    expect(screen.getByText('Date Added')).toBeInTheDocument();
    expect(screen.getByText('Mark as Uncontacted')).toBeInTheDocument();
    expect(screen.getByText('Skip Duplicated Contacts')).toBeInTheDocument();

    // Verify that buttons are rendered
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument();
  });

  test('calls handleBack when back button is clicked', () => {
    render(
      <ImportPreferences 
        handleBack={mockHandleBack} 
        handleUpload={mockHandleUpload} 
        isUploading={false}
      />
    );

    // Click the Back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    // Verify that handleBack was called
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });

  test('calls handleUpload when import button is clicked', () => {
    render(
      <ImportPreferences 
        handleBack={mockHandleBack} 
        handleUpload={mockHandleUpload} 
        isUploading={false}
      />
    );

    // Click the Import button
    fireEvent.click(screen.getByRole('button', { name: /import/i }));

    // Verify that handleUpload was called
    expect(mockHandleUpload).toHaveBeenCalledTimes(1);
  });

  test('disables import button when isUploading is true', () => {
    render(
      <ImportPreferences 
        handleBack={mockHandleBack} 
        handleUpload={mockHandleUpload} 
        isUploading={true}
      />
    );

    // Verify that the Import button is disabled
    expect(screen.getByRole('button', { name: /importing\.\.\./i })).toBeDisabled();
  });
});
