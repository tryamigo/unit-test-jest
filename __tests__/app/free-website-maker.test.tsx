import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/free-website-maker/page';

// Mock the components and icons
jest.mock('@/components/footer', () => () => <footer data-testid="mock-footer">Footer</footer>);
jest.mock('@/components/header', () => () => <header data-testid="mock-header">Header</header>);
jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon">ArrowRight Icon</span>,
  CheckCircle: () => <span data-testid="check-circle-icon">CheckCircle Icon</span>,
  Star: () => <span data-testid="star-icon">Star Icon</span>,
  Phone: () => <span data-testid="phone-icon">Phone Icon</span>,
  Users: () => <span data-testid="users-icon">Users Icon</span>,
  Rocket: () => <span data-testid="rocket-icon">Rocket Icon</span>,
  X: () => <span data-testid="x-icon">X Icon</span>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  it('renders the header and footer', () => {
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });



  it('renders the features section', () => {
    expect(screen.getByText('What You Get with Your Free Website')).toBeInTheDocument();
    ['Free Design & Setup', 'Expert Consultation', 'Responsive and Mobile-Friendly', 'Scalable Hosting'].forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('renders the how it works section', () => {
    expect(screen.getByText('Your Website in 3 Simple Steps')).toBeInTheDocument();
    ['Schedule a Call', 'Share Your Vision', 'We Build & Launch'].forEach(step => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  

  it('renders the template showcase section', () => {
    expect(screen.getByText('Choose From Stunning Templates')).toBeInTheDocument();
    ['E-commerce Template', 'Restaurant Template', 'Portfolio Template', 'Blog Template'].forEach(template => {
      expect(screen.getByText(template)).toBeInTheDocument();
    });
  });

  it('renders the testimonials section', () => {
    expect(screen.getByText('What Our Users Are Saying')).toBeInTheDocument();
    expect(screen.getAllByText(/I couldn't believe how easy it was/)).toHaveLength(3);
    expect(screen.getAllByText('Raj, Café Owner')).toHaveLength(3);
  });

  it('renders the final call to action section', () => {
    expect(screen.getByText('Ready to Get Your Free Website?')).toBeInTheDocument();
    expect(screen.getAllByText('Schedule Your Free Consultation')).toHaveLength(3);
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('sets the correct title tag', () => {
    expect(document.title).toBe('Free Website Maker | Amigo');
  });

  it('renders the correct number of pricing plans', () => {
    const pricingPlans = screen.getAllByText(/month|Custom/);
    expect(pricingPlans).toHaveLength(4);
  });

  it('renders the correct number of features for each pricing plan', () => {
    const checkCircleIcons = screen.getAllByTestId('check-circle-icon');
    expect(checkCircleIcons.length).toBeGreaterThanOrEqual(19); // 4 + 5 + 5 + 5
  });

  it('renders the correct number of testimonials', () => {
    const testimonials = screen.getAllByText(/Raj, Café Owner/);
    expect(testimonials).toHaveLength(3);
  });

  it('renders the correct number of template categories', () => {
    const templates = screen.getAllByText(/Template$/);
    expect(templates).toHaveLength(4);
  });
});