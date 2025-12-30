/**
 * get_scaffold tool
 *
 * Returns complete scaffold information for selected features.
 * This includes dependencies, file structure, config files,
 * and setup commands needed to create a new project.
 *
 * Uses lazy loading - config files, docs, and examples are
 * fetched on demand via get_file and get_example tools.
 */

import { z } from 'zod';
import { FEATURE_IDS, FEATURES } from '../features/index.js';
import { computeScaffold, resolveFeatureDependencies } from '../utils/index.js';
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
});

export type GetScaffoldInput = z.infer<typeof getScaffoldSchema>;

export async function getScaffold(input: GetScaffoldInput) {
  const { features, projectName = 'my-app' } = input;

  // Resolve dependencies
  const resolvedFeatures = resolveFeatureDependencies(features);

  // Get scaffold result
  const scaffold = await computeScaffold(features, projectName);

  // Build feature details with patterns (for use with get_example)
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
    routesTs: scaffold.routesTs,
    docs: scaffold.docs,
    instructions: generateInstructions(scaffold.setupCommands, resolvedFeatures),
  };
}

function generateInstructions(setupCommands: string[], features: string[]): string {
  const hasRouting = features.includes('routing');

  return `## Setup Instructions

1. Create project with \`packageJson\`
2. Use generated content: \`claudeMd\`, \`viteEnvDts\`, \`envTs\`${hasRouting ? ', `routesTs`' : ''}
3. Fetch config files: \`get_file({ path: "..." })\` for each in \`configFiles\`
4. Fetch docs: \`get_file({ path: "..." })\` for each in \`docs\`
5. Create source files: \`get_example({ pattern: "..." })\`
6. Run: ${setupCommands.join(' && ')}

## IMPORTANT

Templates are written for ALL features. Remove imports, providers, and code for features not in \`resolvedFeatures\`.`;
}

/** Tool definition derived from Zod schema - single source of truth (Zod v4 native). */
export const getScaffoldToolDefinition: ToolDefinition = {
  name: 'get_scaffold',
  description: `Get complete scaffold information for a new react-spa-scaffold project.

Returns package.json, file structure paths, setup commands, and generated files.

**Lazy Loading** (reduces response from ~50K to ~15K tokens):
- \`configFiles\`: paths only → use \`get_file({ path: "..." })\`
- \`docs\`: paths only → use \`get_file({ path: "..." })\`
- \`featureDetails[].patterns\`: pattern names → use \`get_example({ pattern: "..." })\`

**Generated Content** (included directly):
- \`claudeMd\`: CLAUDE.md content
- \`viteEnvDts\`, \`envTs\`: TypeScript declarations
- \`routesTs\`: Route constants (if routing feature selected)

IMPORTANT: Templates contain code for ALL features. Strip imports and code for features not in \`resolvedFeatures\`.

Feature dependencies: theming → state (auto-included)

Example: features: ["routing", "ui", "theming"] → resolvedFeatures: ["core", "routing", "ui", "theming", "state"]`,
  inputSchema: z.toJSONSchema(getScaffoldSchema) as ToolDefinition['inputSchema'],
};
