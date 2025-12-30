/**
 * Tool Registry - Single source of truth for all MCP tools.
 *
 * Each tool is typed according to its schema presence:
 * - ToolConfigNoSchema: handlers with no input
 * - ToolConfigWithSchema: handlers receiving validated Zod input
 */

import type { ToolRegistry, ToolDefinition, ToolConfigNoSchema, ToolConfigWithSchema } from './types.js';
import { getFeatures, getFeaturesToolDefinition } from './get-features.js';
import { getScaffold, getScaffoldSchema, getScaffoldToolDefinition } from './get-scaffold.js';
import { getExample, getExampleSchema, getExampleToolDefinition } from './get-example.js';

/** Tool: get_features - no input required */
const getFeaturesConfig: ToolConfigNoSchema = {
  definition: getFeaturesToolDefinition,
  schema: null,
  handler: getFeatures,
};

/** Tool: get_scaffold - requires features array input */
const getScaffoldConfig: ToolConfigWithSchema<typeof getScaffoldSchema> = {
  definition: getScaffoldToolDefinition,
  schema: getScaffoldSchema,
  handler: getScaffold,
};

/** Tool: get_example - requires pattern input */
const getExampleConfig: ToolConfigWithSchema<typeof getExampleSchema> = {
  definition: getExampleToolDefinition,
  schema: getExampleSchema,
  handler: getExample,
};

/** All registered MCP tools. */
export const TOOL_REGISTRY: ToolRegistry = {
  get_features: getFeaturesConfig,
  get_scaffold: getScaffoldConfig,
  get_example: getExampleConfig,
};

/** Get all tool definitions for ListToolsRequest. */
export function getToolDefinitions(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY).map((tool) => tool.definition);
}
