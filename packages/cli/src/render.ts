import path from "node:path";
import fs from "node:fs";
import type { ImageFormat, RenderOptions, RenderResult } from "./types.js";
import { DEFAULTS, ORIENTATION_PRESETS } from "./types.js";
import { launchBrowser, setupPage } from "./browser.js";
import { loadHtml, screenshotSlides, generatePdf, PRINT_CSS } from "./renderer.js";
import { generatePptx } from "./pptx.js";

function resolveOrientation(options: RenderOptions) {
  let width = options.width;
  let height = options.height;
  if (options.orientation && !options.width && !options.height) {
    const preset = ORIENTATION_PRESETS[options.orientation];
    width = preset.width;
    height = preset.height;
  }
  return { width: width ?? DEFAULTS.width, height: height ?? DEFAULTS.height };
}

export async function renderSlides(options: RenderOptions): Promise<RenderResult> {
  const selector = options.selector ?? DEFAULTS.selector;
  const { width, height } = resolveOrientation(options);
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

    const rasterFormats = formats.filter((f) => f !== "pdf" && f !== "pptx") as ImageFormat[];
    if (rasterFormats.length > 0) {
      const rasterFiles = await screenshotSlides(
        page, selector, outDir, rasterFormats, webpQuality, options.slideRange,
      );
      files.push(...rasterFiles);
    }

    if (formats.includes("pdf")) {
      const pdfFile = await generatePdf(page, options, outDir, width, height);
      files.push(pdfFile);
    }

    if (formats.includes("pptx")) {
      await loadHtml(page, options);
      const allSlides = await page.$$(selector);
      const start = options.slideRange ? options.slideRange[0] - 1 : 0;
      const end = options.slideRange ? Math.min(options.slideRange[1], allSlides.length) : allSlides.length;
      const slides = allSlides.slice(start, end);

      const pptxImages: Array<{ buffer: Buffer; mimeType: string }> = [];
      for (const slide of slides) {
        const buf = await slide.screenshot({ type: "png", encoding: "binary" });
        pptxImages.push({ buffer: Buffer.from(buf), mimeType: "image/png" });
      }

      const pptxPath = path.join(outDir, options.pptxFilename || "carousel.pptx");
      await generatePptx(pptxImages, width * scale, height * scale, pptxPath);
      files.push(pptxPath);
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
  pptx?: Buffer;
  slideCount: number;
}> {
  const selector = options.selector ?? DEFAULTS.selector;
  const resolved = resolveOrientation(options as RenderOptions);
  const width = resolved.width;
  const height = resolved.height;
  const scale = options.scale ?? DEFAULTS.scale;
  const formats = options.formats ?? DEFAULTS.formats;
  const webpQuality = options.webpQuality ?? DEFAULTS.webpQuality;

  const browser = await launchBrowser();
  const images: Array<{ name: string; buffer: Buffer; type: ImageFormat }> = [];
  let pdf: Buffer | undefined;
  let pptx: Buffer | undefined;

  try {
    const page = await setupPage(browser, width, height, scale);
    const loadOpts: RenderOptions = { ...options, outDir: "" } as RenderOptions;
    await loadHtml(page, loadOpts);

    const allSlides = await page.$$(selector);
    if (allSlides.length === 0)
      throw new Error(`No elements found for selector "${selector}"`);

    const rangeStart = options.slideRange ? options.slideRange[0] - 1 : 0;
    const rangeEnd = options.slideRange ? Math.min(options.slideRange[1], allSlides.length) : allSlides.length;
    const slides = allSlides.slice(rangeStart, rangeEnd);

    for (let i = 0; i < slides.length; i++) {
      const num = String(rangeStart + i + 1).padStart(2, "0");

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

    if (formats.includes("pptx")) {
      await loadHtml(page, loadOpts);
      const pptxSlides = await page.$$(selector);
      const pStart = options.slideRange ? options.slideRange[0] - 1 : 0;
      const pEnd = options.slideRange ? Math.min(options.slideRange[1], pptxSlides.length) : pptxSlides.length;
      const pSlice = pptxSlides.slice(pStart, pEnd);

      const pptxImages: Array<{ buffer: Buffer; mimeType: string }> = [];
      for (const s of pSlice) {
        const buf = await s.screenshot({ type: "png", encoding: "binary" });
        pptxImages.push({ buffer: Buffer.from(buf), mimeType: "image/png" });
      }

      const mod = await import("pptxgenjs");
      const PptxGenJS = (mod as any).default ?? mod;
      const pres = typeof PptxGenJS === "function" ? new PptxGenJS() : PptxGenJS;
      const isLandscape = width >= height;
      const maxInch = 10;
      const wInch = isLandscape ? maxInch : maxInch * width / height;
      const hInch = isLandscape ? maxInch * height / width : maxInch;
      pres.defineLayout({ name: "SLIDESHOT", width: wInch, height: hInch });
      pres.layout = "SLIDESHOT";

      for (const img of pptxImages) {
        const slide = pres.addSlide();
        slide.addImage({
          data: `image/png;base64,${img.buffer.toString("base64")}`,
          x: 0, y: 0, w: "100%", h: "100%",
        });
      }
      pptx = Buffer.from(await pres.write({ outputType: "nodebuffer" }) as ArrayBuffer);
    }

    return { images, pdf, pptx, slideCount: slides.length };
  } finally {
    await browser.close();
  }
}
