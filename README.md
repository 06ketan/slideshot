# slideshot

[![npm](https://img.shields.io/npm/v/slideshot)](https://www.npmjs.com/package/slideshot)
[![npm downloads](https://img.shields.io/npm/dm/slideshot)](https://www.npmjs.com/package/slideshot)
[![npm mcp](https://img.shields.io/npm/v/slideshot-mcp?label=slideshot-mcp)](https://www.npmjs.com/package/slideshot-mcp)
[![GitHub stars](https://img.shields.io/github/stars/06ketan/slideshot)](https://github.com/06ketan/slideshot)
[![license](https://img.shields.io/github/license/06ketan/slideshot)](LICENSE)

Convert AI-generated HTML carousels into high-res PNG, WebP, and PDF — via **CLI**, **Web App**, or **MCP Server**.

**[Web App](https://slideshot.vercel.app)** · **[npm CLI](https://www.npmjs.com/package/slideshot)** · **[npm MCP](https://www.npmjs.com/package/slideshot-mcp)**

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

## License

MIT
