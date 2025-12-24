import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useContactForm } from '@/hooks/useContactForm';

describe('useContactForm', () => {
  it('initializes with empty default values', () => {
    const { result } = renderHook(() => useContactForm());

    expect(result.current.form.getValues()).toEqual({
      name: '',
      email: '',
      message: '',
    });
  });

  it('starts with no errors', () => {
    const { result } = renderHook(() => useContactForm());

    expect(result.current.errors).toEqual({});
  });

  it('is not submitting initially', () => {
    const { result } = renderHook(() => useContactForm());

    expect(result.current.isSubmitting).toBe(false);
  });

  it('validates name field - too short', async () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.form.setValue('name', 'J');
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('message', 'This is a valid message');
    });

    await act(async () => {
      await result.current.form.trigger();
    });

    await waitFor(() => {
      expect(result.current.errors.name).toBeDefined();
    });
  });

  it('validates email field - invalid format', async () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.form.setValue('name', 'John Doe');
      result.current.form.setValue('email', 'invalid-email');
      result.current.form.setValue('message', 'This is a valid message');
    });

    await act(async () => {
      await result.current.form.trigger();
    });

    await waitFor(() => {
      expect(result.current.errors.email).toBeDefined();
    });
  });

  it('validates message field - too short', async () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.form.setValue('name', 'John Doe');
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('message', 'Short');
    });

    await act(async () => {
      await result.current.form.trigger();
    });

    await waitFor(() => {
      expect(result.current.errors.message).toBeDefined();
    });
  });

  it('passes validation with valid data', async () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.form.setValue('name', 'John Doe');
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('message', 'This is a valid message that is long enough.');
    });

    await act(async () => {
      await result.current.form.trigger();
    });

    await waitFor(() => {
      expect(result.current.errors).toEqual({});
    });
  });

  it('returns onSubmit handler', () => {
    const { result } = renderHook(() => useContactForm());

    expect(typeof result.current.onSubmit).toBe('function');
  });
});
