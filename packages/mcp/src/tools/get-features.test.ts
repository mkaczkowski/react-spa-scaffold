/**
 * Tests for get_features tool
 */

import { describe, it, expect } from 'vitest';

import { getFeatures } from './get-features.js';
import { FEATURE_IDS } from '../features/index.js';

describe('get_features tool', () => {
  it('returns all feature IDs', () => {
    const features = getFeatures();

    expect(features).toHaveLength(FEATURE_IDS.length);
    expect(features.map((f) => f.id)).toEqual(expect.arrayContaining([...FEATURE_IDS]));
  });

  it('returns core as required', () => {
    const features = getFeatures();
    const core = features.find((f) => f.id === 'core');

    expect(core).toBeDefined();
    expect(core?.required).toBe(true);
  });

  it('returns proper structure for each feature', () => {
    const features = getFeatures();

    for (const feature of features) {
      expect(feature).toHaveProperty('id');
      expect(feature).toHaveProperty('name');
      expect(feature).toHaveProperty('description');
      expect(feature).toHaveProperty('required');
    }
  });

  it('does not include redundant includes property', () => {
    const features = getFeatures();

    for (const feature of features) {
      expect(feature).not.toHaveProperty('includes');
    }
  });

  it('mobile feature exists and is not required', () => {
    const features = getFeatures();
    const mobile = features.find((f) => f.id === 'mobile');

    expect(mobile).toBeDefined();
    expect(mobile?.required).toBe(false);
    expect(mobile?.name).toBe('Mobile Support');
  });

  it('theming feature exists and is not required', () => {
    const features = getFeatures();
    const theming = features.find((f) => f.id === 'theming');

    expect(theming).toBeDefined();
    expect(theming?.required).toBe(false);
    expect(theming?.name).toBe('Theming');
  });
});
