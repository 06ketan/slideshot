#!/usr/bin/env node
/**
 * Regression test for postmortem SS-001 — PDF page-overflow.
 *
 * Renders 3- and 9-slide test decks to PDF and asserts:
 *   pdfPageCount === slideCount
 *
 * Before the fix this produced 6 and 18 pages respectively (every slide
 * spilled 5% onto a second page). After the fix both decks must produce
 * exactly N pages where N = slide count.
 *
 * Usage:
 *   cd packages/cli && npm run build && node test/pdf-pages.test.mjs
 */

import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distEntry = path.resolve(__dirname, "..", "dist", "index.js");

if (!fs.existsSync(distEntry)) {
  console.error(`✗ dist/index.js not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const { renderSlides } = await import(distEntry);

const buildHtml = (n) => {
  const slides = Array.from({ length: n }, (_, i) =>
    `<div class="slide" style="background:${i % 2 ? "#fff" : "#eee"};display:flex;align-items:center;justify-content:center;font:bold 80px sans-serif;color:#000;">Slide ${i + 1}</div>`,
  ).join("\n");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px}
.slide{position:relative;width:540px;height:675px;flex-shrink:0;overflow:hidden}
</style></head><body>${slides}</body></html>`;
};

// Lightweight PDF page counter — reads the raw PDF and counts /Type /Page
// references in the cross-reference table. Avoids adding pdf-parse dep.
function countPdfPages(pdfBuffer) {
  const text = pdfBuffer.toString("latin1");
  // Match `/Type /Page` (singular, not /Pages) followed by a non-`s` char.
  // Each page object emits one such marker. Robust enough for our generator.
  const matches = text.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

let failures = 0;

async function runCase(slideCount) {
  const tmpHtml = path.join(os.tmpdir(), `slideshot-test-${slideCount}-${Date.now()}.html`);
  const outDir = path.join(os.tmpdir(), `slideshot-test-${slideCount}-${Date.now()}-out`);
  fs.writeFileSync(tmpHtml, buildHtml(slideCount), "utf-8");

  try {
    const result = await renderSlides({
      htmlPath: tmpHtml,
      outDir,
      formats: ["pdf"],
      width: 540,
      height: 675,
      scale: 1,
    });

    const pdfFile = result.files.find((f) => f.endsWith(".pdf"));
    if (!pdfFile) throw new Error("no PDF produced");
    const pdfBuf = fs.readFileSync(pdfFile);
    const pages = countPdfPages(pdfBuf);

    if (pages !== slideCount) {
      console.error(`✗ slideCount=${slideCount}: expected ${slideCount} PDF pages, got ${pages}`);
      failures += 1;
    } else {
      console.log(`✓ slideCount=${slideCount}: PDF has ${pages} pages`);
    }
  } finally {
    try { fs.unlinkSync(tmpHtml); } catch {}
    try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
  }
}

console.log("→ SS-001 regression: PDF page count must equal slide count\n");
await runCase(3);
await runCase(9);

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
} else {
  console.log("\nAll PDF page-count assertions passed.");
}
