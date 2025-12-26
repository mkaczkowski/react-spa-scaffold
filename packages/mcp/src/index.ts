#!/usr/bin/env node

/**
 * webapp-base MCP Server
 *
 * A Model Context Protocol server that provides tools and resources
 * for scaffolding new projects based on the webapp-base template.
 *
 * Usage:
 *   npx webapp-base-mcp          # Run with STDIO transport
 *   node dist/index.js           # Direct execution
 *
 * Tools:
 *   - get_features: List available feature modules
 *   - get_scaffold: Get complete scaffold for selected features
 *   - get_example: Get real code examples for patterns
 *
 * Resources:
 *   - docs://conventions: Coding standards and patterns
 *   - docs://architecture: Technology stack and data flow
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Log to stderr (STDIO transport uses stdout for messages)
  console.error('webapp-base MCP server running on STDIO');
  console.error('Tools: get_features, get_scaffold, get_example');
  console.error('Resources: docs://conventions, docs://architecture');
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
