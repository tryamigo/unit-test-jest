import React from 'react';
import { render, screen } from '@testing-library/react';
import IncomeTaxPage from '@/app/income-tax/page';

// Mock the Header and Footer components
jest.mock('@/components/header', () => () => <div data-testid="mock-header" />);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer" />);

describe('IncomeTaxPage', () => {
  beforeEach(() => {
    render(<IncomeTaxPage />);
  });

  it('renders the header and footer', () => {
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    expect(screen.getByText('File Your Income Tax for Free - Fast, Secure, and Hassle-Free')).toBeInTheDocument();
  });


  it('displays all tax form types', () => {
    const taxForms = ['ITR-1 (Sahaj)', 'ITR-2', 'ITR-3', 'ITR-4 (Sugam)', 'ITR-5 & 6', 'ITR-7'];
    taxForms.forEach(form => {
      expect(screen.getByText(form)).toBeInTheDocument();
    });
  });

  it('shows the "Why Choose TaxEase?" section', () => {
    expect(screen.getByText('Why Choose TaxEase?')).toBeInTheDocument();
    expect(screen.getByText('100% Free')).toBeInTheDocument();
  });

  it('renders testimonials', () => {
    expect(screen.getByText('What Our Users Say')).toBeInTheDocument();
    expect(screen.getByText(/I've never filed my taxes this easily before/)).toBeInTheDocument();
  });

  it('displays the CTA section', () => {
    expect(screen.getByText('Get Started Today!')).toBeInTheDocument();
    expect(screen.getByText('Start Filing')).toBeInTheDocument();
  });


});