import React from 'react';
import { render, screen } from '@testing-library/react';
import RealEstateUserCards from '@/app/workspace/page';

// Mock the components
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/TeamComp', () => () => <div data-testid="mock-team-dashboard" />);

describe('RealEstateUserCards Component', () => {
  beforeEach(() => {
    render(<RealEstateUserCards />);
  });

  it('renders the Header component', () => {
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders the TeamDashboard component', () => {
    expect(screen.getByTestId('mock-team-dashboard')).toBeInTheDocument();
  });

  it('sets the correct page title', () => {
    expect(document.title).toBe('Workspace | Amigo');
  });


});

describe('RealEstateUserCards Head', () => {
  it('includes the correct title tag', () => {
    render(<RealEstateUserCards />);
    const titleTag = document.querySelector('title');
    expect(titleTag).toHaveTextContent('Workspace | Amigo');
  });

  // Add more tests for other head tags if they are added in the future
});

