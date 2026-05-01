# mcp.so Submission

## How mcp.so works

mcp.so accepts submissions via:
- A form at https://mcp.so/submit
- A GitHub PR to their registry: https://github.com/chatmcp/mcp-directory (verify exact path)
- Sometimes auto-discovers from npm packages tagged with `mcp` keyword

## Pre-submission

- [ ] `package.json` keywords include "mcp" (slideshot-mcp does — already tagged)
- [ ] Repository has clear README with config example
- [ ] At least one screenshot ready

## Submission form fields

### Name

slideshot

### Display name

slideshot - HTML to Slides

### Description (short)

Convert HTML slides to PDF, PPTX, PNG, WebP with 11 designer themes — LinkedIn carousels, pitch decks, presentations.

### Description (long)

```markdown
# slideshot

slideshot is an MCP server for rendering HTML into high-resolution slide carousels and documents. It powers content generation workflows for LinkedIn carousels, Instagram posts, pitch decks, infographics, and presentations.

## Why slideshot?

- **11 designer themes** out of the box — generic, branded, instagram-carousel, infographic, pitch-deck, dark-modern, editorial, browser-shell, academic-poster, clinical-medical, sketch-handdrawn
- **AI-guided workflow** — `discover_themes` → `create_slides` → `render_slides`, with built-in `edit_slides` for token-efficient iteration
- **Pixel-perfect output** — Puppeteer renders at 4× scale; PDF page size matches `.slide` dimensions exactly
- **Multi-orientation** — portrait, landscape, square, A4, custom dimensions. Themes reflow correctly (no portrait squeeze)
- **Visual regression CI** — pixel-by-pixel snapshot comparison against committed baselines

## Tools

| Tool | Purpose |
|---|---|
| `discover_themes` | Returns themes, orientations, formats, and persisted user prefs |
| `list_themes` | Idempotent theme list (no discovery gates) |
| `create_slides` | Generate HTML (default or token-saver mode) |
| `edit_slides` | Patch existing HTML (replace_slide, patch_css, patch_class, swap_token) |
| `render_slides` | Output PDF, PNG, WebP, or PPTX |
| `health_check` | Diagnose Puppeteer/Chromium issues |

## Install

```bash
npm install -g slideshot-mcp
```

## Configure (Claude Desktop / Cursor)

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

## Repository

https://github.com/06ketan/slideshot
```

### Categories / Tags

- mcp
- slides
- presentation
- content-generation
- linkedin
- pdf
- ai-tools

### Repository

https://github.com/06ketan/slideshot

### npm package

slideshot-mcp

### Author

Ketan Chavan (https://github.com/06ketan)

### License

MIT

### Homepage

https://slideshot.vercel.app

## If submitting via GitHub PR

Path likely something like `data/servers/slideshot.json` in their registry repo. Format:

```json
{
  "id": "slideshot",
  "name": "slideshot",
  "displayName": "slideshot - HTML to Slides",
  "description": "Convert HTML slides to PDF, PPTX, PNG, WebP with 11 designer themes",
  "author": "Ketan Chavan",
  "homepage": "https://slideshot.vercel.app",
  "repository": "https://github.com/06ketan/slideshot",
  "license": "MIT",
  "npm": "slideshot-mcp",
  "tools": [
    "discover_themes",
    "list_themes",
    "create_slides",
    "edit_slides",
    "render_slides",
    "health_check"
  ],
  "tags": ["slides", "presentation", "content-generation", "linkedin", "pdf"],
  "config": {
    "command": "npx",
    "args": ["-y", "slideshot-mcp"]
  }
}
```

(Check actual schema in their repo before submitting.)

## Post-submission

Track at: https://mcp.so/servers (search "slideshot")
