import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '@/components/footer';

describe('Footer Component', () => {
  test('renders Amigo footer with correct sections and content', () => {
    render(<Footer />);

    // Check for main heading
    expect(screen.getByText('Amigo')).toBeInTheDocument();
    expect(screen.getByText('Elevating client relationships with sophistication since 2023.')).toBeInTheDocument();

    // Check for Quick Links section
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About Us/i })).toBeInTheDocument();
    // expect(screen.getByRole('link', { name: /Contact Us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Terms of Service/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Data Deletion/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Refunds and cancellation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contacts/i })).toBeInTheDocument();

    // Check for Contact Us section
    // expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Email: support@amigo.com')).toBeInTheDocument();
    expect(screen.getByText('Phone: +919910074373')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn: Amigo/i })).toBeInTheDocument();
  });

  test('renders footer copyright text', () => {
    render(<Footer />);
    
    expect(screen.getByText('© 2024 Amigo. All rights reserved.')).toBeInTheDocument();
  });
});
