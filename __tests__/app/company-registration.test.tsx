import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '@/app/company-registration/page';
// Mock the components and modules used in LandingPage
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-head">{children}</div>,
  };
});
jest.mock('@/components/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-card-content">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-card-title">{children}</div>,
}));
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-accordion">{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-accordion-item">{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-accordion-trigger">{children}</div>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-accordion-content">{children}</div>,
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button data-testid="mock-button">{children}</button>,
}));
jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="mock-input" {...props} />,
}));
jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea data-testid="mock-textarea" {...props} />,
}));

describe('LandingPage', () => {
  it('renders without crashing', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

 

  it('renders the hero section with correct content', () => {
    render(<LandingPage />);
    expect(screen.getByText('Incorporate Your Company in India for Free!')).toBeInTheDocument();
    expect(screen.getByText('Start your business journey with zero incorporation fees. Register as Pvt Ltd, LLP, or other entity types—hassle-free!')).toBeInTheDocument();
    expect(screen.getByText('Get Started Now')).toBeInTheDocument();
  });

  it('renders the services section with correct number of cards', () => {
    render(<LandingPage />);
    expect(screen.getByText('We Simplify Company Incorporation')).toBeInTheDocument();
    const cards = screen.getAllByTestId('mock-card');
    expect(cards).toHaveLength(6);
  });

  it('renders the "How It Works" section with correct steps', () => {
    render(<LandingPage />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Choose Your Entity')).toBeInTheDocument();
    expect(screen.getByText('Submit Your Documents')).toBeInTheDocument();
    expect(screen.getByText('We Handle the Rest')).toBeInTheDocument();
    expect(screen.getByText('Receive Your Incorporation Certificate')).toBeInTheDocument();
  });

  it('renders the "Why Choose Us" section with correct reasons', () => {
    render(<LandingPage />);
    expect(screen.getByText('Why Choose Us?')).toBeInTheDocument();
    expect(screen.getByText('Zero incorporation fees')).toBeInTheDocument();
    expect(screen.getByText('Expert assistance from start to finish')).toBeInTheDocument();
    expect(screen.getByText('Fast, simple, and secure process')).toBeInTheDocument();
    expect(screen.getByText('Dedicated support team')).toBeInTheDocument();
    expect(screen.getByText('Government-approved services')).toBeInTheDocument();
  });

  it('renders the testimonial card', () => {
    render(<LandingPage />);
    expect(screen.getByText('"Incorporating my startup was quick and easy thanks to their free services. Highly recommend!"')).toBeInTheDocument();
    expect(screen.getByText('– Ravi Kumar, Founder of XYZ Pvt Ltd')).toBeInTheDocument();
  });

  it('renders the FAQ section with correct number of questions', () => {
    render(<LandingPage />);
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    const accordionItems = screen.getAllByTestId('mock-accordion-item');
    expect(accordionItems).toHaveLength(4);
  });

  it('renders the contact form with correct fields', () => {
    render(<LandingPage />);
    expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Brief description of your business')).toBeInTheDocument();
    expect(screen.getByText('Get Free Consultation')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<LandingPage />);
    expect(screen.getByText('Phone: +91 9910074373 | Email: support@amigo.com')).toBeInTheDocument();
  });

  // Additional tests for interactivity (if needed)
  it('allows user to interact with FAQ accordion', () => {
    render(<LandingPage />);
    const accordionTriggers = screen.getAllByTestId('mock-accordion-trigger');
    fireEvent.click(accordionTriggers[0]);
    // Add expectations based on your accordion behavior
  });

  it('allows user to submit the contact form', () => {
    render(<LandingPage />);
    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone');
    const descriptionInput = screen.getByPlaceholderText('Brief description of your business');
    const submitButton = screen.getByText('Get Free Consultation');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(descriptionInput, { target: { value: 'My business idea' } });
    fireEvent.click(submitButton);

  });
});