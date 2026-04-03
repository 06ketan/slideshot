import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DiscoverInputSchema, CreateInputSchema, RenderInputSchema } from "./schema.js";
import { handleDiscover } from "./tools/discover.js";
import { handleCreate } from "./tools/create.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";

export const VERSION = "4.0.1";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "discover_themes",
    `MANDATORY first step — all other tools REJECT until this is called. Returns themes, orientation presets, token-usage modes, and output formats. You MUST present ALL options to the user and WAIT for their answers (theme, orientation, token mode, format, slide count). DO NOT auto-select. DO NOT skip to create_slides.`,
    DiscoverInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleDiscover(),
  );

  server.tool(
    "create_slides",
    `Create slides. Two modes: mode=default (AI writes full HTML) or mode=token_saver (AI sends JSON, server assembles HTML). REQUIRES discover_themes first. After this tool returns, you MUST create an artifact with the full HTML so the user gets a live preview. Then STOP and ask: "Does this look good? Should I render the final output?" DO NOT call render_slides until the user explicitly confirms.`,
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_slides",
    `Final render to PDF/WebP/PNG. REQUIRES both discover_themes AND create_slides to have been called first. ONLY call AFTER the user has seen the HTML preview artifact and explicitly said to proceed. DO NOT call in the same turn as create_slides. Returns file paths on disk.`,
    RenderInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleRender(args),
  );

  server.tool(
    "health_check",
    "Verify Puppeteer/Chromium can launch. Use when render fails.",
    {},
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleHealthCheck(VERSION),
  );

  return server;
}
