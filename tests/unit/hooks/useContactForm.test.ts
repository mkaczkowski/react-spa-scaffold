import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useContactForm } from '@/hooks/useContactForm';

describe('useContactForm', () => {
  describe('initial state', () => {
    it('initializes with empty values and no errors', () => {
      const { result } = renderHook(() => useContactForm());

      expect(result.current.form.getValues()).toEqual({ name: '', email: '', message: '' });
      expect(result.current.errors).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(typeof result.current.onSubmit).toBe('function');
    });
  });

  describe('validation', () => {
    it.each([
      { field: 'name', value: 'J', valid: { email: 'test@example.com', message: 'Valid message here' } },
      { field: 'email', value: 'invalid', valid: { name: 'John', message: 'Valid message here' } },
      { field: 'message', value: 'Short', valid: { name: 'John', email: 'test@example.com' } },
    ])('rejects invalid $field', async ({ field, value, valid }) => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.form.setValue(field as 'name' | 'email' | 'message', value);
        Object.entries(valid).forEach(([k, v]) => {
          result.current.form.setValue(k as 'name' | 'email' | 'message', v);
        });
      });

      await act(async () => {
        await result.current.form.trigger();
      });

      await waitFor(() => {
        expect(result.current.errors[field as keyof typeof result.current.errors]).toBeDefined();
      });
    });

    it('passes with valid data', async () => {
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
  });
});
