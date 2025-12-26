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
        case 'get_features': {
          const result = getFeatures();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'get_scaffold': {
          const parsed = getScaffoldSchema.safeParse(args);
          if (!parsed.success) {
            return {
              content: [{ type: 'text', text: `Invalid input: ${parsed.error.message}` }],
              isError: true,
            };
          }
          const result = await getScaffold(parsed.data);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'get_example': {
          const parsed = getExampleSchema.safeParse(args);
          if (!parsed.success) {
            return {
              content: [{ type: 'text', text: `Invalid input: ${parsed.error.message}` }],
              isError: true,
            };
          }
          const result = await getExample(parsed.data);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        default:
          return {
            content: [
              {
                type: 'text',
                text: `Unknown tool: ${name}`,
              },
            ],
            isError: true,
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error executing tool ${name}: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  // ═══════════════════════════════════════════════════════════════════════
  // RESOURCES
  // ═══════════════════════════════════════════════════════════════════════

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    // Dynamically list all available documentation resources
    return {
      resources: getDocumentationResources(),
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    // Check if this is a valid documentation URI
    if (!isValidDocumentationUri(uri)) {
      throw new Error(`Unknown resource: ${uri}`);
    }

    // Read the actual documentation file(s) from the repository
    const content = await readDocumentation(uri);

    if (!content) {
      throw new Error(`Failed to read resource: ${uri}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: content,
        },
      ],
    };
  });

  return server;
}
