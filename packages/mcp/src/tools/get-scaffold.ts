/**
 * get_scaffold tool
 *
 * Returns complete scaffold information for selected features.
 * This includes dependencies, file structure, config files,
 * and setup commands needed to create a new project.
 */

import { z } from "zod";
import { FEATURE_IDS, FEATURES } from "../features/index.js";
import {
  computeScaffold,
  resolveFeatureDependencies,
  getFeatureExamples,
  type CodeExample,
} from "../utils/index.js";

export const getScaffoldSchema = z.object({
  features: z
    .array(z.string())
    .max(15, "Maximum 15 features allowed")
    .refine(
      (features) => features.every((f) => f in FEATURES),
      (features) => ({
        message: `Invalid features: ${features.filter((f) => !(f in FEATURES)).join(", ")}. Valid: ${FEATURE_IDS.join(", ")}`,
      }),
    )
    .describe(
      'List of feature IDs to include (e.g., ["routing", "ui", "forms"])',
    ),
  projectName: z
    .string()
    .max(50, "Project name too long")
    .regex(
      /^[a-z0-9-]*$/,
      "Project name must be lowercase letters, numbers, and hyphens only",
    )
    .optional()
    .describe('Name for the new project (defaults to "my-app")'),
  includeExamples: z
    .boolean()
    .optional()
    .describe(
      "Include code examples for each feature pattern (default: false)",
    ),
});

export type GetScaffoldInput = z.infer<typeof getScaffoldSchema>;

export async function getScaffold(input: GetScaffoldInput) {
  const { features, projectName = "my-app", includeExamples = false } = input;

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
    examples,
    instructions: generateInstructions(projectName, scaffold.setupCommands),
  };
}

function generateInstructions(
  projectName: string,
  setupCommands: string[],
): string {
  return `## Setup Instructions

1. Create project directory:
   \`\`\`bash
   mkdir ${projectName} && cd ${projectName}
   \`\`\`

2. Initialize package.json with the provided dependencies

3. Create the file structure as listed

4. Run setup commands:
   \`\`\`bash
   ${setupCommands.join("\n   ")}
   \`\`\`

5. Start development:
   \`\`\`bash
   npm run dev
   \`\`\`

## Notes
- Core feature is always included
- Auto-included features are dependencies of selected features
- Use get_example tool to get code patterns for each file type`;
}

export const getScaffoldToolDefinition = {
  name: "get_scaffold",
  description: `Get complete scaffold information for a new webapp-base project.

Given a list of features, returns:
- Resolved dependencies (including auto-required features)
- Complete package.json (dependencies + devDependencies + scripts)
- File structure to create
- Config files needed
- Setup commands to run after creation

The AI agent should use this information to:
1. Create the project directory
2. Write package.json
3. Create all files using get_example for patterns
4. Run setup commands

Example usage:
- features: ["routing", "ui", "forms", "testing"]
- This will auto-include: core, state (ui requires it)`,
  inputSchema: {
    type: "object" as const,
    properties: {
      features: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "List of feature IDs to include",
      },
      projectName: {
        type: "string" as const,
        description: "Name for the new project",
      },
      includeExamples: {
        type: "boolean" as const,
        description: "Include code examples for patterns",
      },
    },
    required: ["features"],
  },
};
