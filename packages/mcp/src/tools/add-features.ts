/**
 * add_features tool
 *
 * Get files and dependencies for adding features to an existing project.
 * Unlike get_scaffold, this tool does NOT auto-include the `core` feature,
 * as it assumes the project already has core scaffolded.
 */

import { z } from 'zod';

import { FEATURE_IDS, FEATURES } from '../features/index.js';
import type { FeatureId } from '../features/types.js';
import { computeDocsForFeatures } from '../utils/docs.js';
import {
  collectFeatureFiles,
  getConfigFiles,
  mergeDependencies,
  mergeScripts,
  resolveFeatureDependencies,
} from '../utils/scaffold/index.js';
import { generateEnvTs, generateRoutesTs, generateViteEnvDts } from '../utils/scaffold/generators.js';
import type { ToolDefinition } from './types.js';

/** Zod schema for add_features input */
export const addFeaturesSchema = z.object({
  features: z
    .array(z.string())
    .min(1, 'At least one feature required')
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
    .describe('List of feature IDs to add (e.g., ["routing", "state", "forms"])'),
});

export type AddFeaturesInput = z.infer<typeof addFeaturesSchema>;

/** Handler function */
export async function addFeatures(input: AddFeaturesInput) {
  const { features } = input;

  // 1. Resolve feature dependencies WITHOUT auto-including core
  // (existing projects already have core scaffolded)
  const resolvedFeatureIds = resolveFeatureDependencies(features, { includeCore: false });

  // 2. Merge dependencies from all features
  const { dependencies, devDependencies, warnings } = await mergeDependencies(resolvedFeatureIds);

  // 3. Merge scripts
  const scripts = mergeScripts(resolvedFeatureIds);

  // 4. Collect file paths from all features
  const { files, testFiles } = collectFeatureFiles(resolvedFeatureIds);

  // 5. Get config files that may need updates
  const configFiles = getConfigFiles(resolvedFeatureIds);

  // 6. Get relevant documentation
  const docs = computeDocsForFeatures(resolvedFeatureIds);

  // 7. Generate code if routing/api/observability included
  const regenerated: {
    routesTs?: string;
    envTs?: string;
    viteEnvDts?: string;
  } = {};

  if (resolvedFeatureIds.includes('routing')) {
    regenerated.routesTs = generateRoutesTs();
  }

  // Always generate env files if api or observability is added
  if (resolvedFeatureIds.includes('api') || resolvedFeatureIds.includes('observability')) {
    regenerated.envTs = generateEnvTs(resolvedFeatureIds);
    regenerated.viteEnvDts = generateViteEnvDts(resolvedFeatureIds);
  }

  // 8. Build feature details
  const featureDetails = resolvedFeatureIds.map((id) => {
    const feature = FEATURES[id];
    return {
      id,
      name: feature.name,
      description: feature.description,
      wasExplicitlySelected: features.includes(id),
      wasAutoIncluded: !features.includes(id),
    };
  });

  return {
    // Selected and resolved features
    selectedFeatures: features,
    resolvedFeatures: resolvedFeatureIds,
    featureDetails,

    // Dependencies to install
    dependencies,
    devDependencies,

    // Scripts to add to package.json
    scripts,

    // Files to create (fetch via get_file)
    files,
    testFiles,

    // Config files that may need updates
    configFiles,

    // Documentation files (fetch via get_file)
    docs,

    // Generated code (write directly, no need for get_file)
    regenerated,

    // Warnings (e.g., missing deps in source package.json)
    warnings,

    // Usage instructions
    instructions: generateInstructions(resolvedFeatureIds),
  };
}

function generateInstructions(features: FeatureId[]): string {
  const hasRouting = features.includes('routing');
  const hasEnvChanges = features.includes('api') || features.includes('observability');

  return `## Integration Instructions

1. Install dependencies:
   \`npm install <dependencies>\`
   \`npm install -D <devDependencies>\`

2. Add scripts to package.json

3. Write generated content (if any):${hasRouting ? '\n   - `src/lib/routes.ts` ← from `regenerated.routesTs`' : ''}${hasEnvChanges ? '\n   - `src/lib/env.ts` ← from `regenerated.envTs`\n   - `src/vite-env.d.ts` ← from `regenerated.viteEnvDts`' : ''}

4. For EACH file in \`files\` and \`testFiles\`:
   - Fetch content via \`get_file({ path: "..." })\`
   - Create file in project
   - Integrate with existing code as needed

5. Review and update config files:
   - Check each file in \`configFiles\`
   - Merge any feature-specific configurations

6. Update existing files to use new features:
   - Import and use new stores/hooks/components
   - Add providers to App.tsx if needed`;
}

/** Tool definition */
export const addFeaturesToolDefinition: ToolDefinition = {
  name: 'add_features',
  description: `Get files and dependencies for adding features to an existing project.

Returns metadata for incrementally adding features without scaffolding entire project.
Does NOT auto-include \`core\` feature (assumes project already has core).

**Returns:**
- \`resolvedFeatures\`: Features including auto-resolved dependencies
- \`featureDetails\`: Details with wasExplicitlySelected/wasAutoIncluded flags
- \`dependencies\`: npm packages to install (production)
- \`devDependencies\`: npm packages to install (dev)
- \`scripts\`: npm scripts to add
- \`files\`: Source files to create (fetch via get_file)
- \`testFiles\`: Test files to create (fetch via get_file)
- \`configFiles\`: Config files that may need updates
- \`docs\`: Documentation files (fetch via get_file)
- \`regenerated\`: Generated code (routesTs, envTs, viteEnvDts)
- \`warnings\`: Any issues encountered
- \`instructions\`: Integration guidance

**Feature Dependencies:**
- theming → state (auto-included)

**Usage Pattern:**
1. Call add_features with feature list
2. Install dependencies
3. Add scripts to package.json
4. Write generated content from \`regenerated\`
5. Fetch each file via \`get_file({ path: "..." })\`
6. Integrate files into existing project
7. Update config files as needed

**Example:** features: ["theming"] → resolvedFeatures: ["theming", "state"]`,
  inputSchema: z.toJSONSchema(addFeaturesSchema) as ToolDefinition['inputSchema'],
};
