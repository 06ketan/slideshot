# Anthropic DXT Extension Package

## What is DXT?

DXT (Desktop Extensions) is Anthropic's extension format for Claude Desktop. A `.dxt` file bundles an MCP server with metadata so users can install it from Claude Desktop's UI without manually editing config.

Spec: https://github.com/anthropics/dxt

## Pre-build checklist

- [ ] `slideshot-mcp@4.4.0` is published to npm
- [ ] `manifest.json` at `packages/mcp-server/manifest.json` is up to date
- [ ] All 6 tools described in manifest with correct input schemas
- [ ] Icon image (PNG, 256x256, transparent background) ready

## Build the .dxt file

```bash
# Install the dxt CLI
npm install -g @anthropic-ai/dxt

# Build from the mcp-server package
cd packages/mcp-server
npx @anthropic-ai/dxt pack .
```

This produces `slideshot-2.10.0.dxt` (or whatever the manifest version is).

## What the dxt CLI checks

The DXT spec (current) requires:

| Field | Source | Status |
|---|---|---|
| `manifest_version` | manifest.json | ✅ "0.3" |
| `name` | manifest.json | ✅ "slideshot" |
| `display_name` | manifest.json | ✅ "Slideshot - HTML to Slides" |
| `version` | manifest.json | ✅ "2.10.0" |
| `description` | manifest.json | ✅ updated |
| `author.name` + `author.url` | manifest.json | ✅ Ketan Chavan + GitHub |
| `repository.url` | manifest.json | ✅ |
| `homepage` | manifest.json | ✅ |
| `license` | manifest.json | ✅ MIT |
| `server.type` | manifest.json | needs `node` |
| `server.entry_point` | manifest.json | needs path to dist/index.js |
| `server.mcp_config` | manifest.json | needs command + args |
| `tools[]` | manifest.json | ✅ 6 tools |
| `tools_generated` | manifest.json | should be true (we generate from schema) |
| `icon` | manifest.json | needs base64 or relative path |

## Suggested icon

Generate a 256×256 icon featuring:
- A slide rectangle (4:5 ratio for portrait)
- Yellow `#FFD233` background (matches webapp design)
- Black `#0A0A0A` border (3px)
- Hard shadow (no blur)
- Stylized letter 'S' or a slide-stack motif

Use the webapp's design system. Save to `packages/mcp-server/icon.png` (verify path against current dxt spec).

## Submission to Anthropic

1. Build the .dxt: `npx @anthropic-ai/dxt pack .`
2. Test installation: drag-and-drop the .dxt onto Claude Desktop, verify it loads
3. Submit at: https://github.com/anthropics/dxt-registry (or current submission URL — verify)
4. Wait for Anthropic review

## Verifying manifest.json against current DXT spec

Before submitting, run:

```bash
npx @anthropic-ai/dxt validate packages/mcp-server/manifest.json
```

If validation fails, update manifest.json based on the errors. Common gotchas:
- `tools[]` schemas must match the live tool input schemas
- `server.entry_point` must be a relative path
- `icon` must be a real file or valid base64

## Post-submission

The .dxt file can also be hosted on:
- GitHub Releases (https://github.com/06ketan/slideshot/releases)
- Direct download link in the README

Even before official Anthropic registry approval, users can install the .dxt from a direct link.

## Manifest fields likely needing tweaks

Looking at current `manifest.json`, these may need updating for DXT compliance:

```json
{
  "manifest_version": "0.3",
  "server": {
    "type": "node",
    "entry_point": "dist/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/dist/index.js"]
    }
  },
  "tools_generated": true,
  "icon": "icon.png"
}
```

(Verify against current spec — DXT format evolves.)
