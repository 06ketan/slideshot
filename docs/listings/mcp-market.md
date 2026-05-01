# MCP Market Submission

## How MCP Market works

mcpmarket.com is a curated marketplace. Submit via:

1. https://mcpmarket.com/submit (web form)
2. Possibly via GitHub repo PR (verify in their docs)

## Submission form fields

### Server Name

slideshot

### Display Name

slideshot - HTML to Slides

### One-line description

Convert HTML slides to PDF, PPTX, PNG, WebP with 11 designer themes — LinkedIn carousels, pitch decks, presentations.

### Detailed description

```
slideshot is an MCP server that turns HTML into pixel-perfect slide carousels and documents. Powered by Puppeteer for crisp 4x rendering, it ships 11 visual themes covering social media, marketing, presentations, documents, and academic use cases.

Six tools: discover_themes (catalog + presets), list_themes (idempotent), create_slides (default or token-saver mode), edit_slides (replace_slide / patch_css / patch_class / swap_token for cheap iteration), render_slides (PDF/PNG/WebP/PPTX), and health_check (diagnostics).

Five orientation presets (portrait, landscape, LinkedIn, Instagram, A4) plus custom. All themes reflow correctly for landscape via CSS custom properties — no portrait squeeze. PPTX defaults to image-mode for design fidelity; native text-only export is opt-in.

Built for Claude Desktop, Cursor, and any MCP-compatible client.
```

### Category

Content Generation / Presentation

### Tags

slides, presentation, linkedin, instagram, pitch-deck, pdf, pptx, ai-tools, content-generation

### Repository

https://github.com/06ketan/slideshot

### npm

https://www.npmjs.com/package/slideshot-mcp

### Homepage

https://slideshot.vercel.app

### Author

Ketan Chavan — https://github.com/06ketan

### License

MIT

### Install command

```bash
npm install -g slideshot-mcp
```

### MCP config (cross-client)

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

### Screenshots / demo

1. Theme gallery (https://slideshot.vercel.app/gallery)
2. A sample branded carousel (see `__snapshots__/branded-portrait-4-01.png`)
3. The web editor with live preview (https://slideshot.vercel.app/editor)

### Use cases

- LinkedIn carousels (4:5 portrait → PDF)
- Instagram carousel posts (1:1 square → PNG)
- Pitch decks (16:9 landscape → PDF or PPTX)
- Infographics for blog posts (portrait → WebP)
- Academic poster summaries (academic-poster theme)
- Medical case reports (clinical-medical theme)

### Pricing

Free / open source / MIT licensed.

### Featured request

slideshot is uncommonly comprehensive: it bundles HTML generation, theming, rendering, AND iterative editing in one MCP server with visual regression CI baked in. Worth featuring as a content-generation showcase.

## Post-submission

Track at: https://mcpmarket.com (search "slideshot")
