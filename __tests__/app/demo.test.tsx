import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import RealEstateListings from '@/app/demo/page';

// Mock the UI components
jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <div>Select Value</div>,
}));

describe('RealEstateListings', () => {
  beforeEach(() => {
    render(<RealEstateListings />);
  });

  it('renders the component title', () => {
    expect(screen.getByText('Real Estate Listings')).toBeInTheDocument();
  });

  it('renders two tables', () => {
    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(2);
  });

  // it('renders correct table headers for both tables', () => {
  //   const headers1 = ['Name', 'Contact', 'Closed Deals', 'City', 'Current Status', 'Update Status'];
  //   const headers2 = ['Name', 'Contact', 'Status', 'Closed Deals', 'City', 'Action'];

  //   headers1.forEach((header, index) => {
  //     expect(screen.getAllByText(header)[0]).toBeInTheDocument();
  //   });

  //   headers2.forEach((header, index) => {
  //     expect(screen.getAllByText(header)[1]).toBeInTheDocument();
  //   });
  // });

  it('renders correct number of rows based on initial listings', () => {
    const rows = screen.getAllByRole('row');
    // 2 header rows + 5 data rows for each table
    expect(rows).toHaveLength(12);
  });

  it('renders correct data for each listing', () => {
    expect(screen.getAllByText('Ace Acres')).toHaveLength(2);
    expect(screen.getAllByText('9560613903')).toHaveLength(2);
    expect(screen.getAllByText('1000 closed')).toHaveLength(6);
    expect(screen.getAllByText('Gurgaon')).toHaveLength(10);
    expect(screen.getAllByText('Active')).toHaveLength(14); // Adjust this number based on your actual implementation
  });

  it('renders status update buttons for each listing in the first table', () => {
    const statusButtons = screen.getAllByRole('button', { name: /Active|Inactive|Pending|Closed/ });
    expect(statusButtons).toHaveLength(20); // 4 buttons for each of the 5 listings
  });

  it('renders update buttons for each listing in the second table', () => {
    const updateButtons = screen.getAllByRole('button', { name: 'Update' });
    expect(updateButtons).toHaveLength(5);
  });


  it('calls handleStatusUpdate when a status button is clicked', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const inactiveButton = screen.getAllByRole('button', { name: 'Inactive' })[0];
    fireEvent.click(inactiveButton);
    expect(alertMock).toHaveBeenCalledWith('Status updated for listing 1 to Inactive');
    alertMock.mockRestore();
  });

  it('renders Select components for status in the second table', () => {
    const selectValues = screen.getAllByText('Select Value');
    expect(selectValues).toHaveLength(5);
  });

  it('renders clickable phone numbers', () => {
    const phoneLinks = screen.getAllByRole('link');
    expect(phoneLinks).toHaveLength(10); // 5 for each table
    expect(phoneLinks[0]).toHaveAttribute('href', 'tel:9560613903');
  });
});