/**
 * MCP Server for webapp-base scaffolding
 *
 * This server provides tools and resources for AI agents to scaffold
 * new projects based on the webapp-base template.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  getFeatures,
  getFeaturesToolDefinition,
  getScaffold,
  getScaffoldSchema,
  getScaffoldToolDefinition,
  getExample,
  getExampleSchema,
  getExampleToolDefinition,
} from './tools/index.js';

import { getDocumentationResources, readDocumentation, isValidDocumentationUri } from './resources/index.js';
import { VERSION } from './version.js';

// ═══════════════════════════════════════════════════════════════════════════
// Response Helpers
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// Server Instructions
// ═══════════════════════════════════════════════════════════════════════════

const SERVER_INSTRUCTIONS = `
webapp-base MCP Server - Project Scaffolding Assistant

Usage:
1. Call get_features to see available feature modules
2. Call get_scaffold with desired features to get project structure
3. Call get_example to get code patterns for specific file types
4. Read docs:// resources for conventions and best practices

Tips:
- Core feature is always included automatically
- Features are independent - select only what you need
- Check docs://conventions before generating code
`.trim();

/**
 * Create and configure the MCP server
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: 'webapp-base-mcp',
      version: VERSION,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
      instructions: SERVER_INSTRUCTIONS,
    },
  );

  // ═══════════════════════════════════════════════════════════════════════
  // TOOLS
  // ═══════════════════════════════════════════════════════════════════════

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [getFeaturesToolDefinition, getScaffoldToolDefinition, getExampleToolDefinition],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'get_features':
          return jsonResponse(getFeatures());

        case 'get_scaffold': {
          const parsed = getScaffoldSchema.safeParse(args);
          if (!parsed.success) {
            return errorResponse(`Invalid input: ${parsed.error.message}`);
          }
          return jsonResponse(await getScaffold(parsed.data));
        }

        case 'get_example': {
          const parsed = getExampleSchema.safeParse(args);
          if (!parsed.success) {
            return errorResponse(`Invalid input: ${parsed.error.message}`);
          }
          return jsonResponse(await getExample(parsed.data));
        }

        default:
          return errorResponse(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return errorResponse(`Error executing ${name}: ${message}`);
    }
  });

  // ═══════════════════════════════════════════════════════════════════════
  // RESOURCES
  // ═══════════════════════════════════════════════════════════════════════

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources: getDocumentationResources() };
  });

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
