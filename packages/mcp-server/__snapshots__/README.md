# Visual-diff snapshots

This directory holds reference PNGs for the postmortem-roadmap visual gauntlet (W3.3).

## File naming

`<theme>-<orientation>-<count>-<slide>.png`

Example: `branded-portrait-9-03.png` is slide 3 of a 9-slide branded portrait deck.

## Regenerating

After an intentional CSS or renderer change:

```bash
npm run build:cli && npm run build:mcp
npm run test:visual:update -w packages/mcp-server
```

For a quick smoke test against 3 themes:

```bash
npm run test:visual:smoke -w packages/mcp-server -- --update    # write
npm run test:visual:smoke -w packages/mcp-server                # diff
```

## Diff threshold

`scripts/visual-diff.mjs` allows up to 1% pixel drift before failing — small enough to catch genuine layout/typography regressions but tolerant of font-rasterization noise.

## CI

`.github/workflows/visual-diff.yml` runs the full 11×2×3 = 66-case matrix on every PR that touches `packages/cli/src/**`, `packages/mcp-server/src/templates/**`, or any prompt.
