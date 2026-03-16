# slideshot-mcp

[![npm](https://img.shields.io/npm/v/slideshot-mcp)](https://www.npmjs.com/package/slideshot-mcp)
[![npm downloads](https://img.shields.io/npm/dm/slideshot-mcp)](https://www.npmjs.com/package/slideshot-mcp)
[![GitHub stars](https://img.shields.io/github/stars/06ketan/slideshot)](https://github.com/06ketan/slideshot)

MCP server that renders HTML slides to high-resolution PNG, WebP, and PDF. Use with Claude Desktop, Cursor, or any MCP-compatible client.

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

### `render_html_to_images`

Render HTML slides to files.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `html` | string | yes | — | Full HTML string with slide elements |
| `outDir` | string | yes | — | Absolute path to output directory |
| `selector` | string | no | `.slide` | CSS selector for slides |
| `width` | number | no | `540` | Slide width (CSS px) |
| `height` | number | no | `675` | Slide height (CSS px) |
| `scale` | number | no | `4` | Device scale factor (1-6) |
| `formats` | string[] | no | `["png","webp","pdf"]` | Output formats |

### `get_slide_prompt`

Returns an AI prompt template for generating compatible slide HTML.

| Parameter | Type | Description |
|-----------|------|-------------|
| `variant` | `"generic"` \| `"branded"` | Prompt style |

## Prompts

- **`generic-slides`** — Clean minimal slide generation prompt
- **`branded-slides`** — Ketan Slides design system prompt

## Workflow

1. Ask the AI to use the `get_slide_prompt` tool for the prompt template
2. Provide your content topic — the AI generates slide HTML
3. AI calls `render_html_to_images` with the HTML and your desired output path
4. Get PNG, WebP, and PDF files ready for LinkedIn, Instagram, or presentations

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

## Related

- **[slideshot](https://www.npmjs.com/package/slideshot)** — CLI and programmatic API
- **[Web App](https://slideshot.vercel.app)** — paste HTML, preview, export online
- **[GitHub](https://github.com/06ketan/slideshot)** — source code & issues

## License

MIT
