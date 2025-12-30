/**
 * Setup commands utility - generates npm commands for scaffolded projects.
 */

import { FEATURE, SCRIPT } from '../../constants.js';
import type { FeatureId } from '../../features/types.js';

/** Generate setup commands based on selected features. */
export function getSetupCommands(featureIds: FeatureId[]): string[] {
  const commands: string[] = ['npm install'];

  if (featureIds.includes(FEATURE.DEVTOOLS)) {
    commands.push(`npm run ${SCRIPT.PREPARE}`);
  }

  if (featureIds.includes(FEATURE.TESTING)) {
    commands.push('npx playwright install chromium');
  }

  if (featureIds.includes(FEATURE.I18N)) {
    commands.push(`npm run ${SCRIPT.I18N_EXTRACT}`);
  }

  return commands;
}
