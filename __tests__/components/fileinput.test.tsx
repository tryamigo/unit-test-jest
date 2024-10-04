import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useSession } from 'next-auth/react';
import FileInput from '@/components/files/fileinput';
// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'File uploaded successfully' }),
  })
) as jest.Mock;

describe('FileInput', () => {
  const mockSetIsFileInputOpen = jest.fn();
  const mockFetchData = jest.fn();

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { userid: 'test-user-id' } },
      status: 'authenticated',
    });
  });

  test('renders the component', () => {
    render(<FileInput setIsFileInputOpen={mockSetIsFileInputOpen} fetchData={mockFetchData} />);
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
  });

  test('handles file selection via input', async () => {
    render(<FileInput setIsFileInputOpen={mockSetIsFileInputOpen} fetchData={mockFetchData} />);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByTitle('') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('handles file removal', async () => {
    render(<FileInput setIsFileInputOpen={mockSetIsFileInputOpen} fetchData={mockFetchData} />);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByTitle('') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    const removeButton = screen.getByText('Remove file');
    fireEvent.click(removeButton);

    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  test('handles file upload', async () => {
    render(<FileInput setIsFileInputOpen={mockSetIsFileInputOpen} fetchData={mockFetchData} />);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByTitle('') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    const submitButton = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/files',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    expect(mockSetIsFileInputOpen).toHaveBeenCalledWith(false);
    expect(mockFetchData).toHaveBeenCalled();
  });

  test('handles upload error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

    render(<FileInput setIsFileInputOpen={mockSetIsFileInputOpen} fetchData={mockFetchData} />);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByTitle('') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    const submitButton = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });
  });

  test('handles cancel button click', () => {
    render(<FileInput setIsFileInputOpen={mockSetIsFileInputOpen} fetchData={mockFetchData} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockSetIsFileInputOpen).toHaveBeenCalledWith(false);
  });

  // Note: Testing drag and drop functionality is complex and often unreliable in JSDOM.
  // For a comprehensive test suite, you might want to use a more sophisticated testing setup
  // that can better simulate drag and drop events.
});