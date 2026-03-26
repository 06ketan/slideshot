# slideshot

[![npm](https://img.shields.io/npm/v/slideshot)](https://www.npmjs.com/package/slideshot)
[![npm downloads](https://img.shields.io/npm/dm/slideshot)](https://www.npmjs.com/package/slideshot)
[![npm mcp](https://img.shields.io/npm/v/slideshot-mcp?label=slideshot-mcp)](https://www.npmjs.com/package/slideshot-mcp)
[![GitHub stars](https://img.shields.io/github/stars/06ketan/slideshot)](https://github.com/06ketan/slideshot)
[![license](https://img.shields.io/github/license/06ketan/slideshot)](LICENSE)

Convert AI-generated HTML carousels into high-res PNG, WebP, PDF, and PPTX — via **CLI**, **Web App**, **MCP Server**, or **REST API**.

**[Web App](https://slideshot.vercel.app)** · **[npm CLI](https://www.npmjs.com/package/slideshot)** · **[npm MCP](https://www.npmjs.com/package/slideshot-mcp)** · **[API Spec](https://slideshot.vercel.app/api/openapi.json)**

## Architecture

```
slideshot/
  packages/
    cli/           ← Core Puppeteer rendering engine + CLI
    mcp-server/    ← MCP stdio server for AI tools
    webapp/        ← Next.js web app with live preview
  prompts/
    generic.md           ← Clean minimal
    branded.md           ← Ketan Slides design system
    instagram-carousel.md ← Bold vibrant IG style
    infographic.md       ← Data-heavy charts
    pitch-deck.md        ← Professional presentations
    dark-modern.md       ← Neon glassmorphism
    editorial.md         ← Magazine serif
```

## Quick Start

### CLI

```bash
npx slideshot ./my-carousel.html --formats png,webp,pdf --scale 4
```

**Options:**

| Flag | Default | Description |
|------|---------|-------------|
| `-s, --selector` | `.slide` | CSS selector for slide elements |
| `-W, --width` | `540` | Slide width (CSS px) |
| `-H, --height` | `675` | Slide height (CSS px) |
| `--scale` | `4` | Device scale (4x = 2160x2700) |
| `-f, --formats` | `png,webp,pdf` | Output formats (png, webp, pdf, pptx) |
| `-q, --quality` | `95` | WebP quality (0-100) |
| `-o, --out` | `./slides` | Output directory |

### Web App

**Live:** [slideshot.vercel.app](https://slideshot.vercel.app)

Or run locally:

```bash
cd packages/webapp && npm install && npm run dev
```

Open `http://localhost:3000` — paste HTML, preview, export.

### MCP Server

Add to Claude Desktop or Cursor config:

```json
{
  "mcpServers": {
    "slideshot": {
      "command": "npx",
      "args": ["-y", "slideshot-mcp"]
    }
  }
}
```

**Tools:**

- `create_slides` — guided creation workflow with 7 themes and output presets
- `render_html_to_images` — render HTML to PNG/WebP/PDF/PPTX
- `get_slide_prompt` — get AI prompt template for any theme variant
- `health_check` — verify Puppeteer/Chromium availability

**Prompts (7 themes):**

- `generic-slides` — clean minimal
- `branded-slides` — Ketan Slides design system
- `instagram-carousel-slides` — bold vibrant IG style
- `infographic-slides` — data-heavy charts and stats
- `pitch-deck-slides` — professional presentations
- `dark-modern-slides` — neon glassmorphism
- `editorial-slides` — magazine serif with gold accents

### REST API (ChatGPT Actions / OpenWebUI)

The web app exposes an OpenAPI-compatible REST API at `https://slideshot.vercel.app`.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/render` | Render HTML slides to PNG/WebP/PDF (returns ZIP) |
| `GET` | `/api/prompt?variant=generic` | Get AI prompt template |
| `GET` | `/api/openapi.json` | OpenAPI 3.1.0 spec |

**Platform support:**

| Platform | Method | Setup |
|----------|--------|-------|
| Cursor | MCP | `npx slideshot-mcp` in `.cursor/mcp.json` |
| Claude Desktop | MCP | `npx slideshot-mcp` in config |
| ChatGPT | OpenAPI Action | Import `/api/openapi.json` |
| OpenWebUI | OpenAPI Tool | Import `/api/openapi.json` |

## AI Prompt Templates

7 prompt variants in `prompts/` — copy-paste or use via `get_slide_prompt` tool:

| Variant | File | Style |
|---------|------|-------|
| Generic | `prompts/generic.md` | Clean minimal, Inter font |
| Branded | `prompts/branded.md` | Space Mono, teal/coral accents |
| Instagram | `prompts/instagram-carousel.md` | Bold gradients, Poppins |
| Infographic | `prompts/infographic.md` | DM Sans, stat cards |
| Pitch Deck | `prompts/pitch-deck.md` | Professional, KPI cards |
| Dark Modern | `prompts/dark-modern.md` | Neon, glassmorphism |
| Editorial | `prompts/editorial.md` | Playfair Display, gold |

## Build All

```bash
npm install   # from root — installs all workspaces
npm run build # builds cli → mcp-server
cd packages/webapp && npm run build  # builds webapp separately
```

## Links

| Surface | URL |
|---------|-----|
| Web App | [slideshot.vercel.app](https://slideshot.vercel.app) |
| npm CLI | [npmjs.com/package/slideshot](https://www.npmjs.com/package/slideshot) |
| npm MCP | [npmjs.com/package/slideshot-mcp](https://www.npmjs.com/package/slideshot-mcp) |
| GitHub | [github.com/06ketan/slideshot](https://github.com/06ketan/slideshot) |
| API Spec | [slideshot.vercel.app/api/openapi.json](https://slideshot.vercel.app/api/openapi.json) |

## License

MIT
