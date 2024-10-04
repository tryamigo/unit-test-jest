import React from 'react';
import { render, screen } from '@testing-library/react';
import FileTable from '@/components/files/filestable';

describe('FileTable', () => {
  const mockFiles = [
    { id: '1', title: 'File 1', sent: '5', lastSent: '2023-05-01' },
    { id: '2', title: 'File 2', sent: '3', lastSent: '2023-05-02' },
    { id: '3', title: 'File 3', sent: '7', lastSent: '2023-05-03' },
  ];

  test('renders the table headers when files are provided', () => {
    render(<FileTable files={mockFiles} />);
    expect(screen.getByText('TITLE')).toBeInTheDocument();
    expect(screen.getByText('SENT')).toBeInTheDocument();
    expect(screen.getByText('LAST SENT')).toBeInTheDocument();
  });

  test('renders file data correctly', () => {
    render(<FileTable files={mockFiles} />);
    mockFiles.forEach(file => {
      expect(screen.getByText(file.title)).toBeInTheDocument();
      expect(screen.getByText(file.sent)).toBeInTheDocument();
      expect(screen.getByText(file.lastSent)).toBeInTheDocument();
    });
  });



  test('renders correct number of rows', () => {
    render(<FileTable files={mockFiles} />);
    // +1 for the header row
    expect(screen.getAllByRole('row')).toHaveLength(mockFiles.length + 1);
  });

 
  test('logs files to console on mount and update', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const { rerender } = render(<FileTable files={mockFiles} />);
    expect(consoleSpy).toHaveBeenCalledWith(mockFiles);

    const newFiles = [...mockFiles, { id: '4', title: 'File 4', sent: '2', lastSent: '2023-05-04' }];
    rerender(<FileTable files={newFiles} />);
    expect(consoleSpy).toHaveBeenCalledWith(newFiles);

    consoleSpy.mockRestore();
  });
});