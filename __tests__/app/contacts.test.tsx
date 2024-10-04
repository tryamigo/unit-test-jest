
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '@/app/contacts/page';

// Mock the components used in Component
jest.mock('@/components/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('@/components/footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, variant, ...props }:any) => (
      <button data-testid={`mock-button-${variant || 'default'}`} {...props}>{children}</button>
    ),
  }));
jest.mock('@/components/ui/input', () => (props: any) => <input data-testid="mock-input" {...props} />);

describe('Component', () => {

      it('renders the main heading correctly', () => {
        render(<Component />);
        expect(screen.getByText('All Your Contacts. One Powerful Platform.')).toBeInTheDocument();
      });
      
      it('renders the subheading correctly', () => {
        render(<Component />);
        expect(screen.getByText(/Streamline your contact management and enhance team collaboration effortlessly with amigo.gg. Now available for free!/)).toBeInTheDocument();
      });

  it('renders the "Sign Up for Free" button', () => {
    render(<Component />);
    expect(screen.getByRole('button', { name: 'Sign Up for Free' })).toBeInTheDocument();
  });


  it('renders the "Key Features" section', () => {
    render(<Component />);
    expect(screen.getByText('Key Features - All Free')).toBeInTheDocument();
  });

  it('renders all four key features', () => {
    render(<Component />);
    expect(screen.getByText('Unified Contact Management')).toBeInTheDocument();
    expect(screen.getByText('Create Groups & Shared Lists')).toBeInTheDocument();
    expect(screen.getByText('Seamless Communication')).toBeInTheDocument();
    expect(screen.getByText('Custom Message Templates')).toBeInTheDocument();
  });

  it('renders the "How It Works" section', () => {
    render(<Component />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });


  it('renders the "What Our Users Say" section', () => {
    render(<Component />);
    expect(screen.getByText('What Our Users Say')).toBeInTheDocument();
  });

  it('renders two user testimonials', () => {
    render(<Component />);
    expect(screen.getByText(/I can't believe amigo.gg offers so much for free! It's revolutionized how our team manages contacts./)).toBeInTheDocument();
    expect(screen.getByText(/The free shared lists feature has made collaboration with my team incredibly easy. Highly recommended!/)).toBeInTheDocument();
  });

  it('renders the "Get Started Today" section', () => {
    render(<Component />);
    expect(screen.getByText('Get Started Today - It\'s Free!')).toBeInTheDocument();
  });

  it('renders the final "Sign Up Free" button', () => {
    render(<Component />);
    const signUpButtons = screen.getAllByRole('button', { name: 'Sign Up Free' });
    expect(signUpButtons.length).toBeGreaterThan(0);
    expect(signUpButtons[signUpButtons.length - 1]).toBeInTheDocument();
  });

  // Test for responsive design (you might need to use a library like jest-matchmedia-mock for this)
  it('applies responsive classes correctly', () => {
    render(<Component />);
    const mainSection = screen.getByRole('main');
    expect(mainSection).toHaveClass('flex-1');
  });



//   // Test for form submission (if applicable)
// it('handles form submission', () => {
//     render(<Component />);
//     const form = screen.getByTestId('mock-button-default').closest('form');
//     expect(form).toBeInTheDocument();
//     if (form) {
//       const mockPreventDefault = jest.fn();
//       fireEvent.submit(form, { preventDefault: mockPreventDefault });
//       expect(mockPreventDefault).toHaveBeenCalled();
//       // Add more expectations based on what should happen on form submission
//     }
//   });
});