import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DiscoverInputSchema, CreateInputSchema, RenderInputSchema } from "./schema.js";
import { handleDiscover } from "./tools/discover.js";
import { handleCreate } from "./tools/create.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";

export const VERSION = "4.0.0";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "discover_themes",
    "ALWAYS call first. Returns themes, orientation presets (LinkedIn/Instagram/portrait/landscape/A4), token usage modes (default vs token-saver), and output format options. Ask the user to pick before proceeding.",
    DiscoverInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleDiscover(),
  );

  server.tool(
    "create_slides",
    "Create slides in two modes: mode=default (AI writes full HTML, more creative control, more tokens) or mode=token_saver (AI sends structured JSON, server builds HTML, fewer tokens). Returns htmlPath for rendering. Can be called repeatedly to iterate.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_slides",
    "Render saved HTML to PDF, WebP, and/or PNG files. Uses htmlPath from create_slides (or cached HTML). Returns file paths on disk.",
    RenderInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleRender(args),
  );

  server.tool(
    "health_check",
    "Verify Puppeteer/Chromium can launch.",
    {},
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleHealthCheck(VERSION),
  );

  return server;
}
