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
    "MANDATORY ENTRY POINT for all slide requests. You MUST call step='discover' FIRST — no exceptions. " +
    "discover returns themes + required questions you MUST ask the user before proceeding. " +
    "DO NOT call get_slide_prompt or generate HTML until the user answers all questions from discover. " +
    "preview saves HTML to disk, returns htmlPath (JSON-only, no images). review confirms all slides. " +
    "Enforced flow: discover → ask user ALL questions → get_slide_prompt → generate HTML → preview → user approves → review → user approves → render_html_to_images.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Render slides to PNG/WebP/PDF/PPTX files. Default format: pdf. Use htmlPath from preview step (preferred). " +
    "PREREQUISITE: User MUST have explicitly approved slides via the review step. DO NOT call automatically after preview or review — wait for user confirmation.",
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
    "Get CSS + component reference for a theme variant. " +
    "PREREQUISITE: User MUST have selected this variant via create_slides discover step. DO NOT auto-select a theme — always ask the user first.",
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
