import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/app/terms-services/page';
import { metadata } from '@/app/terms-services/page';

// Mock the Header and Footer components
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer" />);

describe('Terms of Service Page', () => {
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
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('contains the introduction paragraph', () => {
    expect(screen.getByText(/Welcome to amigo. By using our services, you agree to comply/)).toBeInTheDocument();
  });

  it('includes the "Acceptance of Terms" section', () => {
    expect(screen.getByText('1. Acceptance of Terms')).toBeInTheDocument();
  });

  it('includes the "Use License" section', () => {
    expect(screen.getByText('2. Use License')).toBeInTheDocument();
  });

  it('includes the "Disclaimer" section', () => {
    expect(screen.getByText('3. Disclaimer')).toBeInTheDocument();
  });

  it('includes the "Limitations" section', () => {
    expect(screen.getByText('4. Limitations')).toBeInTheDocument();
  });

  it('includes the "Accuracy of Materials" section', () => {
    expect(screen.getByText('5. Accuracy of Materials')).toBeInTheDocument();
  });

  it('includes the "Links" section', () => {
    expect(screen.getByText('6. Links')).toBeInTheDocument();
  });

  it('includes the "Modifications" section', () => {
    expect(screen.getByText('7. Modifications')).toBeInTheDocument();
  });

  it('includes the "Governing Law" section', () => {
    expect(screen.getByText('8. Governing Law')).toBeInTheDocument();
  });

  it('mentions the contact email for questions', () => {
    expect(screen.getByText(/legal@amigo.gg/)).toBeInTheDocument();
  });
});

describe('Terms of Service Page Metadata', () => {
  it('has the correct title', () => {
    expect(metadata.title).toBe('Terms of Service | Amigo');
  });

  it('has the correct description', () => {
    expect(metadata.description).toContain('Welcome to amigo. By using our services, you agree to comply');
  });
});

describe('Terms of Service Page Head', () => {
  it('includes correct Open Graph tags', () => {
    render(<Page />);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    expect(ogTitle).toHaveAttribute('content', 'Terms of Service | Amigo');
    expect(ogDescription).toHaveAttribute('content', expect.stringContaining('Welcome to amigo. By using our services, you agree to comply'));
    expect(ogType).toHaveAttribute('content', 'website');
    expect(ogUrl).toHaveAttribute('content', 'https://amigo.gg/terms-services');
    expect(ogImage).toHaveAttribute('content', 'https://images.amigo.gg/logo.png');
  });
});