# CLAUDE.md — slideshot MCP server (v4.3.0)

## Overview

MCP server exposing 6 tools for HTML-to-slides rendering. Depends on the `slideshot` CLI package for Puppeteer-based rendering. Distributed as `slideshot-mcp` on npm.

## Tools

| Tool | Purpose |
|------|---------|
| `discover_themes` | Returns themes, orientations, token modes, formats. ALWAYS call first. Resets the discovery gate. |
| `list_themes` | Idempotent listing of all themes — call any time the user asks "what other themes?" mid-conversation. Does NOT advance the slide-creation flow. |
| `create_slides` | Two modes: `default` (AI writes HTML) or `token_saver` (AI sends JSON, server assembles). Saves HTML to disk. |
| `edit_slides` | Token-efficient partial edits on a previously-generated deck — `replace_slide`, `patch_css`, `patch_class`, `swap_token`. Avoids regenerating the whole HTML for a small change. |
| `render_slides` | Renders HTML to PDF/WebP/PNG/PPTX via Puppeteer. Accepts html string or htmlPath. Full params: selector, width, height, scale, webpQuality, orientation, pptxMode, pptxFilename, slideRange. |
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
    render.ts       ← Puppeteer render to PDF/WebP/PNG/PPTX
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
- `RenderInputSchema` — `htmlPath`, `html`, `selector`, `width`, `height`, `scale`, `formats` (png/webp/pdf/pptx), `webpQuality`, `outDir`, `pdfFilename`, `pptxFilename`, `slideRange`, `orientation`, `pptxMode`
- `ORIENTATION_PRESETS` — portrait (540x675), landscape (1920x1080), linkedin (540x675), instagram (1080x1080), a4 (595x842)

### Helpers (`src/helpers.ts`)

- `defaultOutDir()` — `$SLIDESHOT_OUTPUT_DIR` > `~/Desktop/slideshot-output` > `~/Downloads/slideshot-output` > `$TMPDIR/slideshot-output`
- `resolveFormats()` — defaults to `["pdf"]`

### Key Design Decisions

- **Two token modes**: Default gives AI full HTML control (more tokens). Token-saver has AI send structured JSON, server assembles HTML (fewer tokens, less control).
- **Discovery + create gates**: render_slides rejects if discover_themes and create_slides haven't been called (unless htmlPath points to an existing file).
- **Full format support**: PDF, WebP, PNG, and PPTX all supported. PPTX has native (editable) and image (pixel-perfect) modes via `pptxMode`.
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

### Render parity — canonical path (postmortem SS-003)

PNG/WebP and PDF outputs of the same HTML must be visually identical aside from the format-specific compression. Both backends share the same `buildPrintCss(width, height)` reset declared in `packages/cli/src/renderer.ts`:

- `@page { size: WxH; margin: 0 }` — pins the PDF page-box to the slide dimensions, eliminating Puppeteer's default 0.4in margins (root cause of SS-001 and the SS-003 layout drift).
- `html, body { margin: 0 !important; padding: 0 !important }` — removes the live editor's 48px body padding before either backend captures pixels.
- `.slide { width:Wpx; height:Hpx; page-break-after: always }` — every slide is an exact page-sized canvas.
- `* { text-rendering: geometricPrecision }` — paired with the Chromium launch arg `--font-render-hinting=none` (declared in `packages/cli/src/browser.ts`), this forces the same glyph rasterization in both `page.pdf()` and element-`screenshot()`.

**PNG path**: `loadHtml → page.addStyleTag(buildPrintCss(w,h)) → element.screenshot({type: png|webp})` at `deviceScaleFactor: scale` (default 4).

**PDF path**: `loadHtml → page.addStyleTag(buildPrintCss(w,h)) → page.pdf({ margin:0, preferCSSPageSize: true })`.

If you are debugging a PDF/PNG mismatch, the diff is almost always (a) a missing `addStyleTag(buildPrintCss(...))` call on one of the two paths, or (b) drift between `LAUNCH_ARGS` font flags and the CSS `text-rendering` value. Keep the two backends symmetrical.

### Postmortem fix log

- **SS-001** (PDF page-overflow) — fixed in `buildPrintCss()` + `preferCSSPageSize:true`. Regression test: `packages/cli/test/pdf-pages.test.mjs`.
- **SS-002** (theme discoverability) — fixed by `tier` metadata, `showAll: true` flag on the theme selector, and the new `list_themes` idempotent tool.
- **SS-003** (PDF/PNG render parity) — fixed by sharing `buildPrintCss()` between both backends and adding `--font-render-hinting=none`.
