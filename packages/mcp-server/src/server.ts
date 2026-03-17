import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RenderInputSchema, PromptInputSchema, CreateInputSchema } from "./schema.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";
import { handleGetPrompt } from "./tools/prompt.js";
import { handleCreate } from "./tools/create.js";
import { loadAllPrompts } from "./prompts.js";

export const VERSION = "2.6.0";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "create_slides",
    "Guided slide creation workflow. Start here when user wants to create slides from a topic or content. " +
    "step='discover' returns theme catalog + output presets + questions to ask. " +
    "step='preview' renders slide 1 at 1x for fast preview before committing to full render. " +
    "Use this before render_html_to_images to guide the user through theme and format selection.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Render HTML slides to high-resolution PNG, WebP, and/or PDF files. " +
    "Use when the user provides HTML containing .slide elements with fixed dimensions (e.g. 540x675), Google Fonts, or carousel-style content. " +
    "Provide html string OR htmlPath. Returns file paths + inline preview of first slide. " +
    "Supports slideRange for partial renders and pdfFilename for custom PDF names.",
    RenderInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleRender(args),
  );

  server.tool(
    "health_check",
    "Verify Puppeteer/Chromium can launch in this environment. Run this first to diagnose render failures.",
    {},
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleHealthCheck(VERSION),
  );

  server.tool(
    "get_slide_prompt",
    "Get AI prompt template for generating slide HTML compatible with slideshot. " +
    "Returns full CSS + component reference for the chosen theme variant.",
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
