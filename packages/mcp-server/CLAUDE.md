# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

`slideshot-mcp` (v3.0.1) — MCP server for rendering HTML slides to PNG/WebP/PDF/PPTX. Runs over stdio, used by Claude Desktop and Cursor. Depends on the `slideshot` CLI package for Puppeteer-based rendering.

## Commands

```bash
npm run build    # tsc + chmod dist/index.js + copy ../../prompts → ./prompts
npm run dev      # tsc --watch
```

Build from monorepo root: `npm run build:mcp`

No test suite. Manual testing via `test-e2e.mjs` in this directory.

## Architecture

### Entry & Server (`src/index.ts`, `src/server.ts`)

`index.ts` is the stdio entry point (shebang, `StdioServerTransport`). `server.ts` creates the `McpServer` and registers 6 tools:

| Tool | Handler | Purpose |
|------|---------|---------|
| `create_slides` | `tools/create.ts` | 3-step workflow: discover → preview → review |
| `render_html_to_images` | `tools/render.ts` | Puppeteer render to file outputs |
| `health_check` | `tools/health.ts` | Chromium launch diagnostic |
| `get_slide_prompt` | `tools/prompt.ts` | Raw CSS prompt for a theme (legacy path) |
| `assemble_slides` | `tools/assemble.ts` | Structured JSON → HTML assembly (preferred path) |
| `get_slide_schema` | `tools/assemble.ts` | Returns per-type field reference for a theme |

### Two HTML Generation Paths

1. **Structured (preferred):** `get_slide_schema` → `assemble_slides` — LLM sends typed JSON slides, server assembles HTML. Saves ~1500 tokens vs raw HTML.
2. **Raw:** `get_slide_prompt` → LLM generates full HTML itself → `create_slides preview` to save it.

Both paths converge at `render_html_to_images` for final output.

### Template System (`src/templates/`)

- `types.ts` — 11 slide type interfaces (`CoverSlide`, `ContentSlide`, `StatsSlide`, etc.) and `AssembleInput`
- `css.ts` — Per-theme CSS strings (inline, no external files). Each theme defines `font`, `css`, and `dimensions`
- `renderers.ts` — Per-theme HTML renderers for each slide type. Maps `(SlideData, index, total) → HTML string`
- `assembler.ts` — `assembleHtml()` combines theme CSS + rendered slides into a complete HTML document. `getSlotSchema()` returns the field reference

### Prompt System (`src/prompts.ts`)

Fetches theme prompts from GitHub (`awesome-visual-ai-prompts` repo) with 1.5s timeout, falls back to local `./prompts/*.md` files. 10-minute TTL cache.

### Schema (`src/schema.ts`)

Zod schemas for all tool inputs. The `SlideSchema` uses a flat object with optional fields (not a discriminated union) to save ~900 tokens in the MCP tool definition. Runtime validation happens in the assembler.

### Helpers (`src/helpers.ts`)

- `defaultOutDir()` — `$SLIDESHOT_OUTPUT_DIR` → `~/Desktop/slideshot-output` → `~/Downloads/slideshot-output` → `$TMPDIR/slideshot-output`
- `resolveFormats()` — defaults to `["pdf"]` when no formats specified

### Key Design Decisions

- **Token optimization is a primary concern.** Preview/review return JSON-only (no base64 images). HTML is saved to disk on first preview; subsequent calls use `htmlPath`. Default format is PDF (direct `page.pdf()`, no raster screenshots).
- **Render tool accepts both `html` string and `htmlPath`.** If `htmlPath` is inaccessible (sandboxed environments), it falls back to writing `html` to a temp file in `os.tmpdir()`.
- **All tool responses are JSON-stringified text content.** No structured MCP content types beyond `text` and `image`.
- **8 themes** are hardcoded: generic, branded, instagram-carousel, infographic, pitch-deck, dark-modern, editorial, browser-shell. Adding a theme requires entries in `css.ts`, `renderers.ts`, and the `THEMES` const in `schema.ts`.

### MCP Workflow (intended order)

```
discover → get_slide_schema → assemble_slides → user approval → render_html_to_images
```

The `create_slides` tool's `discover` step must be called first to present theme choices and gather user preferences. The `preview` and `review` steps are for the raw HTML path.
