import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RenderInputSchema, PromptInputSchema, CreateInputSchema } from "./schema.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";
import { handleGetPrompt } from "./tools/prompt.js";
import { handleCreate } from "./tools/create.js";
import { loadAllPrompts } from "./prompts.js";

export const VERSION = "2.8.1";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "create_slides",
    "MANDATORY ENTRY POINT for all slide creation. You MUST call step='discover' FIRST before any HTML generation or get_slide_prompt calls — no exceptions. " +
    "Triggers: 'make slides', 'LinkedIn carousel', 'Instagram post', 'pitch deck', 'presentation', 'slide deck'. " +
    "step='discover' returns 8 theme variants, output format presets, and REQUIRED questions you MUST ask the user (theme, aspect ratio, formats, pptx mode). " +
    "step='preview' renders slide 1 at 1x — you MUST show code + preview image and wait for explicit user approval before proceeding. " +
    "step='review' renders ALL slides as thumbnails — you MUST show all thumbnails and wait for explicit user confirmation before rendering. " +
    "DO NOT call get_slide_prompt until user has selected a theme from discover. " +
    "DO NOT call render_html_to_images until user has explicitly approved the review step. " +
    "Full enforced workflow: discover → ask user all questions → get_slide_prompt → generate HTML → preview (show code + image, ask approval) → revise loop → review (all slides, ask approval) → render_html_to_images.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Render HTML slides to high-resolution PNG, WebP, PDF, and/or PPTX files. " +
    "PREREQUISITE: User MUST have explicitly approved slides via create_slides review step. DO NOT call this automatically after preview or review — wait for user confirmation. " +
    "Provide html string OR htmlPath. Returns file paths + inline preview of first slide. " +
    "Formats: png (images), webp (images), pdf (combined document), pptx (PowerPoint — native editable or image-based). " +
    "IMPORTANT: If formats includes 'pptx', default to orientation='landscape' (1920x1080) unless user explicitly requested portrait. " +
    "Supports orientation presets (portrait/landscape), slideRange for partial renders, custom filenames, scale 1-6x.",
    RenderInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleRender(args),
  );

  server.tool(
    "health_check",
    "Verify Puppeteer and Chromium can launch in this environment. " +
    "Run this first if render_html_to_images fails, or to diagnose browser/headless issues. " +
    "Returns server version, Chromium path, and launch status.",
    {},
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleHealthCheck(VERSION),
  );

  server.tool(
    "get_slide_prompt",
    "Get AI prompt template for generating slide HTML compatible with slideshot. " +
    "PREREQUISITE: User MUST have selected this variant via create_slides discover step. DO NOT auto-select a theme — always ask the user first. " +
    "Returns full CSS + component reference for the chosen theme. " +
    "Variants: 'generic' (clean minimal), 'branded' (Ketan Slides monospace), 'instagram-carousel' (bold vibrant), " +
    "'infographic' (data-heavy charts), 'pitch-deck' (professional KPIs), 'dark-modern' (neon glassmorphism), " +
    "'editorial' (magazine serif), 'browser-shell' (browser window chrome).",
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
