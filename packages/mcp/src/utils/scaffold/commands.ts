/**
 * Setup commands utility
 *
 * Generates the npm commands needed to set up a scaffolded project.
 */

import type { FeatureId } from '../../features/types.js';

/**
 * Generate setup commands based on selected features
 */
export function getSetupCommands(featureIds: FeatureId[]): string[] {
  const commands: string[] = ['npm install'];

  if (featureIds.includes('devtools')) {
    commands.push('npm run prepare'); // Initialize husky
  }

  if (featureIds.includes('testing')) {
    commands.push('npx playwright install chromium'); // Install Playwright browser
  }

  if (featureIds.includes('i18n')) {
    commands.push('npm run i18n:extract'); // Extract initial translations
  }

  return commands;
}
