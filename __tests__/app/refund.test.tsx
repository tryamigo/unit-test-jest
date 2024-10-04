import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/app/refund/page';
import { metadata } from '@/app/refund/page';

// Mock the Header and Footer components
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer" />);

describe('Refunds and Cancellation Page', () => {
  beforeEach(() => {
    render(<Page />);
  });

  it('renders the Header component', () => {
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders the Footer component', () => {
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('displays the correct page title', () => {
    expect(screen.getByText('Refunds and Cancellation')).toBeInTheDocument();
  });



  it('includes the "Cancellation Policy" section', () => {
    expect(screen.getByText('Cancellation Policy:')).toBeInTheDocument();
    expect(screen.getByText(/For ongoing services, cancellations must be submitted/)).toBeInTheDocument();
  });

  it('includes the "Refund Policy" section', () => {
    expect(screen.getByText('Refund Policy:')).toBeInTheDocument();
    expect(screen.getByText(/Refund requests must be submitted in writing/)).toBeInTheDocument();
  });

  it('mentions the 14-day refund request period', () => {
    expect(screen.getByText(/within 14 days of service completion/)).toBeInTheDocument();
  });

  it('mentions the case-by-case basis for refunds', () => {
    expect(screen.getByText(/Refunds are processed on a case-by-case basis/)).toBeInTheDocument();
  });

  it('mentions the refund processing time', () => {
    expect(screen.getByText(/within 10 business days/)).toBeInTheDocument();
  });

  it('includes information about partial refunds', () => {
    expect(screen.getByText(/Partial refunds may be offered/)).toBeInTheDocument();
  });

  it('mentions the commitment to resolving issues', () => {
    expect(screen.getByText(/We are committed to resolving any issues/)).toBeInTheDocument();
  });


});

describe('Refunds and Cancellation Page Metadata', () => {
  it('has the correct title', () => {
    expect(metadata.title).toBe('Refunds and Cancellation | Amigo');
  });

  it('has the correct description', () => {
    expect(metadata.description).toContain('At Amigo, we strive to ensure customer satisfaction');
  });
});

describe('Refunds and Cancellation Page Head', () => {
  it('includes correct Open Graph tags', () => {
    render(<Page />);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    expect(ogTitle).toHaveAttribute('content', 'Refunds and Cancellation | Amigo');
    expect(ogDescription).toHaveAttribute('content', expect.stringContaining('At Amigo, we strive to ensure customer satisfaction'));
    expect(ogType).toHaveAttribute('content', 'website');
    expect(ogUrl).toHaveAttribute('content', 'https://amigo.gg/refund');
    expect(ogImage).toHaveAttribute('content', 'https://images.amigo.gg/logo.png');
  });
});