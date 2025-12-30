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

1. Create project directory and \`package.json\`
2. Write generated content directly:
   - \`CLAUDE.md\` ← from \`claudeMd\`
   - \`src/vite-env.d.ts\` ← from \`viteEnvDts\`
   - \`src/lib/env.ts\` ← from \`envTs\`${hasRouting ? '\n   - `src/lib/routes.ts` ← from `routesTs`' : ''}

3. **Create progress tracking file** at project root:

\`\`\`markdown
# scaffold-progress.md

## Source Files
- [ ] src/App.tsx
- [ ] src/index.css
... (list EVERY file from \`fileStructure\`)

## Config Files
- [ ] vite.config.ts
... (list EVERY file from \`configFiles\`)

## Documentation
- [ ] docs/ARCHITECTURE.md
... (list EVERY file from \`docs\`)
\`\`\`

4. For EACH file in the tracking list:
   - Fetch content via \`get_file({ path: "..." })\`
   - Write file to project
   - Mark \`[x]\` in scaffold-progress.md

5. **Before running setup commands**, scan scaffold-progress.md for any unchecked boxes
6. Delete scaffold-progress.md
7. Run: ${setupCommands.join(' && ')}

## CRITICAL

- Create scaffold-progress.md BEFORE fetching any files
- Mark each file [x] IMMEDIATELY after creating it
- Do NOT run setup commands until ALL boxes are checked
- Do NOT generate file content - fetch via \`get_file\``;
}

/** Tool definition derived from Zod schema - single source of truth (Zod v4 native). */
export const getScaffoldToolDefinition: ToolDefinition = {
  name: 'get_scaffold',
  description: `Get complete scaffold information for a new react-spa-scaffold project.

Returns package.json, file structure paths, setup commands, and generated files.

**Lazy Loading** - fetch ALL content via \`get_file({ path: "..." })\`:
- \`fileStructure\`: ALL source files (includes test files)
- \`configFiles\`: config file paths
- \`docs\`: documentation paths

**Generated Content** (included directly - write these first):
- \`claudeMd\`: CLAUDE.md content
- \`viteEnvDts\`, \`envTs\`: TypeScript declarations
- \`routesTs\`: Route constants (if routing feature selected)

## File Tracking Protocol (MUST FOLLOW)

After receiving this response, create \`scaffold-progress.md\` at project root:
1. List ALL files from fileStructure, configFiles, and docs as unchecked boxes (\`- [ ]\`)
2. Fetch each file via get_file and mark [x] after creation
3. Before running setup commands, scan for any unchecked boxes
4. Delete scaffold-progress.md, then run setup commands

CRITICAL: Do NOT skip test files or documentation. ALL files must be created.

Feature dependencies: theming → state (auto-included)

Example: features: ["routing", "ui", "theming"] → resolvedFeatures: ["core", "routing", "ui", "theming", "state"]`,
  inputSchema: z.toJSONSchema(getScaffoldSchema) as ToolDefinition['inputSchema'],
};
