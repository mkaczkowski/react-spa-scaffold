import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { render, setMockClerkSignedIn, setMockClerkLoaded, resetClerkMocks } from '@/test';

import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    resetClerkMocks();
  });

  it('renders children when signed in', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading when auth is not loaded', () => {
    setMockClerkLoaded(false);
    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects when not signed in', () => {
    setMockClerkSignedIn(false);
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByTestId('redirect-to-sign-in')).toBeInTheDocument();
  });
});
