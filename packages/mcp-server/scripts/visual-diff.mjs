#!/usr/bin/env node
/**
 * Visual-diff gauntlet (postmortem roadmap #8).
 *
 * For each (theme × orientation × slide-count) combination, we:
 *   1. Assemble the canonical sample deck via the token_saver path.
 *   2. Render it to PNG at scale=1 using the live Puppeteer renderer.
 *   3. Compare each PNG against the snapshot at
 *      __snapshots__/<theme>-<orientation>-<count>-<n>.png using pixelmatch.
 *   4. Fail the build if any diff exceeds DIFF_THRESHOLD pixels.
 *
 * Modes:
 *   --update   Write/overwrite snapshots from current output instead of diffing.
 *   --themes   Comma-separated list to limit the matrix (default: all 11).
 *   --counts   Comma-separated counts to test (default: "1,4,9").
 *
 * Usage:
 *   node packages/mcp-server/scripts/visual-diff.mjs            # diff
 *   node packages/mcp-server/scripts/visual-diff.mjs --update   # snapshot
 */

import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "..", "..");
const SNAPSHOT_DIR = path.join(PKG_ROOT, "__snapshots__");
const CLI_DIST = path.resolve(REPO_ROOT, "packages", "cli", "dist", "index.js");
const MCP_DIST = path.resolve(PKG_ROOT, "dist", "templates", "assembler.js");

const ALL_THEMES = [
  "generic",
  "branded",
  "instagram-carousel",
  "infographic",
  "pitch-deck",
  "dark-modern",
  "editorial",
  "browser-shell",
  "academic-poster",
  "clinical-medical",
  "sketch-handdrawn",
];

const ALL_ORIENTATIONS = ["portrait", "landscape"];

const DIFF_THRESHOLD_PCT = 1.0; // 1% of pixels may differ before we fail.

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    update: false,
    themes: ALL_THEMES,
    orientations: ALL_ORIENTATIONS,
    counts: [1, 4, 9],
  };
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--update") opts.update = true;
    else if (a === "--themes") opts.themes = args[++i].split(",").filter(Boolean);
    else if (a === "--orientations")
      opts.orientations = args[++i].split(",").filter(Boolean);
    else if (a === "--counts")
      opts.counts = args[++i].split(",").map(Number).filter((n) => n > 0);
  }
  return opts;
}

const SAMPLE_SLIDES = [
  { type: "cover", headline: "Visual Diff", subtitle: "Snapshot reference deck", facts: ["Slideshot CI", "Auto-generated", "Stable seed", "Run me"] },
  { type: "stats", title: "Numbers", cards: [{ value: "98%", label: "Coverage" }, { value: "3.2x", label: "Speedup" }, { value: "142", label: "Themes" }, { value: "0", label: "Diffs" }] },
  { type: "list", title: "Findings", items: [{ title: "Alpha", description: "Edge case A." }, { title: "Beta", description: "Edge case B." }, { title: "Gamma", description: "Edge case C." }] },
  { type: "content", title: "Why we test", paragraphs: ["Snapshots prevent visual regressions when CSS changes.", "We render the same canonical deck for every theme."] },
  { type: "steps", title: "Pipeline", items: [{ num: 1, title: "Assemble" }, { num: 2, title: "Render" }, { num: 3, title: "Diff" }] },
  { type: "comparison", title: "Then vs Now", leftLabel: "Then", rightLabel: "Now", left: [{ label: "No tests" }], right: [{ label: "72 cases" }] },
  { type: "quote", quote: "Snapshots are the cheapest insurance against silent visual regressions.", attribution: "Anonymous" },
  { type: "code", title: "Snippet", code: "const sum = (a, b) => a + b;\nconsole.log(sum(2, 3));", language: "JavaScript" },
  { type: "cta", headline: "Ready to ship?", description: "Run the gauntlet.", action: "npm run test:visual" },
];

function buildDeck(theme, count, orientation) {
  const slides = SAMPLE_SLIDES.slice(0, count);
  return { theme, slides, orientation };
}

async function ensureBuilds() {
  if (!fs.existsSync(CLI_DIST)) {
    throw new Error(`CLI not built. Run: npm run build:cli`);
  }
  if (!fs.existsSync(MCP_DIST)) {
    throw new Error(`MCP not built. Run: npm run build:mcp`);
  }
}

function readPng(p) {
  return PNG.sync.read(fs.readFileSync(p));
}

function diffPng(a, b) {
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const out = new PNG({ width: w, height: h });
  // Crop both buffers to the common rect so dimension mismatches don't crash
  // pixelmatch — instead they'll show up as a high diff count.
  const aBuf = Buffer.alloc(w * h * 4);
  const bBuf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y += 1) {
    a.data.copy(aBuf, y * w * 4, y * a.width * 4, y * a.width * 4 + w * 4);
    b.data.copy(bBuf, y * w * 4, y * b.width * 4, y * b.width * 4 + w * 4);
  }
  const diff = pixelmatch(aBuf, bBuf, out.data, w, h, { threshold: 0.1 });
  return { diff, total: w * h, out };
}

async function main() {
  const opts = parseArgs();
  await ensureBuilds();

  const { renderSlides } = await import(CLI_DIST);
  const { assembleHtml } = await import(MCP_DIST);

  if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const cases = [];
  for (const theme of opts.themes) {
    for (const orientation of opts.orientations) {
      for (const count of opts.counts) {
        cases.push({ theme, orientation, count });
      }
    }
  }

  let failures = 0;
  let updated = 0;

  for (const { theme, orientation, count } of cases) {
    const html = assembleHtml(buildDeck(theme, count, orientation));
    const tmpHtml = path.join(os.tmpdir(), `vdiff-${theme}-${orientation}-${count}-${Date.now()}.html`);
    const tmpOut = path.join(os.tmpdir(), `vdiff-out-${theme}-${orientation}-${count}-${Date.now()}`);
    fs.writeFileSync(tmpHtml, html);

    const dims = orientation === "landscape" ? { width: 1920, height: 1080 } : { width: 540, height: 675 };

    try {
      await renderSlides({
        htmlPath: tmpHtml,
        outDir: tmpOut,
        formats: ["png"],
        scale: 1,
        ...dims,
      });
    } catch (err) {
      console.error(`[${theme}/${orientation}/${count}] render failed: ${err.message}`);
      failures += 1;
      continue;
    }

    const renderedPngs = fs
      .readdirSync(tmpOut)
      .filter((f) => f.endsWith(".png"))
      .sort()
      .map((f) => path.join(tmpOut, f));

    if (renderedPngs.length !== count) {
      console.error(`[${theme}/${orientation}/${count}] rendered ${renderedPngs.length} slides, expected ${count}`);
      failures += 1;
    }

    for (let i = 0; i < renderedPngs.length; i += 1) {
      const slot = path.join(SNAPSHOT_DIR, `${theme}-${orientation}-${count}-${String(i + 1).padStart(2, "0")}.png`);
      if (opts.update) {
        fs.copyFileSync(renderedPngs[i], slot);
        updated += 1;
        continue;
      }
      if (!fs.existsSync(slot)) {
        console.error(`[${theme}/${orientation}/${count}] missing snapshot ${path.basename(slot)} — run with --update first`);
        failures += 1;
        continue;
      }
      const refImg = readPng(slot);
      const newImg = readPng(renderedPngs[i]);
      const { diff, total } = diffPng(refImg, newImg);
      const pct = (100 * diff) / total;
      if (pct > DIFF_THRESHOLD_PCT) {
        console.error(`✗ [${theme}/${orientation}/${count}] slide ${i + 1}: ${pct.toFixed(2)}% diff (${diff}/${total} px)`);
        failures += 1;
      } else {
        console.log(`✓ [${theme}/${orientation}/${count}] slide ${i + 1}: ${pct.toFixed(3)}% diff`);
      }
    }

    try { fs.unlinkSync(tmpHtml); } catch {}
    try { fs.rmSync(tmpOut, { recursive: true, force: true }); } catch {}
  }

  if (opts.update) {
    console.log(`\nWrote ${updated} snapshots to ${SNAPSHOT_DIR}`);
    process.exit(0);
  }

  if (failures > 0) {
    console.error(`\n${failures} visual-diff failures. Run \`npm run test:visual:update\` if the changes are intentional.`);
    process.exit(1);
  } else {
    console.log(`\nAll ${cases.length} cases passed.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
