import { describe, it, expect } from 'vitest';
import { createServer } from './server.js';

describe('MCP server', () => {
  it('creates server instance', () => {
    const server = createServer();
    expect(server).toBeDefined();
  });

  it('has correct server name and version', () => {
    const server = createServer();
    // @ts-expect-error - accessing internal server info
    expect(server._serverInfo?.name).toBe('react-spa-scaffold-mcp');
  });
});
