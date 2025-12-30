/**
 * get_scaffold tool
 *
 * Returns complete scaffold information for selected features.
 * This includes dependencies, file structure, config files,
 * and setup commands needed to create a new project.
 */

import { z } from 'zod';
import { FEATURE_IDS, FEATURES } from '../features/index.js';
import { computeScaffold, resolveFeatureDependencies, getFeatureExamples, type CodeExample } from '../utils/index.js';
import type { ToolDefinition } from './types.js';

/** Zod schema for get_scaffold input - single source of truth. */
export const getScaffoldSchema = z.object({
  features: z
    .array(z.string())
    .max(15, 'Maximum 15 features allowed')
    .check((ctx) => {
      const invalidFeatures = ctx.value.filter((f: string) => !(f in FEATURES));
      if (invalidFeatures.length > 0) {
        ctx.issues.push({
          code: 'custom',
          message: `Invalid features: ${invalidFeatures.join(', ')}. Valid: ${FEATURE_IDS.join(', ')}`,
          input: ctx.value,
          path: [],
        });
      }
    })
    .describe('List of feature IDs to include (e.g., ["routing", "ui", "forms"])'),
  projectName: z
    .string()
    .max(50, 'Project name too long')
    .regex(/^[a-z0-9-]*$/, 'Project name must be lowercase letters, numbers, and hyphens only')
    .optional()
    .describe('Name for the new project (defaults to "my-app")'),
  includeExamples: z.boolean().optional().describe('Include code examples for each feature pattern (default: false)'),
});

export type GetScaffoldInput = z.infer<typeof getScaffoldSchema>;

export async function getScaffold(input: GetScaffoldInput) {
  const { features, projectName = 'my-app', includeExamples = false } = input;

  // Resolve dependencies
  const resolvedFeatures = resolveFeatureDependencies(features);

  // Get scaffold result
  const scaffold = await computeScaffold(features, projectName);

  // Build feature details
  const featureDetails = resolvedFeatures.map((id) => {
    const feature = FEATURES[id];
    return {
      id,
      name: feature.name,
      wasExplicitlySelected: features.includes(id),
      wasAutoIncluded: !features.includes(id),
      patterns: feature.patterns,
    };
  });

  // Optionally include examples
  let examples: Record<string, CodeExample[]> | undefined;
  if (includeExamples) {
    examples = {};
    for (const id of resolvedFeatures) {
      const feature = FEATURES[id];
      if (feature.patterns.length > 0) {
        examples[id] = await getFeatureExamples(feature.patterns);
      }
    }
  }

  return {
    projectName,
    selectedFeatures: features,
    resolvedFeatures,
    featureDetails,
    packageJson: scaffold.packageJson,
    fileStructure: scaffold.structure,
    configFiles: scaffold.configFiles,
    setupCommands: scaffold.setupCommands,
    claudeMd: scaffold.claudeMd,
    viteEnvDts: scaffold.viteEnvDts,
    envTs: scaffold.envTs,
    routesTs: scaffold.routesTs, // Only present when routing feature is selected
    docs: scaffold.docs,
    examples,
    instructions: generateInstructions(scaffold.setupCommands, resolvedFeatures),
  };
}

function generateInstructions(setupCommands: string[], features: string[]): string {
  const hasRouting = features.includes('routing');

  return `## Setup Instructions

1. Create project directory and initialize with provided \`packageJson\`
2. Create files from \`fileStructure\` using \`get_example\` patterns
3. Use provided content directly for: \`viteEnvDts\`, \`envTs\`${hasRouting ? ', `routesTs`' : ''}, \`claudeMd\`, \`docs\`
4. Run: ${setupCommands.join(' && ')}

## IMPORTANT

Templates are written for ALL features. Remove imports, providers, and code for features not in \`resolvedFeatures\`.`;
}

/** Tool definition derived from Zod schema - single source of truth (Zod v4 native). */
export const getScaffoldToolDefinition: ToolDefinition = {
  name: 'get_scaffold',
  description: `Get complete scaffold information for a new react-spa-scaffold project.

Returns package.json, file structure, config files, generated content (env.ts, routes.ts, CLAUDE.md), and setup commands.

IMPORTANT: Templates contain code for ALL features. Strip imports and code for features not in \`resolvedFeatures\`.

Feature dependencies: theming → state (auto-included)

Example: features: ["routing", "ui", "theming"] → resolvedFeatures: ["core", "routing", "ui", "theming", "state"]`,
  inputSchema: z.toJSONSchema(getScaffoldSchema) as ToolDefinition['inputSchema'],
};
