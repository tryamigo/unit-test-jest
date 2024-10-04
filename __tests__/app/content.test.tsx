import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RealEstateUserCards from '@/app/content/page';

// Mock the components used in RealEstateUserCards
jest.mock('@/components/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('@/components/contentcart', () => () => <div data-testid="mock-content-details">ContentDetails</div>);

describe('RealEstateUserCards', () => {
  it('renders without crashing', () => {
    render(<RealEstateUserCards />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-content-details')).toBeInTheDocument();
  });

  it('has correct title', () => {
    render(<RealEstateUserCards />);
    expect(document.title).toBe('content');
  });

});