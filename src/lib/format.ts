/**
 * Formatting utilities for dates, numbers, and currencies.
 * All formatters are locale-aware.
 */

/**
 * Format a date with locale support
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string,
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format a date with time
 */
export function formatDateTime(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string,
): string {
  return formatDate(
    date,
    {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    },
    locale,
  );
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string | number, locale?: string): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  const absoluteDiff = Math.abs(diffInSeconds);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (absoluteDiff < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (absoluteDiff < 3600) {
    return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
  } else if (absoluteDiff < 86400) {
    return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
  } else if (absoluteDiff < 2592000) {
    return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
  } else if (absoluteDiff < 31536000) {
    return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
  }
}

/**
 * Format a number with locale support
 */
export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}, locale?: string): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currency = 'USD', locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercent(value: number, decimals = 0, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
