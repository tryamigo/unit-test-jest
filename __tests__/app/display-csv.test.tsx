import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableDisplay from '@/app/display-csv/page';

// Mock the UI components
jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));

// Mock fetch function
global.fetch = jest.fn();

describe('TableDisplay', () => {
  const mockCsvData = [
    {
      user_id: '1',
      csv_data: [
        { name: 'John', age: '30', city: 'New York' },
        { name: 'Jane', age: '25', city: 'Los Angeles' },
      ],
    },
    {
      user_id: '2',
      csv_data: [
        { product: 'Apple', price: '1.00', quantity: '100' },
        { product: 'Banana', price: '0.50', quantity: '200' },
      ],
    },
  ];

  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockCsvData),
    });
  });

  it('renders the component title', async () => {
    render(<TableDisplay />);
    expect(screen.getByText('CSV Data Tables')).toBeInTheDocument();
  });

  it('fetches and displays CSV data', async () => {
    render(<TableDisplay />);
    await waitFor(() => {
      expect(screen.getByText('User ID: 1')).toBeInTheDocument();
      expect(screen.getByText('User ID: 2')).toBeInTheDocument();
    });
  });

  it('renders correct table headers for each user', async () => {
    render(<TableDisplay />);
    await waitFor(() => {
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('age')).toBeInTheDocument();
      expect(screen.getByText('city')).toBeInTheDocument();
      expect(screen.getByText('product')).toBeInTheDocument();
      expect(screen.getByText('price')).toBeInTheDocument();
      expect(screen.getByText('quantity')).toBeInTheDocument();
    });
  });

  it('renders correct data for each user', async () => {
    render(<TableDisplay />);
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('1.00')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('displays "No data available" when there is no CSV data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    render(<TableDisplay />);
    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    console.error = jest.fn(); // Mock console.error
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));
    render(<TableDisplay />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching CSV data:', expect.any(Error));
    });
  });

  it('renders the correct number of tables', async () => {
    render(<TableDisplay />);
    await waitFor(() => {
      const tables = screen.getAllByRole('table');
      expect(tables).toHaveLength(2);
    });
  });

  it('renders the correct number of rows for each table', async () => {
    render(<TableDisplay />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // 2 header rows + 4 data rows (2 for each table)
      expect(rows).toHaveLength(6);
    });
  });
});