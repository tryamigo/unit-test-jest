import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CSVUpload from '@/components/CSVUpload';

describe('CSVUpload Component', () => {
  const mockSetSelectedFile = jest.fn();
  const mockSetMessage = jest.fn();
  const mockSetIsValid = jest.fn();
  const mockSetCSVData = jest.fn();
  const mockSetCurrentStep = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the CSV upload button', () => {
    render(
      <CSVUpload
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
        message=""
        setMessage={mockSetMessage}
        isValid={null}
        setIsValid={mockSetIsValid}
        setCSVData={mockSetCSVData}
        setCurrentStep={mockSetCurrentStep}
      />
    );

    expect(screen.getByText(/Upload CSV/i)).toBeInTheDocument();
  });

  test('displays validation error for non-CSV file', async () => {
    render(
      <CSVUpload
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
        message=""
        setMessage={mockSetMessage}
        isValid={null}
        setIsValid={mockSetIsValid}
        setCSVData={mockSetCSVData}
        setCurrentStep={mockSetCurrentStep}
      />
    );

    const fileInput = screen.getByLabelText(/Upload CSV/i).querySelector('input');
    const file = new File(['dummy content'], 'sample.txt', { type: 'text/plain' });

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockSetMessage).toHaveBeenCalledWith('Please select a CSV file.');
        expect(mockSetIsValid).toHaveBeenCalledWith(false);
        expect(mockSetSelectedFile).toHaveBeenCalledWith(file);
      });
    }
  });

  test('displays validation error for CSV file exceeding 2MB', async () => {
    render(
      <CSVUpload
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
        message=""
        setMessage={mockSetMessage}
        isValid={null}
        setIsValid={mockSetIsValid}
        setCSVData={mockSetCSVData}
        setCurrentStep={mockSetCurrentStep}
      />
    );

    // File size: 2.1MB
    const file = new File([new ArrayBuffer(2.1 * 1024 * 1024)], 'sample.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Upload CSV/i).querySelector('input');

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockSetMessage).toHaveBeenCalledWith('File size should not exceed 2MB.');
        expect(mockSetIsValid).toHaveBeenCalledWith(false);
        expect(mockSetSelectedFile).toHaveBeenCalledWith(file);
      });
    }
  });

  test('validates and accepts a correct CSV file', async () => {
    render(
      <CSVUpload
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
        message=""
        setMessage={mockSetMessage}
        isValid={null}
        setIsValid={mockSetIsValid}
        setCSVData={mockSetCSVData}
        setCurrentStep={mockSetCurrentStep}
      />
    );

    const fileContent = `Client Name,Phone Number,Whatsapp Number,Email Address,Notes
John Doe,+1234567890,+1234567890,johndoe@example.com,Test note`;
    const file = new File([fileContent], 'sample.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Upload CSV/i).querySelector('input');

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockSetSelectedFile).toHaveBeenCalledWith(file);
        expect(mockSetMessage).toHaveBeenCalledWith('CSV format is valid.');
        expect(mockSetIsValid).toHaveBeenCalledWith(true);
        expect(mockSetCSVData).toHaveBeenCalledWith([
          {
            'Client Name': 'John Doe',
            'Phone Number': '+1234567890',
            'Whatsapp Number': '+1234567890',
            'Email Address': 'johndoe@example.com',
            'Notes': 'Test note',
          },
        ]);
        expect(mockSetCurrentStep).toHaveBeenCalledWith('preview');
      });
    }
  });

  test('handles file removal', () => {
    render(
      <CSVUpload
        selectedFile={new File(['dummy content'], 'sample.csv', { type: 'text/csv' })}
        setSelectedFile={mockSetSelectedFile}
        message="CSV format is valid."
        setMessage={mockSetMessage}
        isValid={true}
        setIsValid={mockSetIsValid}
        setCSVData={mockSetCSVData}
        setCurrentStep={mockSetCurrentStep}
      />
    );

    const removeButton = screen.getByRole('button', { name: /Remove File/i });
    fireEvent.click(removeButton);

    expect(mockSetSelectedFile).toHaveBeenCalledWith(null);
    expect(mockSetMessage).toHaveBeenCalledWith('');
    expect(mockSetIsValid).toHaveBeenCalledWith(null);
    expect(mockSetCSVData).toHaveBeenCalledWith([]);
  });
});
