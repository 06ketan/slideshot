import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RenderInputSchema, PromptInputSchema, CreateInputSchema } from "./schema.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";
import { handleGetPrompt } from "./tools/prompt.js";
import { handleCreate } from "./tools/create.js";
import { loadAllPrompts } from "./prompts.js";

export const VERSION = "2.9.0";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "create_slides",
    "MANDATORY first step for slides. MUST call discover first. discover returns themes+questions — MUST ask user ALL questions before proceeding. " +
    "DO NOT generate HTML or call get_slide_prompt until user answers. Flow: discover→user answers→get_slide_prompt→HTML→preview→approval→render.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Render to PDF/PPTX/PNG/WebP. Default: pdf. Use htmlPath (preferred). MUST have user approval first. DO NOT auto-call.",
    RenderInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleRender(args),
  );

  server.tool(
    "health_check",
    "Verify Puppeteer/Chromium can launch. Run if renders fail.",
    {},
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleHealthCheck(VERSION),
  );

  server.tool(
    "get_slide_prompt",
    "Get CSS+components for a theme. MUST be user-selected from discover. DO NOT auto-select.",
    PromptInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleGetPrompt(args),
  );

  const allPrompts = loadAllPrompts();
  for (const [key, text] of Object.entries(allPrompts)) {
    server.prompt(
      `${key}-slides`,
      `${key} slide HTML generation prompt`,
      () => ({
        messages: [
          { role: "user" as const, content: { type: "text" as const, text } },
        ],
      }),
    );
  }

  return server;
}
