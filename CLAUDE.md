# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**slideshot** is an HTML-to-slides conversion tool distributed as three packages in an npm workspaces monorepo:
- **`packages/cli`** — CLI (`npx slideshot ./file.html`) and core rendering library
- **`packages/webapp`** — Next.js 16 web app with live editor, REST API, and marketing pages
- **`packages/mcp-server`** — MCP server for Claude Desktop/Cursor integration (depends on CLI package)

The rendering pipeline: HTML with `.slide` elements → Puppeteer screenshots → PNG/WebP/PDF/PPTX output.

## Commands

### Root (monorepo)
```bash
npm install                # install all workspace dependencies
npm run build              # build cli + mcp-server
npm run build:cli          # build only CLI
npm run build:mcp          # build only MCP server
```

### Webapp (`packages/webapp`)
```bash
npm run dev                # Next.js dev server (localhost:3000)
npm run build              # production build
npm run lint               # ESLint
```

### CLI (`packages/cli`)
```bash
npm run build              # compile TS, copy prompts, chmod CLI
npm run dev                # TypeScript watch mode
```

### MCP Server (`packages/mcp-server`)
```bash
npm run build              # compile TS, copy prompts, chmod executable
npm run dev                # TypeScript watch mode
```

No test suite exists in this project.

## Architecture

### Rendering Core (`packages/cli/src/`)
- `render.ts` — Main orchestrator: `renderSlides()` (file output) and `renderToBuffers()` (memory buffers)
- `browser.ts` — Puppeteer launch with containerization-safe args, device scale factor support
- `renderer.ts` — Page loading, `.slide` element screenshot capture, PDF generation with print CSS
- `pptx.ts` / `pptx-native.ts` — Two PPTX modes: image-based (pixel-perfect) and native (editable text extraction)
- `types.ts` — `RenderOptions` and `RenderResult` interfaces

### Webapp (`packages/webapp/src/`)
- **App Router pages**: `/` (marketing), `/editor` (live HTML editor), `/gallery`
- **API routes**: `POST /api/render` (render HTML → ZIP), `GET /api/prompt` (AI prompt templates), `GET /api/openapi.json`
- **Production rendering** uses `puppeteer-core` + `@sparticuz/chromium` for Vercel deployment; dev uses full Puppeteer
- `next.config.ts` configures file tracing to include the Chromium binary for the render API route

### MCP Server (`packages/mcp-server/src/`)
- `server.ts` — MCP server factory (v2.9.0) exposing 4 tools:
  - `create_slides` — guided workflow: discover (themes) → preview (saves HTML to disk, returns htmlPath) → review (confirms all slides)
  - `render_html_to_images` — full render to PNG/WebP/PDF/PPTX (default: PDF only). Accepts `htmlPath` from preview step
  - `get_slide_prompt` — AI prompt template for 8 theme variants
  - `health_check` — Puppeteer/Chromium diagnostics
- `schema.ts` — Zod validation schemas for tool inputs
- 8 MCP prompts registered: `{variant}-slides` for each theme
- Delegates rendering to the CLI package
- **Token optimization**: preview/review return JSON-only (no base64 images). HTML is saved to disk on first preview; subsequent calls use `htmlPath` to avoid re-sending HTML strings. Default render format is PDF (direct `page.pdf()`, no raster screenshots)

### Prompt Templates (`prompts/`)
8 AI prompt variants (generic, branded, dark-modern, editorial, infographic, instagram-carousel, pitch-deck, browser-shell) that instruct AI to generate HTML with `.slide` elements at 540×675 default dimensions.

### Agent Skills (`.agents/skills/`)
- **slideshot** — MCP tool usage guide, theme catalog, workflow instructions
- **docx** — Word document creation/editing (from anthropics/skills)
- **pdf** — PDF creation/manipulation (from anthropics/skills)
- **pptx** — PowerPoint creation/editing (from anthropics/skills)
- Plus marketing/SEO skills: ai-seo, analytics-tracking, page-cro, programmatic-seo, schema-markup, seo-audit, site-architecture, remotion-best-practices

### MCP Workflow (Claude Desktop / Cursor)
The slideshot MCP follows a token-optimized iterative loop:
1. `discover` → compact theme list + questions (no SVGs, no presets)
2. `get_slide_prompt` with chosen variant → compressed CSS + component reference
3. AI generates HTML
4. `preview` with `html` → MCP saves to `slides.html`, returns `{ htmlPath, slideCount }`. Show HTML as code block for user to preview
5. User approves or requests changes → edit HTML → preview again
6. `review` with `htmlPath` → confirms all slides. Show HTML as code block
7. User approves
8. `render_html_to_images` with `htmlPath` + chosen formats → final files

Key: HTML is persisted to disk on preview. All subsequent calls use `htmlPath` — never re-send the HTML string. Preview/review return JSON-only (no base64 images). Default render format is `pdf` (direct Chromium print, no raster screenshots).

## Webapp Design System (Neobrutalist)

When modifying the webapp UI, follow these rules:
- **Colors**: Yellow `#FFD233` (primary), Black `#0A0A0A` (text), Off-white `#FFFDF5` (background), Navy `#12122A` (code panes only)
- **Borders**: 3px solid black on all interactive elements
- **Shadows**: Hard shadows only (5px offset default, 8px on hover) — no blur, no glassmorphism
- **Corners**: No rounded corners (except full circles for avatars/dots)
- **Typography**: Bebas Neue (headings), DM Sans (body), Geist Mono (code)

## Key Technical Details

- **Node >= 18** required
- TypeScript strict mode across all packages; shared base config in `tsconfig.base.json`
- Webapp path alias: `@/*` → `./src/*`
- Vercel render API has 60s max request duration
- CORS is configured on API routes for ChatGPT/OpenWebUI integration
