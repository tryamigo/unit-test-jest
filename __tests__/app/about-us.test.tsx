// Page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import Page from '@/app/about-us/page';

jest.mock('@/components/header', () => () => <div data-testid="header">Header Component</div>);
jest.mock('@/components/footer', () => () => <div data-testid="footer">Footer Component</div>);

describe('Page Component', () => {
  it('should render the Header component', () => {
    render(<Page />);
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Header Component');
  });

  it('should render the Footer component', () => {
    render(<Page />);
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('Footer Component');
  });

  it('should render the About Us title', () => {
    render(<Page />);
    const title = screen.getByText(/about us/i);
    expect(title).toBeInTheDocument();
  });

  it('should render the About Us description paragraph', () => {
    render(<Page />);
    
    const descriptionPart = screen.getByText(/we are dedicated to delivering high-quality/i);
    expect(descriptionPart).toBeInTheDocument();
  });
  

  it('should render all expected content about services', () => {
    render(<Page />);
    expect(
      screen.getByText(/We specialize in offering a wide range of services, including consultancy, software development, project management, and digital transformation./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our mission is simple: to build long-lasting relationships with our clients by delivering exceptional results and exceeding expectations./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Join us in transforming your business and unlocking its full potential./i)
    ).toBeInTheDocument();
  });
});
