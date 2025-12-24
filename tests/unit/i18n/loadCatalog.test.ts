import { i18n } from '@lingui/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { dynamicActivate } from '@/i18n/loadCatalog';

// Mock the i18n module
vi.mock('@lingui/core', () => ({
  i18n: {
    locale: '',
    messages: {} as Record<string, object>,
    activate: vi.fn(),
    loadAndActivate: vi.fn(),
  },
}));

describe('dynamicActivate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Reset i18n state
    (i18n as { locale: string }).locale = '';
    (i18n as { messages: Record<string, object> }).messages = {};
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing if locale is already active with messages', async () => {
    (i18n as { locale: string }).locale = 'en';
    (i18n as { messages: Record<string, object> }).messages = { en: { hello: 'Hello' } };

    await dynamicActivate('en');

    expect(i18n.activate).not.toHaveBeenCalled();
    expect(i18n.loadAndActivate).not.toHaveBeenCalled();
  });

  it('activates locale if messages already loaded but different locale active', async () => {
    (i18n as { locale: string }).locale = 'pl';
    (i18n as { messages: Record<string, object> }).messages = { en: { hello: 'Hello' } };

    await dynamicActivate('en');

    expect(i18n.activate).toHaveBeenCalledWith('en');
    expect(i18n.loadAndActivate).not.toHaveBeenCalled();
  });

  it('activates default locale if already loaded during fallback', async () => {
    (i18n as { locale: string }).locale = '';
    (i18n as { messages: Record<string, object> }).messages = { en: { hello: 'Hello' } };

    // Try to load non-default locale (will fail in test env)
    await dynamicActivate('de');

    // Should activate the default locale since it's already loaded
    expect(i18n.activate).toHaveBeenCalledWith('en');
  });

  it('logs error when locale fails to load', async () => {
    (i18n as { locale: string }).locale = '';
    (i18n as { messages: Record<string, object> }).messages = {};

    // Try to load a locale (will fail in test env due to dynamic import)
    await dynamicActivate('de');

    // Should have logged an error about failing to load
    expect(console.error).toHaveBeenCalled();
  });
});
