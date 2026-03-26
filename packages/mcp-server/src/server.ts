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
    "Start here. step=discover returns themes+questions. MUST ask user ALL questions before proceeding. Prefer assemble_slides over get_slide_prompt.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Render htmlPath to PDF/PPTX/PNG/WebP. MUST have user approval first.",
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
    "Raw HTML mode: get full CSS for a theme. Prefer assemble_slides instead.",
    PromptInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleGetPrompt(args),
  );

  server.tool(
    "assemble_slides",
    "RECOMMENDED: send theme + structured slides JSON, server assembles HTML. Saves ~1500 tokens. Call get_slide_schema first for field reference.",
    AssembleInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleAssemble(args),
  );

  server.tool(
    "get_slide_schema",
    "Get available slide types + fields for a theme. Call before assemble_slides.",
    SchemaInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleGetSchema(args),
  );

  return server;
}
