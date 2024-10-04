import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PermissionsDialog from '@/components/PermissionsDialog'; // Update path accordingly
import { useSession } from 'next-auth/react';

// Mock the `useSession` hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock global fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('PermissionsDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    initialData: {
      email: 'test@example.com',
      permissions: 'viewClients,addOrEditGroups',
      userId: '12345', // Add `userId` here with type assertion
      teamId: 'team1', // Add `teamId` here with type assertion
    } as { email: string; permissions: string; userId?: string; teamId?: string },
    mode: 'edit',
  };

  beforeEach(() => {
    // Mock session data
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: 'test-user-id',
          teamId: 'team1',
        },
      },
      status: 'authenticated',
    });
  });

 

  it('renders correctly in add mode', () => {
    render(<PermissionsDialog {...defaultProps} mode="add" initialData={{}} />);
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });

  it('displays the permissions checkboxes', () => {
    render(<PermissionsDialog {...defaultProps} />);
    const permissions = [
      'View Clients',
      'Unassigned Clients',
      'Add Or Edit Groups',
      'Delete Clients',
      'Add Edit Content',
      'Manage Team Members',
      'Manage Integrations',
    ];
    permissions.forEach((permission) => {
      expect(screen.getByLabelText(permission)).toBeInTheDocument();
    });
  });

  it('calls onSave when the save button is clicked', async () => {
    render(<PermissionsDialog {...defaultProps} />);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    // Wait for the fetch request to complete and onSave to be called
    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalled();
    });
  });

  it('calls onClose when the dialog is closed', () => {
    render(<PermissionsDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
