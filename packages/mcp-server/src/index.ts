#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, VERSION } from "./server.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `slideshot MCP server v${VERSION} | node ${process.version} | ${process.platform}/${process.arch} | pid ${process.pid}`,
  );
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
