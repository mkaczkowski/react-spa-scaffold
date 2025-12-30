/**
 * Tool Registry
 *
 * Single source of truth for all MCP tool definitions and handlers.
 * Adding a new tool = add one entry here.
 */

import type { z } from 'zod';

import {
  getFeatures,
  getFeaturesToolDefinition,
  getScaffold,
  getScaffoldSchema,
  getScaffoldToolDefinition,
  getExample,
  getExampleSchema,
  getExampleToolDefinition,
} from './index.js';

/**
 * Tool configuration type
 */
interface ToolConfig {
  definition: {
    name: string;
    description: string;
    inputSchema: object;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (input?: any) => unknown;
  schema: z.ZodType | null;
}

/**
 * All registered MCP tools
 *
 * To add a new tool:
 * 1. Create the tool in its own file (e.g., get-my-tool.ts)
 * 2. Export definition, schema, and handler from that file
 * 3. Add an entry to this registry
 */
export const TOOL_REGISTRY: Record<string, ToolConfig> = {
  get_features: {
    definition: getFeaturesToolDefinition,
    handler: getFeatures,
    schema: null,
  },

  get_scaffold: {
    definition: getScaffoldToolDefinition,
    handler: getScaffold,
    schema: getScaffoldSchema,
  },

  get_example: {
    definition: getExampleToolDefinition,
    handler: getExample,
    schema: getExampleSchema,
  },
};

export type ToolName = keyof typeof TOOL_REGISTRY;

/**
 * Get all tool definitions for ListToolsRequest
 */
export function getToolDefinitions() {
  return Object.values(TOOL_REGISTRY).map((tool) => tool.definition);
}
