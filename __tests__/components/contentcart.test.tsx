import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import Contentcart from '@/components/contentcart';

// Mock dependencies
jest.mock('next-auth/react');
jest.mock('@/components/messages/message', () => () => <div>Mocked MessageCart</div>);
jest.mock('@/components/messages/meassagetable', () => () => <div>Mocked MessageTable</div>);
jest.mock('@/components/files/filestable', () => () => <div>Mocked FileTable</div>);
jest.mock('@/components/files/fileinput', () => () => <div>Mocked FileInput</div>);

describe('Contentcart Component', () => {
  const mockSession = {
    data: {
      user: {
        userid: 'test-user-id',
        teamId: 'test-team-id',
        accessToken: 'test-access-token',
      },
    },
    status: 'authenticated',
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue(mockSession);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders content header and tabs', () => {
    render(<Contentcart />);

    // Verify content header
    expect(screen.getByText('Content')).toBeInTheDocument();

    // Verify tabs
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
  });

  test('renders messages table by default', () => {
    render(<Contentcart />);

    // Verify messages table is shown by default
    expect(screen.getByText('Mocked MessageTable')).toBeInTheDocument();
  });

 
});
