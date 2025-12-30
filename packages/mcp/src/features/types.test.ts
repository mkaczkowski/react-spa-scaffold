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
  });

  it('has 14 features', () => {
    expect(FEATURE_IDS).toHaveLength(14);
  });
});

describe('isFeatureId', () => {
  it('returns true for valid feature IDs', () => {
    expect(isFeatureId('core')).toBe(true);
    expect(isFeatureId('routing')).toBe(true);
    expect(isFeatureId('theming')).toBe(true);
  });

  it('returns false for invalid feature IDs', () => {
    expect(isFeatureId('invalid')).toBe(false);
    expect(isFeatureId('')).toBe(false);
    expect(isFeatureId('CORE')).toBe(false);
  });
});
