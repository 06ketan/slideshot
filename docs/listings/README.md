# MCP Directory Submissions

Drafts for submitting `slideshot-mcp` to public MCP directories. After npm publish, copy/paste from the relevant file into each platform's submission form.

## Directories covered

| Platform | Submission style | Status |
|---|---|---|
| **Glama (glama.ai)** | GitHub-driven catalog — usually auto-pulls from npm. Submit URL form once. | Draft ready: [glama.md](./glama.md) |
| **mcp.so** | GitHub PR to their registry repo | Draft ready: [mcp-so.md](./mcp-so.md) |
| **Smithery** | GitHub-driven, also accepts manifest.json. Auto-pulls. | Draft ready: [smithery.md](./smithery.md) |
| **MCP Market** | Submit form on mcpmarket.com | Draft ready: [mcp-market.md](./mcp-market.md) |
| **Anthropic DXT** | Build a `.dxt` extension package | Draft ready: [anthropic-dxt.md](./anthropic-dxt.md) |

## Common submission content

All platforms want roughly the same fields. Here's the canonical version:

### One-liner

> Convert HTML slides to high-resolution PNG, WebP, PDF, and PPTX with 11 designer-ready themes. AI-guided workflow for LinkedIn carousels, Instagram posts, pitch decks, and presentations.

### Long description

> slideshot is an MCP server that turns HTML into pixel-perfect slide carousels and documents. Each `<div class="slide">` is captured by Puppeteer at 4× scale and emitted as PNG, WebP, PDF, or PowerPoint. The server ships 11 visual themes (generic, branded, instagram-carousel, infographic, pitch-deck, dark-modern, editorial, browser-shell, academic-poster, clinical-medical, sketch-handdrawn) covering social, marketing, presentation, document, and academic use cases.
>
> The flow is AI-native: `discover_themes` exposes the catalog, `create_slides` generates HTML in either default mode (full creative control) or token-saver mode (structured JSON), `edit_slides` patches existing HTML for cheap iteration, and `render_slides` produces the final files. Themes auto-reflow for landscape (1920×1080) and other orientations through CSS custom properties — no portrait squeezing.

### Tags / categories

`mcp`, `model-context-protocol`, `slides`, `presentation`, `linkedin-carousel`, `instagram-carousel`, `pitch-deck`, `html-to-image`, `puppeteer`, `pdf-generation`, `pptx`, `claude-desktop`, `cursor`, `ai-tools`, `content-generation`

### Repository

https://github.com/06ketan/slideshot

### npm packages

- `slideshot-mcp` (the MCP server)
- `slideshot` (the underlying CLI/library)

### Author

Ketan Chavan — https://github.com/06ketan

### Homepage

https://slideshot.vercel.app

### Support

https://github.com/06ketan/slideshot/issues

### License

MIT

## Submission checklist

When you're ready to publish:

1. ✅ Verify `slideshot-mcp@4.4.0` is live on npm: https://www.npmjs.com/package/slideshot-mcp
2. ✅ Verify GitHub release exists: https://github.com/06ketan/slideshot/releases
3. ✅ Verify `manifest.json` is up to date in the repo
4. ✅ Take screenshots of:
   - Theme gallery page (https://slideshot.vercel.app/gallery)
   - Editor page (https://slideshot.vercel.app/editor)
   - Sample carousel output (e.g. branded-portrait-1.png from `__snapshots__/`)
5. Submit one platform at a time and note the listing URLs back in this file once approved
