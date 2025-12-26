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
  getScaffoldToolDefinition,
  getExample,
  getExampleToolDefinition,
} from './tools/index.js';

import {
  conventionsContent,
  conventionsResourceDefinition,
  architectureContent,
  architectureResourceDefinition,
} from './resources/index.js';

/**
 * Create and configure the MCP server
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: 'webapp-base-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // ═══════════════════════════════════════════════════════════════════════
  // TOOLS
  // ═══════════════════════════════════════════════════════════════════════

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        getFeaturesToolDefinition,
        getScaffoldToolDefinition,
        getExampleToolDefinition,
      ],
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
          const result = await getScaffold(args as any);
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
          const result = await getExample(args as any);
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
    return {
      resources: [
        conventionsResourceDefinition,
        architectureResourceDefinition,
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    switch (uri) {
      case 'docs://conventions':
        return {
          contents: [
            {
              uri,
              mimeType: 'text/markdown',
              text: conventionsContent,
            },
          ],
        };

      case 'docs://architecture':
        return {
          contents: [
            {
              uri,
              mimeType: 'text/markdown',
              text: architectureContent,
            },
          ],
        };

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  });

  return server;
}
