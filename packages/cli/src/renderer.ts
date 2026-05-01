import type { Page } from "puppeteer";
import path from "node:path";
import fs from "node:fs";
import type { ImageFormat, RenderOptions } from "./types.js";

/**
 * Shared print/screenshot reset.
 *
 * Both the PDF backend and the element-screenshot backend run on the same DOM,
 * but Puppeteer's `page.pdf()` honors browser-default margins (0.4in top/bottom)
 * and CSS `@page` size. Without an explicit `@page` rule sized to match each
 * slide, slide N spills 5% onto page N+1, doubling the output page count
 * (postmortem SS-001).
 *
 * Callers must pass the actual slide width/height — the constants must NOT be
 * hard-coded so that custom orientations (1080x1080, 1920x1080, A4) all work.
 */
export function buildPrintCss(width: number, height: number): string {
  return `
  @page { size: ${width}px ${height}px; margin: 0; }
  html, body { margin: 0 !important; padding: 0 !important; gap: 0 !important; background: #fff !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; text-rendering: geometricPrecision; }
  .slide-meta { display: none !important; }
  .slide {
    page-break-after: always !important;
    break-after: page !important;
    width: ${width}px !important;
    height: ${height}px !important;
    flex-shrink: 0 !important;
  }
  .slide:last-child { page-break-after: auto !important; break-after: auto !important; }
  #exportBtn, #hint { display: none !important; }
`;
}

/**
 * @deprecated Use `buildPrintCss(width, height)`. Kept as a default-portrait
 * alias for any external import.
 */
export const PRINT_CSS = buildPrintCss(540, 675);

export async function loadHtml(page: Page, opts: RenderOptions): Promise<void> {
  if (opts.htmlPath) {
    const abs = path.resolve(opts.htmlPath);
    if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`);
    await page.goto(`file://${abs}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  } else if (opts.html) {
    await page.setContent(opts.html, { waitUntil: "domcontentloaded", timeout: 60000 });
  } else {
    throw new Error("Provide either `html` string or `htmlPath`.");
  }
  await page.evaluateHandle("document.fonts.ready");
}

export async function screenshotSlides(
  page: Page,
  selector: string,
  outDir: string,
  formats: ImageFormat[],
  webpQuality: number,
  slideRange?: [number, number],
  width?: number,
  height?: number,
): Promise<string[]> {
  // Apply the same body/print reset to screenshots so cropping geometry matches
  // the PDF backend exactly (postmortem SS-003 PDF/PNG parity).
  if (width && height) {
    await page.addStyleTag({ content: buildPrintCss(width, height) });
  }

  const allSlides = await page.$$(selector);
  if (allSlides.length === 0)
    throw new Error(`No elements found for selector "${selector}"`);

  const start = slideRange ? slideRange[0] - 1 : 0;
  const end = slideRange ? Math.min(slideRange[1], allSlides.length) : allSlides.length;
  const slides = allSlides.slice(start, end);

  const files: string[] = [];

  for (let i = 0; i < slides.length; i++) {
    const num = String(start + i + 1).padStart(2, "0");

    if (formats.includes("png")) {
      const out = path.join(outDir, `slide-${num}.png`);
      await slides[i].screenshot({ path: out, type: "png" });
      files.push(out);
    }

    if (formats.includes("webp")) {
      const out = path.join(outDir, `slide-${num}.webp`);
      await slides[i].screenshot({
        path: out,
        type: "webp",
        quality: webpQuality,
      });
      files.push(out);
    }
  }

  return files;
}

export async function generatePdf(
  page: Page,
  opts: RenderOptions,
  outDir: string,
  width: number,
  height: number,
): Promise<string> {
  await loadHtml(page, opts);
  await page.addStyleTag({ content: buildPrintCss(width, height) });

  const pdfPath = path.join(outDir, opts.pdfFilename || "carousel.pdf");
  await page.pdf({
    path: pdfPath,
    width: `${width}px`,
    height: `${height}px`,
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    preferCSSPageSize: true,
  });

  return pdfPath;
}
