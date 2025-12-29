import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RegisterForm } from '@/components/shared/RegisterForm';
import { render } from '@/test';

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows password mismatch error when passwords differ', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password2');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith('Registration submitted:', {
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password1',
          confirmPassword: 'Password1',
        });
      },
      { timeout: 2000 },
    );

    consoleSpy.mockRestore();
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    });
  });

  it('sets aria-invalid on fields with errors', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
