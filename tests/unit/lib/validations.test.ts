import { describe, expect, it } from 'vitest';

import { contactFormSchema, registerFormSchema } from '@/lib/validations';

describe('contactFormSchema', () => {
  const validContact = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a valid message that is long enough.',
  };

  it('accepts valid data', () => {
    expect(contactFormSchema.safeParse(validContact).success).toBe(true);
  });

  it.each([
    { field: 'name', value: 'J', errorContains: 'at least 2 characters' },
    { field: 'email', value: 'not-an-email', errorContains: 'valid email' },
    { field: 'message', value: 'Short', errorContains: 'at least 10 characters' },
  ])('rejects invalid $field', ({ field, value, errorContains }) => {
    const data = { ...validContact, [field]: value };
    const result = contactFormSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(errorContains);
    }
  });
});

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
    { field: 'username', value: 'john@doe', errorContains: 'letters, numbers, and underscores' },
    { field: 'password', value: 'weakpass', errorContains: null },
    { fields: { confirmPassword: 'DifferentPass123' }, errorContains: "don't match" },
  ])('rejects invalid input', ({ field, fields, value, errorContains }) => {
    const data = field ? { ...validRegister, [field]: value } : { ...validRegister, ...fields };
    const result = registerFormSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success && errorContains) {
      expect(result.error.issues[0].message).toContain(errorContains);
    }
  });
});
