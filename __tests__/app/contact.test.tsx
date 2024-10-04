import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/app/contact/page';
import Head from 'next/head';

// Mock the components used in Page
jest.mock('@/components/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-head">{children}</div>,
  };
});

describe('Contact Page', () => {
  beforeEach(() => {
    // Reset the document head before each test
    document.head.innerHTML = '';
  });

  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('sets the correct document title', () => {
    render(<Page />);
    expect(document.title).toBe('Contact Us | Amigo');
  });

  it('includes correct meta tags', () => {
    render(<Page />);
    const head = screen.getByTestId('mock-head');
    expect(head).toContainHTML('<title>Contact Us | Amigo</title>');
    expect(head).toContainHTML('<meta name="description" content="We\'d love to hear from you! Whether you have questions, need more information, or want to discuss potential opportunities, our team at Amigo is here to help. Please feel free to reach out to us via email." />');
    // Test for other meta tags
  });

  it('renders the contact container with correct styles', () => {
    render(<Page />);
    const container = screen.getByText('Contact Us').closest('div');
    expect(container).toHaveStyle({
      maxWidth: 'full',
      margin: '30px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    });
  });

  it('renders the correct heading', () => {
    render(<Page />);
    const heading = screen.getByRole('heading', { name: 'Contact Us' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveStyle({
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '36px',
      marginBottom: '20px'
    });
  });

  it('renders the correct paragraphs', () => {
    render(<Page />);
    expect(screen.getByText(/We'd love to hear from you! Whether you have questions/)).toBeInTheDocument();
    expect(screen.getByText(/Please feel free to reach out to us via email at/)).toBeInTheDocument();
    expect(screen.getByText(/Thank you for your interest in amigo./)).toBeInTheDocument();
  });

  it('includes the correct email link', () => {
    render(<Page />);
    const emailLink = screen.getByRole('link', { name: 'shashank@amigo.gg' });
    expect(emailLink).toHaveAttribute('href', 'mailto:shashank@amigo.gg');
    expect(emailLink).toHaveStyle({
      color: '#000',
      textDecoration: 'underline'
    });
  });

 

});