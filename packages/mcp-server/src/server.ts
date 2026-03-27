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
    "ALWAYS call this first with step='discover'. Returns themes + questions. You MUST present all themes to the user and ask ALL questions (theme, topic, orientation, formats) in ONE message. WAIT for user answers before generating any HTML. Do NOT skip this step or assume defaults.",
    CreateInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleCreate(args),
  );

  server.tool(
    "render_html_to_images",
    "Final render to PDF/PPTX/PNG/WebP. BLOCKED until user approves slides via create_slides review step. Workflow: discover → schema → assemble → user approval → review → render.",
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
    "RECOMMENDED path: send theme + structured slides JSON, server assembles HTML. Requires discover step first. After assembly, you MUST show HTML to user and wait for explicit approval before rendering.",
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
