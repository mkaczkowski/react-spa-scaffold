/**
 * CLAUDE.md generator - composes sections based on selected features.
 */

import { FEATURE } from '../../../constants.js';
import type { FeatureId } from '../../../features/types.js';
import {
  generateHeader,
  generateCommandsSection,
  generateStructureSection,
  generateCodePatternsSection,
  generateUiSection,
  generateMobileSection,
  generateThemingSection,
  generateAuthSection,
  generateDatabaseSection,
  generateElectronSection,
  generateMcpSection,
  generateI18nSection,
  generateTestingSection,
  generateGotchasSection,
} from './sections.js';

/** Generates CLAUDE.md content based on selected features. */
export function generateClaudeMd(
  featureIds: FeatureId[],
  projectName: string,
  scripts: Record<string, string>,
): string {
  const sections = [
    generateHeader(projectName),
    generateCommandsSection(scripts),
    generateStructureSection(featureIds),
    generateCodePatternsSection(featureIds),
    featureIds.includes(FEATURE.UI) && generateUiSection(),
    featureIds.includes(FEATURE.MOBILE) && generateMobileSection(),
    featureIds.includes(FEATURE.THEMING) && generateThemingSection(),
    featureIds.includes(FEATURE.AUTH) && generateAuthSection(),
    featureIds.includes(FEATURE.DATABASE) && generateDatabaseSection(),
    featureIds.includes(FEATURE.ELECTRON) && generateElectronSection(),
    generateMcpSection(featureIds),
    featureIds.includes(FEATURE.I18N) && generateI18nSection(),
    featureIds.includes(FEATURE.TESTING) && generateTestingSection(),
    generateGotchasSection(featureIds),
  ];

  return sections.filter(Boolean).join('\n');
}
