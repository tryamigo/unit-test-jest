import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/app/privacy/page';
import { metadata } from '@/app/privacy/page';

// Mock the Header and Footer components
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer" />);

describe('Privacy Policy Page', () => {
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
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });


  it('includes the "Information We Collect" section', () => {
    expect(screen.getByText('Information We Collect:')).toBeInTheDocument();
    expect(screen.getByText(/Personal information such as name, email address/)).toBeInTheDocument();
  });

  it('includes the "How We Use Your Information" section', () => {
    expect(screen.getByText('How We Use Your Information:')).toBeInTheDocument();
    expect(screen.getByText(/To provide and improve our services to you/)).toBeInTheDocument();
  });

  it('includes the "Data Security" section', () => {
    expect(screen.getByText('Data Security:')).toBeInTheDocument();
    expect(screen.getByText(/We implement industry-standard security measures/)).toBeInTheDocument();
  });

  it('includes the "Third-Party Disclosure" section', () => {
    expect(screen.getByText('Third-Party Disclosure:')).toBeInTheDocument();
    expect(screen.getByText(/We do not sell, trade, or otherwise transfer/)).toBeInTheDocument();
  });

  it('includes the "Your Rights" section', () => {
    expect(screen.getByText('Your Rights:')).toBeInTheDocument();
    expect(screen.getByText(/You have the right to access, correct, or delete/)).toBeInTheDocument();
  });

  it('includes the "Changes to This Policy" section', () => {
    expect(screen.getByText('Changes to This Policy:')).toBeInTheDocument();
    expect(screen.getByText(/We may update our Privacy Policy from time to time/)).toBeInTheDocument();
  });

  it('includes the "Data Deletion Policy" section with correct link', () => {
    expect(screen.getByText('Data Deletion Policy:')).toBeInTheDocument();
    const link = screen.getByText('https://amigo.gg/data-deletion');
    expect(link).toHaveAttribute('href', 'https://amigo.gg/data-deletion');
  });

  it('displays the last modified date', () => {
    expect(screen.getByText(/Last modified: \[09\/09\/2023\]/)).toBeInTheDocument();
  });
});

describe('Privacy Policy Page Metadata', () => {
  it('has the correct title', () => {
    expect(metadata.title).toBe('Privacy Policy | Amigo');
  });

  it('has the correct description', () => {
    expect(metadata.description).toContain('At amigo, we are committed to protecting your privacy');
  });
});

describe('Privacy Policy Page Head', () => {
  it('includes correct Open Graph tags', () => {
    render(<Page />);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    expect(ogTitle).toHaveAttribute('content', 'Privacy Policy | Amigo');
    expect(ogDescription).toHaveAttribute('content', expect.stringContaining('At amigo, we are committed to protecting your privacy'));
    expect(ogType).toHaveAttribute('content', 'website');
    expect(ogUrl).toHaveAttribute('content', 'https://amigo.gg/privacy');
    expect(ogImage).toHaveAttribute('content', 'https://images.amigo.gg/logo.png');
  });
});