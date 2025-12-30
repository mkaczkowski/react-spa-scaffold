/**
 * Type definitions for MCP tools
 */

import type { z } from 'zod';

/** MCP tool definition schema for ListToolsRequest. */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

/** Tool configuration - discriminated by schema presence. */
export interface ToolConfig {
  definition: ToolDefinition;
  schema: z.ZodType | null;
  // Handler accepts validated input when schema exists, or no args when null
  // Using Function for flexibility - actual type safety comes from schema validation at runtime
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handler: Function;
}

/** Tool registry type. */
export type ToolRegistry = Record<string, ToolConfig>;
