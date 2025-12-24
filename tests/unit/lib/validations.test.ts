import { describe, expect, it } from 'vitest';

import { contactFormSchema, registerFormSchema } from '@/lib/validations';

describe('contactFormSchema', () => {
  it('validates a correct contact form', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message that is long enough.',
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects a name that is too short', () => {
    const invalidData = {
      name: 'J',
      email: 'john@example.com',
      message: 'This is a valid message.',
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 2 characters');
    }
  });

  it('rejects an invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email',
      message: 'This is a valid message.',
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid email');
    }
  });

  it('rejects a message that is too short', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 10 characters');
    }
  });
});

describe('registerFormSchema', () => {
  it('validates a correct registration form', () => {
    const validData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    };

    const result = registerFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const invalidData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      confirmPassword: 'DifferentPass123',
    };

    const result = registerFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("don't match");
    }
  });

  it('rejects a username with invalid characters', () => {
    const invalidData = {
      username: 'john@doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    };

    const result = registerFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('letters, numbers, and underscores');
    }
  });

  it('rejects a weak password', () => {
    const invalidData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'weakpass',
      confirmPassword: 'weakpass',
    };

    const result = registerFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
