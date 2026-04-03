---
name: slideshot
description: "Use this skill when the user wants to create slide carousels, LinkedIn carousels, Instagram posts, pitch decks, infographics, or presentations — or convert HTML to high-res PNG, WebP, or PDF images. Triggers: 'slides', 'carousel', 'deck', 'presentation', 'render HTML to images', 'LinkedIn post', 'Instagram carousel', 'pitch deck', 'make a slide deck', or any .slide HTML content."
license: MIT
metadata:
  author: ketan-chavan
  version: "4.0.0"
  homepage: https://slideshot.vercel.app
  repository: https://github.com/06ketan/slideshot
compatibility: "Requires Node.js >= 18. Works with Claude Desktop, Cursor, and any MCP-compatible client."
---

# Slideshot — HTML to Slides

Slideshot converts HTML with `.slide` elements into pixel-perfect slide images and documents.

## Quick Reference

| Task | Tool | When to use |
|------|------|-------------|
| Start any slide request | `discover_themes` | ALWAYS first. Returns themes, orientations, token modes, formats. |
| Create slides (full HTML) | `create_slides` mode=default | AI writes complete HTML. More creative control, more tokens. |
| Create slides (JSON data) | `create_slides` mode=token_saver | AI sends structured JSON. Server builds HTML. Fewer tokens. |
| Render to files | `render_slides` | Have htmlPath from create_slides. Renders PDF/WebP/PNG. |
| Diagnose failures | `health_check` | Render fails or Chromium won't launch. |

## MCP Setup

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

Add to Claude Desktop config or `.cursor/mcp.json`.

## Workflow

1. Call `discover_themes` to get themes, orientations, token modes, and format options
2. Present options and ask user: theme, topic, orientation, token mode, format, slide count
3. Based on token mode:
   - **Default**: Call `create_slides` with mode=default, theme, orientation (no html) to get CSS prompt. Generate HTML. Call again with html= to save.
   - **Token Saver**: Call `create_slides` with mode=token_saver, theme, orientation, slides=[structured JSON]
4. Show HTML as artifact for preview
5. If user wants changes: revise and call create_slides again (loop until approved)
6. Call `render_slides` with htmlPath and chosen formats

## Token Modes

| Mode | Tokens | Control | How it works |
|------|--------|---------|-------------|
| `default` | More | Full | AI writes complete HTML+CSS. Maximum flexibility. |
| `token_saver` | Fewer | Limited | AI sends JSON data. Server uses built-in theme templates. |

## Themes (8 variants)

| Variant | Name | Style |
|---------|------|-------|
| `generic` | Clean Minimal | Inter font, white cards, flexible layout |
| `branded` | Ketan Slides | Space Mono monospace, teal/coral accents |
| `instagram-carousel` | Instagram Carousel | Bold gradients, Poppins, vibrant |
| `infographic` | Infographic | Data-heavy, DM Sans, stat cards |
| `pitch-deck` | Pitch Deck | Professional, DM Sans, KPI cards |
| `dark-modern` | Dark Modern | Neon accents, glassmorphism, Inter |
| `editorial` | Editorial | Magazine serif, Playfair Display, gold |
| `browser-shell` | Browser Shell | Browser window chrome, Bebas Neue + DM Sans |

## Orientation Presets

| Preset | Dimensions | Use case |
|--------|-----------|----------|
| portrait | 540x675 | Default social/LinkedIn |
| landscape | 1920x1080 | Presentations (16:9) |
| linkedin | 540x675 | LinkedIn carousel PDF |
| instagram | 1080x1080 | Square posts/carousel |
| a4 | 595x842 | Document/print format |
| custom | user-specified | Any size |

## Output Formats

| Format | Best for |
|--------|----------|
| PDF | LinkedIn carousels, sharing, printing |
| WebP | Lightweight web/social images |
| PNG | High-quality images, universal compatibility |

## Slide Types (token_saver mode)

cover, content, stats, list, steps, comparison, quote, code, cta, timeline, team

## HTML Structure (default mode)

```html
<div class="slide" style="width: 540px; height: 675px;">
  <h1>Slide Title</h1>
  <p>Content here</p>
</div>
```

Use Google Fonts via `<link>` tags. Each `.slide` becomes one output page/image.

## CLI Alternative

```bash
npx slideshot ./slides.html --formats png,webp,pdf --scale 4 --out ./output
```

## Web App

Paste HTML and export at [slideshot.vercel.app](https://slideshot.vercel.app).
