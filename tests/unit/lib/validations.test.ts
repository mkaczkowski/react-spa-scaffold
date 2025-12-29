import { describe, expect, it } from 'vitest';

import { registerFormSchema } from '@/lib/validations';

describe('registerFormSchema', () => {
  const validRegister = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    confirmPassword: 'SecurePass123',
  };

  it('accepts valid data', () => {
    expect(registerFormSchema.safeParse(validRegister).success).toBe(true);
  });

  it.each([
    { field: 'username', value: 'ab', errorContains: 'at least 3 characters' },
    { field: 'username', value: 'john@doe', errorContains: 'letters, numbers, and underscores' },
    { field: 'email', value: 'not-an-email', errorContains: 'valid email' },
    { field: 'password', value: 'short', errorContains: 'at least 8 characters' },
    { field: 'password', value: 'alllowercase1', errorContains: 'uppercase letter' },
    { field: 'password', value: 'ALLUPPERCASE1', errorContains: 'lowercase letter' },
    { field: 'password', value: 'NoNumbersHere', errorContains: 'one number' },
  ])('rejects invalid $field with value "$value"', ({ field, value, errorContains }) => {
    const data = { ...validRegister, [field]: value };
    const result = registerFormSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((i) => i.message).join(' ');
      expect(errorMessages).toContain(errorContains);
    }
  });

  it('rejects mismatched passwords', () => {
    const data = { ...validRegister, confirmPassword: 'DifferentPass123' };
    const result = registerFormSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("don't match");
    }
  });
});
