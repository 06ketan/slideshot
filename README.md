# html-to-slides

Convert AI-generated HTML carousels into high-res PNG, WebP, and PDF — via CLI, Web App, or MCP Server.

## Architecture

```
html-to-slides/
  packages/
    core/          ← Shared Puppeteer rendering engine
    cli/           ← npx html-to-slides ./file.html
    mcp-server/    ← MCP stdio server for AI tools
    webapp/        ← Next.js web app with live preview
  prompts/
    generic.md     ← AI prompt template (any style)
    branded.md     ← AI prompt template (Ketan Slides design system)
```

## Quick Start

### CLI

```bash
cd packages/cli && npm install && npm run build
npx html-to-slides ./my-carousel.html --formats png,webp,pdf --scale 4
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

```bash
cd packages/webapp && npm install && npm run dev
```

Open `http://localhost:3000` — paste HTML, preview, export.

### MCP Server

Add to Claude Desktop or Cursor config:

```json
{
  "mcpServers": {
    "html-to-slides": {
      "command": "node",
      "args": ["/path/to/packages/mcp-server/dist/index.js"]
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
npm run build # builds core → cli → mcp-server
cd packages/webapp && npm run build  # builds webapp separately
```
