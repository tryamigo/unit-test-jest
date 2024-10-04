import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Files from '@/app/files/[id]/page';

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  File: () => <div data-testid="file-icon">File Icon</div>,
  FileImage: () => <div data-testid="file-image-icon">File Image Icon</div>,
  FileText: () => <div data-testid="file-text-icon">File Text Icon</div>,
}));

// Mock fetch function
global.fetch = jest.fn();

describe('Files Component', () => {
  const mockParams = { id: 'test-file-id' };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    render(<Files params={mockParams} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('renders file info for a PDF file', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        ownerName: 'John Doe',
        recipientName: 'Jane Smith',
        fileTitle: 'test.pdf'
      }])
    });

    render(<Files params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('Shared by: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Shared with: Jane Smith')).toBeInTheDocument();
      expect(screen.getByTitle('PDF Viewer')).toBeInTheDocument();
    });
  });


  it('handles fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Files params={mockParams} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching file info:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('handles non-OK response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Files params={mockParams} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching file info:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});