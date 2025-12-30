/**
 * Type definitions for MCP tools
 *
 * Uses discriminated unions and generics for full type safety
 * between Zod schemas and handler function signatures.
 */

import type { z, ZodType } from 'zod';

/** MCP tool definition schema for ListToolsRequest. */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Tool configuration with schema - handler receives validated input.
 */
export interface ToolConfigWithSchema<TSchema extends ZodType> {
  definition: ToolDefinition;
  schema: TSchema;
  handler: (input: z.infer<TSchema>) => Promise<unknown>;
}

/**
 * Tool configuration without schema - handler receives no arguments.
 */
export interface ToolConfigNoSchema {
  definition: ToolDefinition;
  schema: null;
  handler: () => unknown;
}

/**
 * Union type for tool configurations.
 * Discriminated by `schema` field (null vs ZodType).
 */
export type ToolConfig = ToolConfigWithSchema<ZodType> | ToolConfigNoSchema;

/** Tool registry type. */
export type ToolRegistry = Record<string, ToolConfig>;
