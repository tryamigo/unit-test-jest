import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessPage from '@/components/CSVSucess';

describe('SuccessPage Component', () => {
  const mockOnDone = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders import complete message', () => {
    render(
      <SuccessPage importedCount={10} skippedCount={0} onDone={mockOnDone} />
    );

    expect(screen.getByText('Import Complete!')).toBeInTheDocument();
    expect(screen.getByText('Successfully imported clients to your Amigo account.')).toBeInTheDocument();
    expect(screen.getByText('You can view the imported contacts in your client list on the Amigo mobile app or desktop web interface.')).toBeInTheDocument();
  });

  

  test('does not display skipped contacts message when skippedCount is 0', () => {
    render(
      <SuccessPage importedCount={8} skippedCount={0} onDone={mockOnDone} />
    );

    expect(screen.queryByText(/There were \d+ contacts that were not imported/i)).not.toBeInTheDocument();
  });

  test('calls onDone callback when DONE button is clicked', () => {
    render(
      <SuccessPage importedCount={10} skippedCount={0} onDone={mockOnDone} />
    );

    fireEvent.click(screen.getByRole('button', { name: /done/i }));

    expect(mockOnDone).toHaveBeenCalledTimes(1);
  });


});
