import path from "node:path";
import fs from "node:fs";
import type { ImageFormat, RenderOptions, RenderResult } from "./types.js";
import { DEFAULTS } from "./types.js";
import { launchBrowser, setupPage } from "./browser.js";
import { loadHtml, screenshotSlides, generatePdf, PRINT_CSS } from "./renderer.js";

export async function renderSlides(options: RenderOptions): Promise<RenderResult> {
  const selector = options.selector ?? DEFAULTS.selector;
  const width = options.width ?? DEFAULTS.width;
  const height = options.height ?? DEFAULTS.height;
  const scale = options.scale ?? DEFAULTS.scale;
  const formats = options.formats ?? DEFAULTS.formats;
  const webpQuality = options.webpQuality ?? DEFAULTS.webpQuality;
  const outDir = path.resolve(options.outDir);

  try {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  } catch (err: any) {
    throw new Error(
      `Cannot create output directory "${outDir}": ${err.message}. ` +
      `The path may not be accessible from the MCP server process. ` +
      `Try using a path under the user's home directory, or omit outDir to use the default.`,
    );
  }

  const browser = await launchBrowser();
  const files: string[] = [];

  try {
    const page = await setupPage(browser, width, height, scale);
    await loadHtml(page, options);

    const rasterFormats = formats.filter((f) => f !== "pdf") as ImageFormat[];
    if (rasterFormats.length > 0) {
      const rasterFiles = await screenshotSlides(
        page, selector, outDir, rasterFormats, webpQuality,
      );
      files.push(...rasterFiles);
    }

    if (formats.includes("pdf")) {
      const pdfFile = await generatePdf(page, options, outDir, width, height);
      files.push(pdfFile);
    }

    const slideCount = (await page.$$(selector)).length || files.length;
    return { files, slideCount };
  } finally {
    await browser.close();
  }
}

export async function renderToBuffers(options: Omit<RenderOptions, "outDir"> & { outDir?: string }): Promise<{
  images: Array<{ name: string; buffer: Buffer; type: ImageFormat }>;
  pdf?: Buffer;
  slideCount: number;
}> {
  const selector = options.selector ?? DEFAULTS.selector;
  const width = options.width ?? DEFAULTS.width;
  const height = options.height ?? DEFAULTS.height;
  const scale = options.scale ?? DEFAULTS.scale;
  const formats = options.formats ?? DEFAULTS.formats;
  const webpQuality = options.webpQuality ?? DEFAULTS.webpQuality;

  const browser = await launchBrowser();
  const images: Array<{ name: string; buffer: Buffer; type: ImageFormat }> = [];
  let pdf: Buffer | undefined;

  try {
    const page = await setupPage(browser, width, height, scale);
    const loadOpts: RenderOptions = { ...options, outDir: "" };
    await loadHtml(page, loadOpts);

    const slides = await page.$$(selector);
    if (slides.length === 0)
      throw new Error(`No elements found for selector "${selector}"`);

    for (let i = 0; i < slides.length; i++) {
      const num = String(i + 1).padStart(2, "0");

      if (formats.includes("png")) {
        const buf = await slides[i].screenshot({ type: "png", encoding: "binary" });
        images.push({ name: `slide-${num}.png`, buffer: Buffer.from(buf), type: "png" });
      }

      if (formats.includes("webp")) {
        const buf = await slides[i].screenshot({ type: "webp", quality: webpQuality, encoding: "binary" });
        images.push({ name: `slide-${num}.webp`, buffer: Buffer.from(buf), type: "webp" });
      }
    }

    if (formats.includes("pdf")) {
      await loadHtml(page, loadOpts);
      await page.addStyleTag({ content: PRINT_CSS });
      const pdfBuf = await page.pdf({
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
      });
      pdf = Buffer.from(pdfBuf);
    }

    return { images, pdf, slideCount: slides.length };
  } finally {
    await browser.close();
  }
}
