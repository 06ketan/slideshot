# Glama (glama.ai) Submission

## How Glama works

Glama auto-discovers MCP servers from GitHub. To get listed:

1. Make sure your repo has the MCP topic tag on GitHub
2. Submit the URL at https://glama.ai/mcp/servers/submit (or use their GitHub-based discovery)
3. Glama may also pick up `manifest.json` if it's at a standard location

## Pre-submission

- [ ] Tag the repo with topics on GitHub: `mcp`, `model-context-protocol`, `slides`, `presentation`, `linkedin`, `puppeteer`, `pdf-generation`
- [ ] Make sure `README.md` has installation + usage instructions
- [ ] Verify `package.json` `repository.url` points to GitHub (it does)

## Submission form fields

### Name

slideshot

### Display name

slideshot - HTML to Slides

### Tagline (one-liner)

Convert HTML slides to PDF, PPTX, PNG, and WebP with 11 designer-ready themes — built for LinkedIn carousels, pitch decks, and presentations.

### Description

```
slideshot turns HTML into pixel-perfect slide carousels and documents. Each <div class="slide"> renders at 4x scale via Puppeteer to PNG, WebP, PDF, or PowerPoint.

11 built-in themes:
- generic, branded, instagram-carousel, infographic, pitch-deck
- dark-modern, editorial, browser-shell
- academic-poster, clinical-medical, sketch-handdrawn

6 MCP tools:
- discover_themes — catalog + presets + persisted prefs
- list_themes — idempotent theme list (no gates)
- create_slides — HTML generation (default or token-saver mode)
- edit_slides — partial HTML patches (replace_slide, patch_css, patch_class, swap_token)
- render_slides — output files (PNG, WebP, PDF, PPTX)
- health_check — Puppeteer/Chromium diagnostics

Orientation presets: portrait (540×675), landscape (1920×1080), linkedin (540×675), instagram (1080×1080), a4 (595×842), or fully custom dimensions. All themes reflow correctly for landscape (multi-column grids, larger fonts, bigger paddings).

PPTX defaults to image-mode for design fidelity. Native text-only export is opt-in.

Works with Claude Desktop, Cursor, and any MCP-compatible client.
```

### Categories

- Content Generation
- Productivity
- Marketing Tools
- Presentation Tools

### Tags

mcp, model-context-protocol, slides, presentation, linkedin-carousel, instagram-carousel, pitch-deck, html-to-image, puppeteer, pdf-generation, pptx, ai-tools, content-generation

### Repository URL

https://github.com/06ketan/slideshot

### Installation command

```bash
npm install -g slideshot-mcp
```

### MCP client config (Claude Desktop)

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

### MCP client config (Cursor)

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

### Documentation links

- README: https://github.com/06ketan/slideshot#readme
- Web demo: https://slideshot.vercel.app
- npm: https://www.npmjs.com/package/slideshot-mcp

### Screenshots needed

Upload these:
1. `theme-gallery.png` — screenshot of https://slideshot.vercel.app/gallery
2. `branded-sample.png` — example output from branded theme (use `__snapshots__/branded-portrait-4-01.png`)
3. `editor.png` — screenshot of https://slideshot.vercel.app/editor

### Featured?

Request featured listing if applicable — slideshot's combined surface (slides + themes + AI workflow + edit_slides + visual diff CI) is uncommon among MCP servers.

## Post-submission

Track approval at: https://glama.ai/mcp/servers (search for slideshot once listed)
