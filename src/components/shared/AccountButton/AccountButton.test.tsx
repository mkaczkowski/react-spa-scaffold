import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { render, setMockSignedIn, setMockLoaded, resetClerkMocks } from '@/test';

import { AccountButton } from './AccountButton';

describe('AccountButton', () => {
  beforeEach(() => {
    resetClerkMocks();
  });

  it('shows skeleton when not loaded', () => {
    setMockLoaded(false);
    const { container } = render(<AccountButton />);
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });

  it('shows user button when signed in', () => {
    render(<AccountButton />);
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });

  it('shows sign in button when signed out', () => {
    setMockSignedIn(false);
    render(<AccountButton />);
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
