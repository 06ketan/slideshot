# CLAUDE.md — slideshot MCP server (v4.0.0)

## Overview

MCP server exposing 4 tools for HTML-to-slides rendering. Depends on the `slideshot` CLI package for Puppeteer-based rendering. Distributed as `slideshot-mcp` on npm.

## Tools

| Tool | Purpose |
|------|---------|
| `discover_themes` | Returns themes, orientations, token modes, formats. ALWAYS call first. |
| `create_slides` | Two modes: `default` (AI writes HTML) or `token_saver` (AI sends JSON, server assembles). Saves HTML to disk. |
| `render_slides` | Renders saved HTML to PDF/WebP/PNG via Puppeteer. Returns file paths. |
| `health_check` | Puppeteer/Chromium diagnostic. |

## Architecture

```
src/
  index.ts          ← stdio entry point
  server.ts         ← McpServer factory, 4 tool registrations
  schema.ts         ← Zod schemas for all tools + ORIENTATION_PRESETS
  cache.ts          ← Module-level HTML cache + discovery flag
  helpers.ts        ← defaultOutDir(), resolveFormats()
  prompts.ts        ← GitHub fetch with local fallback for theme prompts
  tools/
    discover.ts     ← Theme catalog, orientation presets, token modes
    create.ts       ← Two-mode slide creation (default HTML / token_saver JSON)
    render.ts       ← Puppeteer render to PDF/WebP/PNG
    health.ts       ← Chromium launch diagnostic
  templates/
    assembler.ts    ← Assembles HTML from theme CSS + slide renderers
    css.ts          ← CSS for all 8 themes
    renderers.ts    ← Per-theme HTML renderers for each slide type
    types.ts        ← TypeScript types for slide data
```

### Schema (`src/schema.ts`)

- `DiscoverInputSchema` — empty (no params)
- `CreateInputSchema` — `mode`, `theme`, `orientation`, `width/height`, `html` (default mode), `slides` (token_saver mode), `brandName`
- `RenderInputSchema` — `htmlPath`, `formats`, `scale`, `slideRange`, `outDir`, `pdfFilename`
- `ORIENTATION_PRESETS` — portrait (540x675), landscape (1920x1080), linkedin (540x675), instagram (1080x1080), a4 (595x842)

### Helpers (`src/helpers.ts`)

- `defaultOutDir()` — `$SLIDESHOT_OUTPUT_DIR` > `~/Desktop/slideshot-output` > `~/Downloads/slideshot-output` > `$TMPDIR/slideshot-output`
- `resolveFormats()` — defaults to `["pdf"]`

### Key Design Decisions

- **Two token modes**: Default gives AI full HTML control (more tokens). Token-saver has AI send structured JSON, server assembles HTML (fewer tokens, less control).
- **No approval gates**: The AI workflow handles previewing and confirming with the user. Server doesn't enforce multi-step gates.
- **Focus on PDF/WebP/PNG**: PPTX is still supported via the CLI but not exposed in the MCP schema to keep it simple.
- **Render tool uses htmlPath**: HTML is persisted to disk by create_slides. render_slides reads from disk or falls back to cache.
- **Sandbox-safe**: If htmlPath is inaccessible (sandboxed environments), falls back to writing cached HTML to tmpdir.

### MCP Workflow

```
discover_themes → user picks theme/orientation/token mode/formats
  → create_slides (default: html= or token_saver: slides=)
  → show artifact preview → user approves
  → render_slides → files on disk
```

### 8 Themes

generic, branded, instagram-carousel, infographic, pitch-deck, dark-modern, editorial, browser-shell

### Slide Types (for token_saver mode)

cover, content, stats, list, steps, comparison, quote, code, cta, timeline, team
