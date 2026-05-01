# Smithery Submission

## How Smithery works

Smithery (smithery.ai) is a marketplace + registry for MCP servers. Submission is GitHub-driven:

1. Add a `smithery.yaml` (or similar manifest) to the repo root
2. Submit the GitHub URL at https://smithery.ai
3. Smithery auto-discovers and indexes

## Pre-submission

- [ ] Verify the `manifest.json` already in `packages/mcp-server/` is up to date (it was bumped to 2.10.0)
- [ ] Add a `smithery.yaml` if Smithery requires its own format (verify at smithery.ai/docs)

## smithery.yaml (draft, verify exact schema)

Place at the repo root. This is a guess — confirm against current Smithery docs.

```yaml
name: slideshot
version: 4.4.0
description: Convert HTML slides to PDF, PPTX, PNG, WebP with 11 designer themes — LinkedIn carousels, pitch decks, presentations.
author:
  name: Ketan Chavan
  url: https://github.com/06ketan
license: MIT
repository: https://github.com/06ketan/slideshot
homepage: https://slideshot.vercel.app

start:
  command: npx
  args:
    - -y
    - slideshot-mcp

categories:
  - content-generation
  - productivity
  - presentation

tags:
  - slides
  - linkedin-carousel
  - instagram-carousel
  - pitch-deck
  - pdf-generation
  - pptx
  - puppeteer

tools:
  - name: discover_themes
    description: Discover available themes, orientations, formats, and user preferences
  - name: list_themes
    description: Idempotent theme list with no discovery gates
  - name: create_slides
    description: Generate slide HTML in default (full HTML) or token-saver (JSON) mode
  - name: edit_slides
    description: Apply partial edits to existing slide HTML — replace_slide, patch_css, patch_class, swap_token
  - name: render_slides
    description: Render HTML to PDF, PNG, WebP, or PPTX via Puppeteer
  - name: health_check
    description: Diagnose Puppeteer and Chromium issues

documentation:
  - title: Quick start
    url: https://github.com/06ketan/slideshot#quick-start
  - title: Theme catalog
    url: https://slideshot.vercel.app/gallery
  - title: Web editor
    url: https://slideshot.vercel.app/editor
```

## Submission form fields (if web form is available)

Same as Glama — see `glama.md` for the canonical content.

### Special Smithery fields

- **Verified author**: link your GitHub account once approved
- **Sandbox config**: Smithery runs the server in a sandbox; if you need additional permissions (e.g. file write), document them
- **Test scenarios**: Smithery may require a sample `mcp.json` config and test prompts

### Sample test prompts to include

```
1. "Use slideshot to discover available themes"
2. "Create a 5-slide LinkedIn carousel about [topic] using the branded theme"
3. "Render the carousel to PDF"
4. "Render the same carousel to PNG at 2x scale"
```

## Post-submission

Track at: https://smithery.ai/servers (search "slideshot")
