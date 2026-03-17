import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the storage module
vi.mock('@/lib/storage', () => ({
  setStorageItem: vi.fn(() => true),
}));

// Mock dynamicActivate
vi.mock('@/i18n/loadCatalog', () => ({
  dynamicActivate: vi.fn(() => Promise.resolve()),
}));

import { useLanguage } from '@/hooks/useLanguage';
import { dynamicActivate } from '@/i18n/loadCatalog';
import { setStorageItem } from '@/lib/storage';

// Setup i18n for tests
i18n.loadAndActivate({ locale: 'en', messages: {} });

describe('useLanguage', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <I18nProvider i18n={i18n}>{children}</I18nProvider>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns current locale', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.currentLocale).toBeDefined();
    expect(typeof result.current.currentLocale).toBe('string');
  });

  it('returns supported locales', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.supportedLocales).toBeDefined();
    expect(Array.isArray(result.current.supportedLocales)).toBe(true);
    expect(result.current.supportedLocales).toContain('en');
    expect(result.current.supportedLocales).toContain('es');
    expect(result.current.supportedLocales).toContain('de');
  });

  it('returns changeLanguage function', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(typeof result.current.changeLanguage).toBe('function');
  });

  it('returns isLoading state', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it('changeLanguage calls dynamicActivate and setStorageItem', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await result.current.changeLanguage('es');

    await waitFor(() => {
      expect(dynamicActivate).toHaveBeenCalledWith('es');
      expect(setStorageItem).toHaveBeenCalledWith('myapp-locale', 'es');
    });
  });

  it('changeLanguage handles different locales', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await result.current.changeLanguage('de');

    await waitFor(() => {
      expect(dynamicActivate).toHaveBeenCalledWith('de');
      expect(setStorageItem).toHaveBeenCalledWith('myapp-locale', 'de');
    });
  });
});
