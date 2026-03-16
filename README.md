# slideshot

[![npm](https://img.shields.io/npm/v/slideshot)](https://www.npmjs.com/package/slideshot)
[![npm downloads](https://img.shields.io/npm/dm/slideshot)](https://www.npmjs.com/package/slideshot)
[![npm mcp](https://img.shields.io/npm/v/slideshot-mcp?label=slideshot-mcp)](https://www.npmjs.com/package/slideshot-mcp)
[![GitHub stars](https://img.shields.io/github/stars/06ketan/slideshot)](https://github.com/06ketan/slideshot)
[![license](https://img.shields.io/github/license/06ketan/slideshot)](LICENSE)

Convert AI-generated HTML carousels into high-res PNG, WebP, and PDF — via **CLI**, **Web App**, **MCP Server**, or **REST API**.

**[Web App](https://slideshot.vercel.app)** · **[npm CLI](https://www.npmjs.com/package/slideshot)** · **[npm MCP](https://www.npmjs.com/package/slideshot-mcp)** · **[API Spec](https://slideshot.vercel.app/api/openapi.json)**

## Architecture

```
slideshot/
  packages/
    core/          ← Shared Puppeteer rendering engine
    cli/           ← npx slideshot ./file.html
    mcp-server/    ← MCP stdio server for AI tools
    webapp/        ← Next.js web app with live preview
  prompts/
    generic.md     ← AI prompt template (any style)
    branded.md     ← AI prompt template (Ketan Slides design system)
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
| `-f, --formats` | `png,webp,pdf` | Output formats |
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

- `render_html_to_images` — render HTML to images/PDF
- `get_slide_prompt` — get AI prompt templates

**Prompts:**

- `generic-slides` — clean minimal slide prompt
- `branded-slides` — Ketan Slides design system prompt

### REST API (ChatGPT Actions / OpenWebUI)

The web app exposes an OpenAPI-compatible REST API at `https://slideshot.vercel.app`.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/render` | Render HTML slides to PNG/WebP/PDF (returns ZIP) |
| `GET` | `/api/prompt?variant=generic` | Get AI prompt template |
| `GET` | `/api/openapi.json` | OpenAPI 3.1.0 spec |

**ChatGPT Custom GPT:**

1. Create a Custom GPT at [chat.openai.com](https://chat.openai.com)
2. Add Action → Import URL: `https://slideshot.vercel.app/api/openapi.json`
3. The GPT can now render slides via the API

**OpenWebUI:**

1. Admin → Tools → Add Tool
2. Paste: `https://slideshot.vercel.app/api/openapi.json`

**Platform support:**

| Platform | Method | Setup |
|----------|--------|-------|
| Cursor | MCP | `npx slideshot-mcp` in `.cursor/mcp.json` |
| Claude Desktop | MCP | `npx slideshot-mcp` in config |
| ChatGPT | OpenAPI Action | Import `/api/openapi.json` |
| OpenWebUI | OpenAPI Tool | Import `/api/openapi.json` |

## AI Prompt Templates

See `prompts/generic.md` and `prompts/branded.md` for copy-paste prompts you can give to ChatGPT, Claude, or any AI to generate compatible carousel HTML.

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
