import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RenderInputSchema, PromptInputSchema, CreateInputSchema } from "./schema.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";
import { handleGetPrompt } from "./tools/prompt.js";
import { handleCreate } from "./tools/create.js";
import { loadAllPrompts } from "./prompts.js";

export const VERSION = "2.8.0";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "create_slides",
    "Guided slide creation workflow — START HERE when user wants to create slides, carousels, decks, or presentations. " +
    "Triggers: 'make slides', 'LinkedIn carousel', 'Instagram post', 'pitch deck', 'presentation', 'slide deck'. " +
    "step='discover' returns 8 theme options (generic, branded, instagram-carousel, infographic, pitch-deck, dark-modern, editorial, browser-shell) + output presets + questions to ask. " +
    "step='preview' renders slide 1 at 1x — always show code + preview image, loop until user approves. " +
    "step='review' renders ALL slides as thumbnails for full deck review before final render. " +
    "Full workflow: discover -> get_slide_prompt -> generate HTML -> preview -> revise loop -> review -> render_html_to_images. " +
    "Always show code + preview before rendering. Loop until user confirms.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Render HTML slides to high-resolution PNG, WebP, PDF, and/or PPTX files. " +
    "Use when the user provides HTML containing .slide elements, or after create_slides guided workflow. " +
    "Provide html string OR htmlPath. Returns file paths + inline preview of first slide. " +
    "Formats: png (images), webp (images), pdf (combined document), pptx (PowerPoint — native editable or image-based). " +
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
