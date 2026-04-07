import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DiscoverInputSchema, CreateInputSchema, RenderInputSchema } from "./schema.js";
import { handleDiscover } from "./tools/discover.js";
import { handleCreate } from "./tools/create.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";

export const VERSION = "4.1.0";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "discover_themes",
    `MANDATORY first step — all other tools REJECT until this is called. Returns themes, orientation presets, token-usage modes, and output formats. Use ONLY the native selector prompts from the "ask" array — DO NOT render themes as a separate markdown list. DO NOT ask how many slides (you decide based on topic). After user picks options, show a data outline of proposed slides and WAIT for confirmation before calling create_slides.`,
    DiscoverInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleDiscover(),
  );

  server.tool(
    "create_slides",
    `Create slides. Two modes: mode=default (AI writes full HTML) or mode=token_saver (AI sends JSON, server assembles HTML). REQUIRES discover_themes first AND user must have confirmed the data outline. After this tool saves the HTML, you MUST show it as a code preview artifact so the user can see a live preview. Then STOP and ask: "Does this look good? Should I render the final output?" DO NOT call render_slides until the user explicitly confirms.`,
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_slides",
    `Final render to PDF/WebP/PNG. When the user provides an existing HTML file path, pass it as htmlPath and call this tool directly — no discover_themes or create_slides needed. For the full slide-creation workflow, REQUIRES both discover_themes AND create_slides first, and ONLY call AFTER user confirms the preview. Returns file paths on disk.`,
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
