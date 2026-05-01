# PPTX Rich Native Export — Roadmap (Option B)

**Status**: parked branch `feat/pptx-native-rich`
**Goal**: produce truly editable PowerPoint files where text, shapes, colors, gradients, dividers, and decorative elements are all native PPTX shapes — not just a raster screenshot.

This branch preserves the current PPTX implementation (image-based default + naive native fallback) so we can iterate on rich native export without blocking the main slideshot product, which has dropped PPTX from `formats` to keep the surface lean.

## Why slideshot dropped PPTX from main

The native path in `pptx-native.ts` only extracts text leaf nodes. Anything that lives in `::before`, `::after`, `background-image`, SVG, or non-trivial CSS layout disappears in the export. Combined with pixel→inch rescaling from a 540×675 viewport to a 10-inch canvas, the output looks empty or broken in PowerPoint. Image mode is pixel-perfect but un-editable. Neither extreme is honest about what slideshot is for.

## Definition of done

A user can pick `pptxMode: "rich-native"` and open the file in Microsoft 365 / Keynote / LibreOffice Impress and see:

1. Editable text in the right font, size, color, and position.
2. Backgrounds reproduced as solid fills or shape rectangles, not images.
3. Borders, dividers, dots, and other decorative elements as native shapes.
4. Gradients reproduced via PPTX gradient fills, not flattened images.
5. Custom Google Fonts mapped to system-safe equivalents (already partially done in `mapFont`).
6. SVG icons either flattened to PNG with transparent background OR converted to native shapes for simple paths.

## Implementation phases

### Phase 1 — Shape extraction
- Walk every visible element, not just leaf text nodes.
- For each, capture `borderRadius`, `border*`, `boxShadow`, `backgroundColor`, `backgroundImage`, computed `transform`.
- Emit each non-text element as a `pres.addShape({ ... })` with `prstGeom: "rect"` or `"roundRect"`.
- Skip elements fully covered by a child of identical bounds (avoid double-painting).

### Phase 2 — Pseudo-elements
- Use `getComputedStyle(el, "::before")` and `::after` to read pseudo-element styles.
- Recreate as native shapes positioned at the parent's bounding rect with the offsets specified.
- This is what currently makes branded/instagram-carousel themes render empty in PPTX — they rely heavily on pseudo-elements for grids and corners.

### Phase 3 — Backgrounds
- Detect `linear-gradient(...)` and convert to PPTX gradient stops.
- For `radial-gradient`, fall back to solid fill of dominant color (PPTX gradient fills are limited).
- For `background-image: url(...)` of small assets, embed as a tiled `addImage`.

### Phase 4 — SVG handling
- For inline SVG, capture as PNG via Puppeteer screenshot of the bounding rect (with `omitBackground: true`).
- For simple `<path>`/`<rect>`/`<circle>`, convert to PPTX freeform shapes (deferred — most decks don't need this).

### Phase 5 — Layout fidelity
- Don't extract from a 540×675 viewport. Resize page to the target PPTX dimensions in pixels first (e.g. 1280×720 for landscape) so the layout reflows correctly *before* extraction.
- Ensure font sizes use `el.fontSize / sH * hInch * 72` consistently — current implementation has off-by-some scaling.

### Phase 6 — Validation
- Snapshot test: open generated PPTX with `unzip` and assert each slide XML contains expected `<a:t>`, `<p:sp>` shape counts, and at least one `<a:solidFill>` per shape.
- Visual diff: render the PPTX back to PNG via LibreOffice headless and `pixelmatch` against the source PNG — flag if delta > 5%.
- E2E: open in PowerPoint Online via the Microsoft Graph API, verify it renders.

## Files of interest (current state preserved on this branch)

- `packages/cli/src/pptx-native.ts` — extraction + native generation (where most work happens)
- `packages/cli/src/pptx.ts` — image-mode export (mostly fine, keep)
- `packages/cli/src/render.ts` — orchestration; currently uses a try/catch fallback that hides extraction failures
- `packages/mcp-server/src/tools/render.ts` — exposes `pptxMode` to the MCP tool

## Estimated effort

3-5 days for a competent dev who already knows `pptxgenjs` and OOXML. Worth doing only if PPTX is a top-3 feature request.

## Don't break checklist when revisiting

- Keep `pptxMode: "image"` working as the safe fallback.
- Keep `nativeFallbackUsed: true` warning surface in render output.
- Don't introduce another viewport size — pick *one* (target PPTX dims) and stick with it for both extraction and screenshot fallback.
- Add a feature flag `richNative: true` so we can dogfood without breaking the existing image path.
