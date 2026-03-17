import type { Page } from "puppeteer";
import path from "node:path";
import fs from "node:fs";
import type { ImageFormat, RenderOptions } from "./types.js";

export const PRINT_CSS = `
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { padding: 0 !important; gap: 0 !important; background: #fff !important; }
  .slide-meta { display: none !important; }
  .slide {
    page-break-after: always !important;
    break-after: page !important;
    width: 100vw !important;
    height: 100vh !important;
    flex-shrink: 0 !important;
  }
  #exportBtn, #hint { display: none !important; }
`;

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
): Promise<string[]> {
  const slides = await page.$$(selector);
  if (slides.length === 0)
    throw new Error(`No elements found for selector "${selector}"`);

  const files: string[] = [];

  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, "0");

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
  await page.addStyleTag({ content: PRINT_CSS });

  const pdfPath = path.join(outDir, "carousel.pdf");
  await page.pdf({
    path: pdfPath,
    width: `${width}px`,
    height: `${height}px`,
    printBackground: true,
  });

  return pdfPath;
}
