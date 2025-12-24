import { describe, expect, it } from 'vitest';

import {
  formatBytes,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from '@/lib/format';

describe('formatDate', () => {
  it('formats date objects and strings', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    expect(formatDate(date, {}, 'en-US')).toContain('2024');
    expect(formatDate('2024-06-20', {}, 'en-US')).toContain('2024');
  });

  it('returns "Invalid date" for invalid input', () => {
    expect(formatDate('invalid')).toBe('Invalid date');
  });

  it('respects custom options', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, { weekday: 'long' }, 'en-US')).toContain('Monday');
  });
});

describe('formatDateTime', () => {
  it('includes time in output', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    expect(formatDateTime(date, {}, 'en-US')).toMatch(/\d{1,2}:\d{2}/);
  });
});

describe('formatRelativeTime', () => {
  it.each([
    { offset: -30 * 1000, unit: 'seconds', pattern: /second|now/i },
    { offset: -5 * 60 * 1000, unit: 'minutes', pattern: /minute/i },
    { offset: -60 * 60 * 1000, unit: 'hours', pattern: /hour|ago/i },
    { offset: 24 * 60 * 60 * 1000, unit: 'days (future)', pattern: /day|tomorrow/i },
    { offset: -45 * 24 * 60 * 60 * 1000, unit: 'months', pattern: /month/i },
    { offset: -400 * 24 * 60 * 60 * 1000, unit: 'years', pattern: /year/i },
  ])('formats $unit correctly', ({ offset, pattern }) => {
    const date = new Date(Date.now() + offset);
    expect(formatRelativeTime(date, 'en-US')).toMatch(pattern);
  });

  it('returns "Invalid date" for invalid input', () => {
    expect(formatRelativeTime('invalid')).toBe('Invalid date');
  });

  it('accepts timestamp numbers', () => {
    const timestamp = Date.now() - 60 * 60 * 1000;
    expect(formatRelativeTime(timestamp, 'en-US')).toMatch(/hour|ago/i);
  });
});

describe('formatNumber', () => {
  it.each([
    { value: 1234567.89, options: {}, expected: '1,234,567.89' },
    { value: 1234.5, options: { minimumFractionDigits: 2 }, expected: '1,234.50' },
  ])('formats $value with options', ({ value, options, expected }) => {
    expect(formatNumber(value, options, 'en-US')).toBe(expected);
  });
});

describe('formatCurrency', () => {
  it.each([
    { value: 99.99, currency: 'USD', locale: 'en-US', expected: '$99.99' },
    { value: 99.99, currency: 'EUR', locale: 'de-DE', contains: '€' },
  ])('formats $currency correctly', ({ value, currency, locale, expected, contains }) => {
    const result = formatCurrency(value, currency, locale);
    if (expected) expect(result).toBe(expected);
    if (contains) expect(result).toContain(contains);
  });
});

describe('formatPercent', () => {
  it.each([
    { value: 0.25, decimals: 0, expected: '25%' },
    { value: 0.2567, decimals: 2, expected: '25.67%' },
  ])('formats $value with $decimals decimals', ({ value, decimals, expected }) => {
    expect(formatPercent(value, decimals, 'en-US')).toBe(expected);
  });
});

describe('formatBytes', () => {
  it.each([
    { bytes: 0, expected: '0 Bytes' },
    { bytes: 1024, expected: '1 KB' },
    { bytes: 1024 * 1024, expected: '1 MB' },
    { bytes: 1024 * 1024 * 1024, expected: '1 GB' },
    { bytes: 1536, decimals: 1, expected: '1.5 KB' },
    { bytes: 1536, decimals: 0, expected: '2 KB' },
  ])('formats $bytes bytes', ({ bytes, decimals, expected }) => {
    expect(formatBytes(bytes, decimals)).toBe(expected);
  });
});
