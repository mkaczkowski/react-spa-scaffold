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
  it('formats a date object', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatDate(date, {}, 'en-US');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('formats a date string', () => {
    const result = formatDate('2024-06-20', {}, 'en-US');
    expect(result).toContain('2024');
  });

  it('handles invalid date', () => {
    const result = formatDate('invalid');
    expect(result).toBe('Invalid date');
  });

  it('respects custom options', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, { weekday: 'long' }, 'en-US');
    expect(result).toContain('Monday');
  });
});

describe('formatDateTime', () => {
  it('includes time in output', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const result = formatDateTime(date, {}, 'en-US');
    // Should contain time components
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});

describe('formatRelativeTime', () => {
  it('formats past time', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
    const result = formatRelativeTime(pastDate, 'en-US');
    expect(result).toMatch(/hour|ago/i);
  });

  it('formats future time', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day from now
    const result = formatRelativeTime(futureDate, 'en-US');
    expect(result).toMatch(/day|tomorrow/i);
  });

  it('handles invalid date', () => {
    const result = formatRelativeTime('invalid');
    expect(result).toBe('Invalid date');
  });

  it('formats seconds', () => {
    const recentDate = new Date(Date.now() - 1000 * 30); // 30 seconds ago
    const result = formatRelativeTime(recentDate, 'en-US');
    expect(result).toMatch(/second|now/i);
  });

  it('formats minutes', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 5); // 5 minutes ago
    const result = formatRelativeTime(pastDate, 'en-US');
    expect(result).toMatch(/minute/i);
  });

  it('formats months', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 45); // ~1.5 months ago
    const result = formatRelativeTime(pastDate, 'en-US');
    expect(result).toMatch(/month/i);
  });

  it('formats years', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 400); // ~1+ year ago
    const result = formatRelativeTime(pastDate, 'en-US');
    expect(result).toMatch(/year/i);
  });

  it('handles timestamp numbers', () => {
    const timestamp = Date.now() - 1000 * 60 * 60; // 1 hour ago as number
    const result = formatRelativeTime(timestamp, 'en-US');
    expect(result).toMatch(/hour|ago/i);
  });
});

describe('formatNumber', () => {
  it('formats numbers with locale', () => {
    const result = formatNumber(1234567.89, {}, 'en-US');
    expect(result).toBe('1,234,567.89');
  });

  it('respects custom options', () => {
    const result = formatNumber(1234.5, { minimumFractionDigits: 2 }, 'en-US');
    expect(result).toBe('1,234.50');
  });
});

describe('formatCurrency', () => {
  it('formats USD currency', () => {
    const result = formatCurrency(99.99, 'USD', 'en-US');
    expect(result).toBe('$99.99');
  });

  it('formats EUR currency', () => {
    const result = formatCurrency(99.99, 'EUR', 'de-DE');
    expect(result).toContain('€');
  });
});

describe('formatPercent', () => {
  it('formats percentage', () => {
    const result = formatPercent(0.25, 0, 'en-US');
    expect(result).toBe('25%');
  });

  it('respects decimal places', () => {
    const result = formatPercent(0.2567, 2, 'en-US');
    expect(result).toBe('25.67%');
  });
});

describe('formatBytes', () => {
  it('formats bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('respects decimal places', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });
});
