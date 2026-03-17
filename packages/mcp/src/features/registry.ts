/**
 * Feature Registry - Aggregates all feature definitions.
 */

import type { FeatureRegistry } from './types.js';
import {
  core,
  mobile,
  routing,
  ui,
  forms,
  state,
  api,
  i18n,
  testing,
  performance,
  devtools,
  ci,
  observability,
  theming,
  auth,
  database,
  deployment,
  electron,
  pwa,
} from './definitions/index.js';

/** All available features for scaffolding. */
export const FEATURES: FeatureRegistry = {
  core,
  mobile,
  routing,
  ui,
  forms,
  state,
  api,
  i18n,
  testing,
  performance,
  devtools,
  ci,
  observability,
  theming,
  auth,
  database,
  deployment,
  electron,
  pwa,
};

export type { FeatureId } from './types.js';
