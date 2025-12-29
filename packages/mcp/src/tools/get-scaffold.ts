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
    instructions: generateInstructions(projectName, scaffold.setupCommands, resolvedFeatures),
  };
}

function generateInstructions(projectName: string, setupCommands: string[], features: string[]): string {
  const hasRouting = features.includes('routing');

  return `## Setup Instructions

1. Create project directory:
   \`\`\`bash
   mkdir ${projectName} && cd ${projectName}
   \`\`\`

2. Initialize package.json with the provided dependencies

3. Create the file structure as listed

4. Create src/vite-env.d.ts using the provided viteEnvDts content

5. Create src/lib/env.ts using the provided envTs content
${hasRouting ? '\n6. Create src/lib/routes.ts using the provided routesTs content\n' : ''}
7. Create CLAUDE.md using the provided claudeMd content

8. Create docs/ directory with the provided docs content

9. Run setup commands:
   \`\`\`bash
   ${setupCommands.join('\n   ')}
   \`\`\`

10. Start development:
   \`\`\`bash
   npm run dev
   \`\`\`

## SEO Setup
- SEO component is always included (from core feature)

## Notes
- Core feature is always included
- Use get_example tool to get code patterns for each file type
- CLAUDE.md, vite-env.d.ts, env.ts content is dynamically generated based on selected features`;
}

export const getScaffoldToolDefinition = {
  name: 'get_scaffold',
  description: `Get complete scaffold information for a new react-spa-scaffold project.

Given a list of features, returns:
- Resolved dependencies (including auto-required features)
- Complete package.json (dependencies + devDependencies + scripts)
- File structure to create
- Config files needed
- Documentation files (filtered by selected features)
- Setup commands to run after creation
- Generated file contents (env.ts, routes.ts, etc.) based on selected features

The AI agent should use this information to:
1. Create the project directory
2. Write package.json
3. Create generated files (viteEnvDts, envTs, routesTs) using provided content
4. Create all other files using get_example for patterns
5. Create docs/ with provided documentation
6. Run setup commands

Feature dependencies (auto-included):
- theming → state (for Zustand persistence)

SEO Component (always included from core):
- Import in App.tsx: import { SEO } from '@/components/shared';
- Add <SEO description="..." /> in App.tsx for site-wide default meta tags
- Individual pages can override with page-specific SEO props
- Use get_example with pattern 'seo-component' for implementation details

When forms feature is selected:
- RegisterForm component is displayed on HomePage
- No additional routing required

Example usage:
- features: ["routing", "ui", "theming", "testing"]
- This will auto-include: core, state`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      features: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description: 'List of feature IDs to include',
      },
      projectName: {
        type: 'string' as const,
        description: 'Name for the new project',
      },
      includeExamples: {
        type: 'boolean' as const,
        description: 'Include code examples for patterns',
      },
    },
    required: ['features'],
  },
};
