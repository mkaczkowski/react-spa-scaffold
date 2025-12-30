/**
 * Tool Registry - Single source of truth for all MCP tools.
 */

import type { ToolRegistry, ToolDefinition } from './types.js';
import { getFeatures, getFeaturesToolDefinition } from './get-features.js';
import { getScaffold, getScaffoldSchema, getScaffoldToolDefinition } from './get-scaffold.js';
import { getExample, getExampleSchema, getExampleToolDefinition } from './get-example.js';

/** All registered MCP tools. */
export const TOOL_REGISTRY: ToolRegistry = {
  get_features: {
    definition: getFeaturesToolDefinition,
    schema: null,
    handler: getFeatures,
  },

  get_scaffold: {
    definition: getScaffoldToolDefinition,
    schema: getScaffoldSchema,
    handler: getScaffold,
  },

  get_example: {
    definition: getExampleToolDefinition,
    schema: getExampleSchema,
    handler: getExample,
  },
};

/** Get all tool definitions for ListToolsRequest. */
export function getToolDefinitions(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY).map((tool) => tool.definition);
}
