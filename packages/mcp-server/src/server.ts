import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  DiscoverInputSchema,
  CreateInputSchema,
  RenderInputSchema,
  ListThemesInputSchema,
  EditInputSchema,
} from "./schema.js";
import { handleDiscover, handleListThemes } from "./tools/discover.js";
import { handleCreate } from "./tools/create.js";
import { handleRender } from "./tools/render.js";
import { handleHealthCheck } from "./tools/health.js";
import { handleEdit } from "./tools/edit.js";

export const VERSION = "4.4.0";

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
    `Final render to PDF/WebP/PNG/PPTX. Accepts html string OR htmlPath. Supports width, height, selector, scale, webpQuality, orientation, pptxMode, pptxFilename, slideRange. NEVER call render_slides in the same turn as create_slides. When the user provides an existing HTML file path, pass it as htmlPath and call this tool directly — no discover_themes or create_slides needed. For the full slide-creation workflow, REQUIRES both discover_themes AND create_slides first, and ONLY call AFTER user confirms the preview. Returns file paths on disk.`,
    RenderInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (args) => handleRender(args),
  );

  server.tool(
    "list_themes",
    `Idempotent read-only listing of all available themes (8+). Unlike discover_themes, this does NOT start a slide-creation workflow — call it any time the user asks "what themes are there?" mid-conversation. Returns the same tiered theme catalog (primary/secondary). Models MUST present every theme returned, never truncate.`,
    ListThemesInputSchema,
    { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async () => handleListThemes(),
  );

  server.tool(
    "edit_slides",
    `Token-efficient partial edits on a previously-generated HTML deck. Use this INSTEAD of regenerating the whole deck for small changes — it saves 60-90% tokens vs a full rewrite. Operations: replace_slide (swap one slide block by 1-indexed slideIndex), patch_css (append CSS rules to <style>), swap_token (replace a CSS variable's value, e.g. {"--coral": "#FF0000"}), patch_class (add/remove a class on a specific slide, e.g. {"add": "dark"}). Reads from cache or htmlPath; saves the updated HTML and returns the new htmlPath. After editing, show the htmlPath as a preview artifact and STOP — do NOT call render_slides until the user confirms.`,
    EditInputSchema,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    async (args) => handleEdit(args),
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
