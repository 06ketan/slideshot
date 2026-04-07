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
    `Create slides. IMPORTANT: Use mode=default unless the user explicitly chose token_saver. mode=default = AI writes full HTML (best quality). mode=token_saver = AI sends JSON, server uses basic templates. REQUIRES discover_themes first AND user must have confirmed the data outline. After this tool saves the HTML, you MUST show the htmlPath as a code preview artifact. Then STOP and ask the user to confirm. DO NOT call render_slides until the user explicitly confirms.`,
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_slides",
    `Final render to PDF/WebP/PNG. NEVER call render_slides in the same turn as create_slides. When the user provides an existing HTML file path, pass it as htmlPath and call this tool directly — no discover_themes or create_slides needed. For the full slide-creation workflow, REQUIRES both discover_themes AND create_slides first, and ONLY call AFTER user confirms the preview. Returns file paths on disk.`,
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
