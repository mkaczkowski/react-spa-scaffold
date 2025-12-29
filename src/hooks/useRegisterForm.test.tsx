import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useRegisterForm } from '@/hooks/useRegisterForm';

describe('useRegisterForm', () => {
  it('returns form object with expected properties', () => {
    const { result } = renderHook(() => useRegisterForm());

    expect(result.current.form).toBeDefined();
    expect(result.current.onSubmit).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toBeDefined();
    expect(result.current.reset).toBeDefined();
  });

  it('initializes with empty default values', () => {
    const { result } = renderHook(() => useRegisterForm());

    expect(result.current.form.getValues()).toEqual({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('validates username minimum length', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('username', 'ab');
      await result.current.form.trigger('username');
    });

    expect(result.current.errors.username?.message).toBe('Username must be at least 3 characters');
  });

  it('validates username maximum length', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('username', 'a'.repeat(21));
      await result.current.form.trigger('username');
    });

    expect(result.current.errors.username?.message).toBe('Username must be at most 20 characters');
  });

  it('validates username format (alphanumeric and underscore only)', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('username', 'user@name');
      await result.current.form.trigger('username');
    });

    expect(result.current.errors.username?.message).toBe('Username can only contain letters, numbers, and underscores');
  });

  it('validates email format', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('email', 'invalid-email');
      await result.current.form.trigger('email');
    });

    expect(result.current.errors.email?.message).toBe('Please enter a valid email address');
  });

  it('validates password requires uppercase letter', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('password', 'lowercase1');
      await result.current.form.trigger('password');
    });

    expect(result.current.errors.password?.message).toBe('Password must contain at least one uppercase letter');
  });

  it('validates password requires lowercase letter', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('password', 'UPPERCASE1');
      await result.current.form.trigger('password');
    });

    expect(result.current.errors.password?.message).toBe('Password must contain at least one lowercase letter');
  });

  it('validates password requires number', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('password', 'NoNumbers');
      await result.current.form.trigger('password');
    });

    expect(result.current.errors.password?.message).toBe('Password must contain at least one number');
  });

  it('calls onSubmit with valid data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('username', 'validuser');
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('password', 'Password1');
      result.current.form.setValue('confirmPassword', 'Password1');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Registration submitted:', {
        username: 'validuser',
        email: 'test@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
    });

    consoleSpy.mockRestore();
  });

  it('resets form to default values', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue('username', 'testuser');
      result.current.form.setValue('email', 'test@example.com');
    });

    expect(result.current.form.getValues().username).toBe('testuser');

    act(() => {
      result.current.reset();
    });

    expect(result.current.form.getValues()).toEqual({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });
});
