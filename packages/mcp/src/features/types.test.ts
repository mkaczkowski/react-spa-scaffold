/**
 * Tests for feature type definitions.
 */

import { describe, it, expect } from 'vitest';

import { FEATURE } from '../constants.js';
import { FEATURE_IDS, isFeatureId } from './types.js';

describe('FEATURE_IDS', () => {
  it('is derived from FEATURE constant', () => {
    expect(FEATURE_IDS).toEqual(Object.values(FEATURE));
  });

  it('contains expected features', () => {
    expect(FEATURE_IDS).toContain('core');
    expect(FEATURE_IDS).toContain('routing');
    expect(FEATURE_IDS).toContain('testing');
    expect(FEATURE_IDS).toContain('auth');
    expect(FEATURE_IDS).toContain('database');
    expect(FEATURE_IDS).toContain('deployment');
    expect(FEATURE_IDS).toContain('electron');
  });

  it('has 18 features', () => {
    expect(FEATURE_IDS).toHaveLength(18);
  });
});

describe('isFeatureId', () => {
  it('returns true for valid feature IDs', () => {
    expect(isFeatureId('core')).toBe(true);
    expect(isFeatureId('routing')).toBe(true);
    expect(isFeatureId('theming')).toBe(true);
    expect(isFeatureId('auth')).toBe(true);
  });

  it('returns false for invalid feature IDs', () => {
    expect(isFeatureId('invalid')).toBe(false);
    expect(isFeatureId('')).toBe(false);
    expect(isFeatureId('CORE')).toBe(false);
  });
});
