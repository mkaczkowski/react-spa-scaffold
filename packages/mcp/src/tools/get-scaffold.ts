/**
 * get_scaffold tool
 *
 * Returns complete scaffold information for selected features.
 * This includes dependencies, file structure, config files,
 * and setup commands needed to create a new project.
 *
 * Uses lazy loading - all file content is fetched on demand
 * via get_file tool.
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

  // Build feature details
  const featureDetails = resolvedFeatures.map((id) => {
    const feature = FEATURES[id];
    return {
      id,
      name: feature.name,
      wasExplicitlySelected: features.includes(id),
      wasAutoIncluded: !features.includes(id),
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
3. Fetch ALL files via \`get_file({ path: "..." })\`:
   - \`configFiles\`: config file paths
   - \`docs\`: documentation paths
   - \`fileStructure\`: ALL source file paths
4. Strip imports/code for features NOT in \`resolvedFeatures\`
5. Run: ${setupCommands.join(' && ')}

## CRITICAL

Do NOT generate file content. Fetch via \`get_file\`, then adapt for selected features.`;
}

/** Tool definition derived from Zod schema - single source of truth (Zod v4 native). */
export const getScaffoldToolDefinition: ToolDefinition = {
  name: 'get_scaffold',
  description: `Get complete scaffold information for a new react-spa-scaffold project.

Returns package.json, file structure paths, setup commands, and generated files.

**Lazy Loading** - fetch ALL content via \`get_file({ path: "..." })\`:
- \`configFiles\`: config file paths
- \`docs\`: documentation paths
- \`fileStructure\`: ALL source file paths

**Generated Content** (included directly):
- \`claudeMd\`: CLAUDE.md content
- \`viteEnvDts\`, \`envTs\`: TypeScript declarations
- \`routesTs\`: Route constants (if routing feature selected)

CRITICAL: Do NOT generate file content. Fetch via \`get_file\`, then strip imports/code for features NOT in \`resolvedFeatures\`.

Feature dependencies: theming → state (auto-included)

Example: features: ["routing", "ui", "theming"] → resolvedFeatures: ["core", "routing", "ui", "theming", "state"]`,
  inputSchema: z.toJSONSchema(getScaffoldSchema) as ToolDefinition['inputSchema'],
};
