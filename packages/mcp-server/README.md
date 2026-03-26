# slideshot-mcp

[![npm](https://img.shields.io/npm/v/slideshot-mcp)](https://www.npmjs.com/package/slideshot-mcp)
[![npm downloads](https://img.shields.io/npm/dm/slideshot-mcp)](https://www.npmjs.com/package/slideshot-mcp)
[![GitHub stars](https://img.shields.io/github/stars/06ketan/slideshot)](https://github.com/06ketan/slideshot)

MCP server that renders HTML slides to high-resolution PNG, WebP, PDF, and PPTX. Use with Claude Desktop, Cursor, or any MCP-compatible client.

**[Web App](https://slideshot.vercel.app)** · **[npm CLI](https://www.npmjs.com/package/slideshot)** · **[GitHub](https://github.com/06ketan/slideshot)**

## Setup

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Cursor

Add to `.cursor/mcp.json`:

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

## Tools

### `create_slides`

Guided slide creation workflow. Start here when creating slides from a topic.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `step` | `"discover"` \| `"preview"` \| `"review"` | yes | `discover` = theme catalog + output presets; `preview` = render slide 1 at 1x; `review` = render all slides as thumbnails |
| `html` | string | for preview/review | HTML to preview (required for `preview` and `review` steps) |
| `aspectRatio` | `"portrait"` \| `"landscape"` | no | Simplified ratio: portrait = 540x675 (PDF, social), landscape = 1920x1080 (PPTX, presentations) |

### `render_html_to_images`

Render HTML slides to files. Use after `create_slides` or with your own HTML.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `html` | string | one of html/htmlPath | — | Full HTML string with slide elements |
| `htmlPath` | string | one of html/htmlPath | — | Absolute path to an HTML file on disk |
| `outDir` | string | no | `~/Desktop/slideshot-output` | Absolute path to output directory |
| `selector` | string | no | `.slide` | CSS selector for slides |
| `width` | number | no | `540` | Slide width (CSS px) |
| `height` | number | no | `675` | Slide height (CSS px) |
| `scale` | number | no | `4` | Device scale factor (1-6) |
| `formats` | string[] | no | `["webp","pdf"]` | Output formats: `png`, `webp`, `pdf`, `pptx` |
| `orientation` | `"portrait"` \| `"landscape"` | no | — | Preset: portrait (540x675) or landscape (1920x1080) |
| `pdfFilename` | string | no | `carousel.pdf` | Custom PDF filename |
| `pptxFilename` | string | no | `carousel.pptx` | Custom PPTX filename |
| `slideRange` | [number, number] | no | — | Render only slides N-M, 1-indexed |
| `pptxMode` | `"native"` \| `"image"` | no | `native` | `native` = editable text, `image` = pixel-perfect screenshots |

### `get_slide_prompt`

Returns an AI prompt template with full CSS + component reference for generating slide HTML.

| Parameter | Type | Description |
|-----------|------|-------------|
| `variant` | enum | Theme style (see table below) |

| Variant | Style |
|---------|-------|
| `generic` | Clean minimal, Inter font, white cards |
| `branded` | Ketan Slides, Space Mono, teal/coral accents |
| `instagram-carousel` | Bold vibrant, Poppins, gradient backgrounds |
| `infographic` | Data-heavy, DM Sans, progress bars, stat cards |
| `pitch-deck` | Professional, DM Sans, KPI cards, timelines |
| `dark-modern` | Neon glassmorphism, Inter, code blocks |
| `editorial` | Magazine serif, Playfair Display, gold accents |
| `browser-shell` | Browser window chrome, Bebas Neue + DM Sans, yellow/navy |

### `health_check`

Verify Puppeteer/Chromium can launch. Run first to diagnose render failures.

No parameters required.

## Prompts

8 built-in prompt templates, each accessible as an MCP prompt:

- **`generic-slides`** — Clean minimal slide generation
- **`branded-slides`** — Ketan Slides design system with monospace typography
- **`instagram-carousel-slides`** — Bold vibrant Instagram carousel style
- **`infographic-slides`** — Data-heavy infographic with charts and stats
- **`pitch-deck-slides`** — Professional pitch deck with KPIs
- **`dark-modern-slides`** — Neon glassmorphism on dark backgrounds
- **`editorial-slides`** — Magazine serif style with gold accents
- **`browser-shell-slides`** — Browser window chrome with yellow/navy palette

## Recommended Workflow

1. AI calls `create_slides` with `step="discover"` to get themes and presets
2. User picks a theme, topic, and target platform (portrait for social/PDF, landscape for PPTX)
3. AI calls `get_slide_prompt` with the chosen variant for CSS/HTML reference
4. AI generates slide HTML using the prompt template
5. AI calls `create_slides` with `step="preview"` — shows HTML code + slide 1 image
6. User reviews code and preview — requests changes or approves
7. If changes needed: AI revises HTML and calls `preview` again (loop until approved)
8. AI calls `create_slides` with `step="review"` to show all slide thumbnails
9. User confirms full deck or requests per-slide changes
10. AI calls `render_html_to_images` with full HTML and desired formats
11. Output files ready for LinkedIn, Instagram, or presentations

## PPTX Modes

| Mode | Description | Pros | Cons |
|------|-------------|------|------|
| `native` (default) | Extracts text from DOM into editable PowerPoint text boxes. Also captures images/SVGs as embedded pictures. | Editable text, searchable, smaller files | Font mapping may differ from web (Google Fonts → system fonts) |
| `image` | Screenshots each slide as a full-page PNG embedded in PPTX. | Pixel-perfect, exact web rendering | Not editable, larger files, no text search |

Native mode maps common Google Fonts to system equivalents (e.g., Bebas Neue → Impact, DM Sans → Calibri, Playfair Display → Georgia). If native extraction fails, it automatically falls back to image mode with a warning.

## HTTP API Alternative

For platforms that don't support MCP (ChatGPT, OpenWebUI), the same tools are available as a REST API:

```
https://slideshot.vercel.app/api/openapi.json
```

| Platform | Method |
|----------|--------|
| Cursor / Claude Desktop | MCP (this package) |
| ChatGPT Custom GPT | OpenAPI Action — import the spec URL above |
| OpenWebUI | OpenAPI Tool — import the spec URL above |

## Privacy Policy

Slideshot MCP runs entirely on your local machine. No data is collected, transmitted, or stored remotely. Output files are saved only to the directory you specify. See the full [Privacy Policy](https://github.com/06ketan/slideshot/blob/main/PRIVACY.md).

## Related

- **[slideshot](https://www.npmjs.com/package/slideshot)** — CLI and programmatic API
- **[Web App](https://slideshot.vercel.app)** — paste HTML, preview, export online
- **[GitHub](https://github.com/06ketan/slideshot)** — source code & issues

## License

MIT
