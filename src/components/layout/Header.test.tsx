import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Header } from '@/components/layout/Header';
import { render, setMockClerkSignedIn } from '@/test';

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the theme toggle', () => {
    render(<Header />);

    // ThemeToggle has an aria-label
    expect(screen.getByRole('button', { name: /switch to (dark|light) mode/i })).toBeInTheDocument();
  });

  it('renders the language switcher', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: /change language/i })).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders sign-in button when user is signed out', () => {
    setMockClerkSignedIn(false);

    render(<Header />);

    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
  });

  it('renders user button when user is signed in', () => {
    setMockClerkSignedIn(true);

    render(<Header />);

    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
});
