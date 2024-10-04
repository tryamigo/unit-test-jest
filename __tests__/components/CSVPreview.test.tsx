import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CSVPreview from '@/components/CSVPreview';

const mockCsvData = [
  ['Header1', 'Header2'],
  ['Data1', 'Data2'],
  // Add more mock data as needed
];

describe('CSVPreview Component', () => {
  const mockHandleBack = jest.fn();
  const mockSetCurrentStep = jest.fn();
  const csvData = [
    { 'Client Name': 'John Doe', 'Phone Number': '+1234567890', 'Email Address': 'john@example.com' },
    { 'Client Name': 'Jane Smith', 'Phone Number': '+0987654321', 'Email Address': 'jane@example.com' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });



  test('calls handleBack when Back button is clicked', () => {
    render(
      <CSVPreview
        csvData={csvData}
        handleBack={mockHandleBack}
        setCurrentStep={mockSetCurrentStep}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });

  test('calls setCurrentStep with "preferences" when Continue button is clicked', () => {
    render(
      <CSVPreview
        csvData={csvData}
        handleBack={mockHandleBack}
        setCurrentStep={mockSetCurrentStep}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(mockSetCurrentStep).toHaveBeenCalledWith('preferences');
  });


});
