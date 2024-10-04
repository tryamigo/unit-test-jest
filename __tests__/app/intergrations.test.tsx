import React from 'react';
import { render, screen } from '@testing-library/react';
import Integrations from '@/app/integrations/page';
import { metadata } from '@/app/integrations/page';

// Mock the components
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer" />);
jest.mock('@/components/IntegrationPage', () => () => <div data-testid="mock-integration-page" />);

describe('Integrations Page', () => {
  beforeEach(() => {
    render(<Integrations />);
  });

  it('renders the Header component', () => {
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders the IntegrationPage component', () => {
    expect(screen.getByTestId('mock-integration-page')).toBeInTheDocument();
  });

  it('wraps the IntegrationPage in a div with correct classes', () => {
    const wrapper = screen.getByTestId('mock-integration-page').parentElement;
    expect(wrapper).toHaveClass('max-w-[1080px]');
    expect(wrapper).toHaveClass('mx-auto');
  });

  it('does not render the Footer component', () => {
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
  });
});

describe('Integrations Page Metadata', () => {
  it('has the correct title', () => {
    expect(metadata.title).toBe('Integrations | Amigo');
  });

  it('has the correct description', () => {
    expect(metadata.description).toBe('Amigo integrates with your favorite tools to streamline your workflow and supercharge your sales process.');
  });

  it('has the correct OpenGraph metadata', () => {
    expect(metadata.openGraph).toEqual({
      title: 'Integrations | Amigo',
      description: 'Amigo integrates with your favorite tools to streamline your workflow and supercharge your sales process.',
      url: 'https://amigo.gg/integrations',
      type: 'website',
      images: [
        {
          url: 'https://images.amigo.gg/logo.png',
          width: 800,
          height: 600,
          alt: 'Integrations | Amigo',
        },
      ],
    });
  });
});