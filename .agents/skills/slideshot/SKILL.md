---
name: slideshot
description: "Use this skill when the user wants to create slide carousels, LinkedIn carousels, Instagram posts, pitch decks, infographics, or presentations — or convert HTML to high-res PNG, WebP, PDF, or PPTX images. Triggers: 'slides', 'carousel', 'deck', 'presentation', 'render HTML to images', 'LinkedIn post', 'Instagram carousel', 'pitch deck', 'make a slide deck', or any .slide HTML content."
license: MIT
metadata:
  author: ketan-chavan
  version: "2.8.1"
  homepage: https://slideshot.vercel.app
  repository: https://github.com/06ketan/slideshot
compatibility: "Requires Node.js >= 18. Works with Claude Desktop, Cursor, and any MCP-compatible client."
---

# Slideshot — HTML to Slides

Slideshot converts HTML with `.slide` elements into pixel-perfect slide images and documents.

## Quick Reference

| Task | Tool | When to use |
|------|------|-------------|
| Start from a topic | `create_slides` (step=discover) | User wants slides but hasn't written HTML yet |
| Preview first slide | `create_slides` (step=preview) | Quick check — shows code + image, loop until approved |
| Review all slides | `create_slides` (step=review) | See all slide thumbnails before final render |
| Get theme CSS/prompt | `get_slide_prompt` | Need the full HTML/CSS template for a theme |
| Render to files | `render_html_to_images` | Have HTML, need PNG/WebP/PDF/PPTX output |
| Diagnose failures | `health_check` | Render fails or Chromium won't launch |

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

Add this to Claude Desktop config or `.cursor/mcp.json`.

## Guided Workflow

1. Call `create_slides` with `step="discover"` to get themes and output presets
2. Present the 8 themes to the user and ask: theme, topic, platform, ratio (portrait/landscape)
3. Call `get_slide_prompt` with the chosen variant for full CSS reference
4. Generate HTML with `.slide` elements following the prompt template
5. Call `create_slides` with `step="preview"` — **always show the HTML code AND preview image**
6. If user wants changes: revise HTML and call `preview` again (loop until approved)
7. Call `create_slides` with `step="review"` to show ALL slide thumbnails
8. On user approval, call `render_html_to_images` with full settings (portrait=PDF, landscape=PPTX)

## Themes (8 variants)

| Variant | Name | Style |
|---------|------|-------|
| `generic` | Clean Minimal | Inter font, white cards, flexible layout |
| `branded` | Ketan Slides | Space Mono monospace, teal/coral accents, corner decorations |
| `instagram-carousel` | Instagram Carousel | Bold gradients, Poppins, vibrant swipe-friendly |
| `infographic` | Infographic | Data-heavy, DM Sans, progress bars, stat cards |
| `pitch-deck` | Pitch Deck | Professional, DM Sans, KPI cards, timelines |
| `dark-modern` | Dark Modern | Neon accents, glassmorphism, Inter, code blocks |
| `editorial` | Editorial | Magazine serif, Playfair Display, gold accents |
| `browser-shell` | Browser Shell | Browser window chrome, Bebas Neue + DM Sans, yellow/navy |

## Output Presets

| Preset | Formats | Dimensions | Scale | Use case |
|--------|---------|------------|-------|----------|
| Instagram | webp | 1080x1350 | 1x | Instagram post/carousel |
| LinkedIn | pdf, webp | 540x675 | 4x | LinkedIn carousel (2160x2700) |
| Presentation | pptx | 1920x1080 | 2x | PowerPoint deck (landscape) |
| Custom | png, webp, pdf | 540x675 | 4x | All formats, default dims |

## PPTX Modes

- **native** (default): Extracts text into editable PowerPoint text boxes with font mapping (Bebas Neue→Impact, DM Sans→Calibri, Playfair Display→Georgia, Poppins→Arial, Space Mono→Courier New). Also captures images and SVGs as embedded pictures. Falls back to image mode with a warning if extraction fails.
- **image**: Screenshot-based slides — pixel-perfect but not editable. Use when exact web rendering is required.

## HTML Structure

Slideshot expects HTML with `.slide` elements at fixed dimensions:

```html
<div class="slide" style="width: 540px; height: 675px;">
  <h1>Slide Title</h1>
  <p>Content here</p>
</div>
<div class="slide" style="width: 540px; height: 675px;">
  <h1>Slide 2</h1>
</div>
```

Use Google Fonts via `<link>` tags. Each `.slide` becomes one output image/page.

## CLI Alternative

```bash
npx slideshot ./slides.html --formats png,webp,pdf,pptx --scale 4 --out ./output
```

## Web App

Paste HTML and export at [slideshot.vercel.app](https://slideshot.vercel.app).
