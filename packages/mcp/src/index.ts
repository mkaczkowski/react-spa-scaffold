#!/usr/bin/env node

/**
 * react-spa-scaffold MCP Server
 *
 * A Model Context Protocol server that provides tools and resources
 * for scaffolding new projects based on the react-spa-scaffold template.
 *
 * Usage:
 *   npx @react-spa-scaffold/mcp  # Run with STDIO transport
 *   node dist/index.js           # Direct execution
 *
 * Tools:
 *   - get_features: List available feature modules
 *   - get_scaffold: Get complete scaffold for selected features
 *   - get_example: Get real code examples for patterns
 *
 * Resources:
 *   - docs://conventions, docs://architecture, docs://testing
 *   - docs://i18n, docs://api, docs://claude
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { VERSION } from './version.js';

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();

  // Graceful shutdown handling
  const shutdown = async () => {
    console.error('Shutting down MCP server...');
    await server.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await server.connect(transport);

  // Log to stderr (STDIO transport uses stdout for messages)
  console.error(`react-spa-scaffold MCP server v${VERSION} running on STDIO`);
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
