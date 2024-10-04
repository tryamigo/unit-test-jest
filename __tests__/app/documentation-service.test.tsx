import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentationServicePage from '@/app/documentation-service/page';

// Mock the components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  CardFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));

jest.mock('@/components/header', () => () => <header data-testid="mock-header">Header</header>);
jest.mock('@/components/footer', () => () => <footer data-testid="mock-footer">Footer</footer>);

describe('DocumentationServicePage', () => {
  beforeEach(() => {
    render(<DocumentationServicePage />);
  });

  it('renders the header and footer', () => {
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('renders the main title', () => {
    expect(screen.getByText('Professional Documentation Services')).toBeInTheDocument();
  });

  it('renders the "Get Started" button', () => {
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('renders the services section', () => {
    expect(screen.getByText('Our Documentation Services')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(12); // 4 services + 4 benefits + 4 process steps
  });

  it('renders all service titles', () => {
    const serviceTitles = [
      'Technical Documentation',
      'User Documentation',
      'Process Documentation',
      'Policy Documentation'
    ];
    serviceTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders the "Why Choose Us" section', () => {
    expect(screen.getByText('Why Choose Our Documentation Services?')).toBeInTheDocument();
  });

  it('renders all benefit titles', () => {
    const benefitTitles = [
      'Expertise Across Industries',
      'Customized Solutions',
      'Quality Assurance',
      'Scalable Services'
    ];
    benefitTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders the "How It Works" section', () => {
    expect(screen.getByText('Our Documentation Process')).toBeInTheDocument();
  });

  it('renders all process steps', () => {
    const steps = ['1. Consultation', '2. Customization', '3. Delivery', '4. Ongoing Support'];
    steps.forEach(step => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it('renders the call to action section', () => {
    expect(screen.getByText('Ready to Elevate Your Documentation?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact Us Today' })).toBeInTheDocument();
  });


  it('sets the correct title tag', () => {
    expect(document.title).toBe('Documentation Services | Amigo');
  });
});