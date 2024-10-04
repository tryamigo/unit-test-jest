import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import RealEstateUserCards from '@/app/content/page';
import { useRouter } from 'next/navigation';

// Mocking next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mocking next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mocking components
jest.mock('@/components/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('@/components/clientcomp', () => () => <div data-testid="mock-client-page">Client Page</div>);
jest.mock('@/components/AdditionalInfoComponent', () => ({ onComplete }: { onComplete: () => void }) => (
  <div data-testid="mock-additional-info">Additional Info Component</div>
));
jest.mock('@/components/withauth', () => (Component: any) => Component);
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/components/messages/meassagetable', () => {
  return function DummyMessageTable() {
    return <div data-testid="mock-message-table">Mocked Message Table</div>;
  };
});

describe('RealEstateUserCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  test('renders ClientPage when all required fields are present', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: '1',
          name: 'John Doe',
          companyName: 'Acme Inc',
          mobile: '1234567890',
          whatsapp: '1234567890'
        }
      },
      status: 'authenticated'
    });

    render(<RealEstateUserCards />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-message-table')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-additional-info')).not.toBeInTheDocument();
  });

  test('renders AdditionalInfoComponent when required fields are missing', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: '1',
          name: 'John Doe',
          // missing companyName, mobile, and whatsapp
        }
      },
      status: 'authenticated'
    });

    render(<RealEstateUserCards />);
    expect(screen.getByTestId('mock-message-table')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-additional-info')).not.toBeInTheDocument();
  });

  test('does not render AdditionalInfoComponent when session is loading', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading'
    });

    render(<RealEstateUserCards />);
    expect(screen.queryByTestId('mock-additional-info')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-message-table')).toBeInTheDocument();
  });

  test('renders correct meta tags', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: '1',
          name: 'John Doe',
          companyName: 'Acme Inc',
          mobile: '1234567890',
          whatsapp: '1234567890'
        }
      },
      status: 'authenticated'
    });

    render(<RealEstateUserCards />);
    
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    expect(title).toBe('content');
    expect(metaDescription?.getAttribute('content')).toBe('Browse through user cards for real estate listings.');
    expect(ogTitle?.getAttribute('content')).toBe('Real Estate User Cards');
    expect(ogDescription?.getAttribute('content')).toBe('Browse through user cards for real estate listings.');
    expect(ogType?.getAttribute('content')).toBe('website');
    expect(ogUrl?.getAttribute('content')).toBe('https://amigo.gg/content');
    expect(ogImage?.getAttribute('content')).toBe('https://images.amigo.gg/logo.png');
  });

  test('updates component when session changes', async () => {
    const { rerender } = render(<RealEstateUserCards />);
    
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: '1',
          // missing required fields
        }
      },
      status: 'authenticated'
    });

    await act(async () => {
      rerender(<RealEstateUserCards />);
    });

    expect(screen.getByTestId('mock-message-table')).toBeInTheDocument();

    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userid: '1',
          name: 'John Doe',
          companyName: 'Acme Inc',
          mobile: '1234567890',
          whatsapp: '1234567890'
        }
      },
      status: 'authenticated'
    });

    await act(async () => {
      rerender(<RealEstateUserCards />);
    });

    expect(screen.getByTestId('mock-message-table')).toBeInTheDocument();
  });
});