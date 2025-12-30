/**
 * MCP Server for react-spa-scaffold scaffolding.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Direct imports - flattened for faster startup
import { TOOL_REGISTRY, getToolDefinitions } from './tools/registry.js';
import { getDocumentationResources, readDocumentation, isValidDocumentationUri } from './resources/docs.js';
import { VERSION } from './version.js';

function jsonResponse(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

function errorResponse(message: string) {
  return {
    content: [{ type: 'text' as const, text: message }],
    isError: true,
  };
}

const SERVER_INSTRUCTIONS = `
react-spa-scaffold MCP Server - Project Scaffolding Assistant

Usage:
1. get_features - list available feature modules
2. get_scaffold - get project structure (paths only)
3. get_file - fetch content for EACH file

CRITICAL: Do not generate files. Fetch via get_file, then strip unselected features.

Tips:
- Core feature is always included automatically
- Theming feature automatically includes state (requires Zustand)
- Read docs:// resources for conventions and best practices
`.trim();

/** Creates and configures the MCP server. */
export function createServer(): Server {
  const server = new Server(
    { name: 'react-spa-scaffold-mcp', version: VERSION },
    { capabilities: { tools: {}, resources: {} }, instructions: SERVER_INSTRUCTIONS },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: getToolDefinitions(),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const toolConfig = TOOL_REGISTRY[name];

    if (!toolConfig) {
      return errorResponse(`Unknown tool: ${name}`);
    }

    try {
      if (toolConfig.schema) {
        const parsed = toolConfig.schema.safeParse(args);
        if (!parsed.success) {
          return errorResponse(`Invalid input: ${parsed.error.message}`);
        }
        const result = await toolConfig.handler(parsed.data);
        return jsonResponse(result);
      }

      const result = await toolConfig.handler();
      return jsonResponse(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return errorResponse(`Error executing ${name}: ${message}`);
    }
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: getDocumentationResources(),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (!isValidDocumentationUri(uri)) {
      throw new Error(`Unknown resource: ${uri}`);
    }

    const content = await readDocumentation(uri);
    if (!content) {
      throw new Error(`Failed to read resource: ${uri}`);
    }

    return {
      contents: [{ uri, mimeType: 'text/markdown', text: content }],
    };
  });

  return server;
}
