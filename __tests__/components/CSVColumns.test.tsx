import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequiredColumns from '@/components/CSVColumns';

describe('RequiredColumns Component', () => {
  test('renders the heading and description', () => {
    render(<RequiredColumns />);

    // Check for heading
    expect(screen.getByText('Required CSV Columns')).toBeInTheDocument();

    // Check for description
    expect(screen.getByText('The CSV file should have 5 columns in the exact order below:')).toBeInTheDocument();
  });


});
