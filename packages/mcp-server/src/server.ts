import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RenderInputSchema, PromptInputSchema, CreateInputSchema, AssembleInputSchema, SchemaInputSchema } from "./schema.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";
import { handleGetPrompt } from "./tools/prompt.js";
import { handleCreate } from "./tools/create.js";
import { handleAssemble, handleGetSchema } from "./tools/assemble.js";

export const VERSION = "3.0.1";

export function createServer(): McpServer {
  const server = new McpServer({ name: "slideshot", version: VERSION });

  server.tool(
    "create_slides",
    "ALWAYS call this first with step='discover'. Returns themes, presets, and questions. Use ONLY native interactive prompts to ask user — do NOT render markdown tables or verbose text. WAIT for answers before generating HTML.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Final render to PDF/PPTX/PNG/WebP. BLOCKED until user approves via review step. Returns file paths. For PDF: user can open directly from Desktop. Use presets from discover for auto-configured dimensions.",
    RenderInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleRender(args),
  );

  server.tool(
    "health_check",
    "Verify Puppeteer can launch.",
    {},
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleHealthCheck(VERSION),
  );

  server.tool(
    "get_slide_prompt",
    "Raw HTML mode: get full CSS for a theme. Requires discover step first. Prefer assemble_slides instead.",
    PromptInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleGetPrompt(args),
  );

  server.tool(
    "assemble_slides",
    "RECOMMENDED: send theme + slides JSON, server builds HTML. After assembly, show HTML as artifact for visual preview. Ask user to approve before rendering. Requires discover step first.",
    AssembleInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleAssemble(args),
  );

  server.tool(
    "get_slide_schema",
    "Get available slide types + fields for a theme. Requires discover step first. Call before assemble_slides.",
    SchemaInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleGetSchema(args),
  );

  return server;
}
