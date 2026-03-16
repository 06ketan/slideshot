import puppeteer, { type Browser, type Page } from "puppeteer";
import path from "node:path";
import fs from "node:fs";

export type ImageFormat = "png" | "webp" | "pdf";

export interface RenderOptions {
  html?: string;
  htmlPath?: string;
  selector?: string;
  width?: number;
  height?: number;
  scale?: number;
  formats?: ImageFormat[];
  webpQuality?: number;
  outDir: string;
}

export interface RenderResult {
  files: string[];
  slideCount: number;
}

const DEFAULTS = {
  selector: ".slide",
  width: 540,
  height: 675,
  scale: 4,
  formats: ["png", "webp", "pdf"] as ImageFormat[],
  webpQuality: 95,
};

const LAUNCH_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--disable-software-rasterizer",
  "--single-process",
  "--no-zygote",
];

export async function launchBrowser(): Promise<Browser> {
  try {
    return await puppeteer.launch({
      headless: true,
      args: LAUNCH_ARGS,
      timeout: 30000,
    });
  } catch (err: any) {
    throw new Error(
      `browser_launch_failed: ${err.message}. ` +
      `Ensure Chromium is available. On containers, verify /dev/shm size or set --disable-dev-shm-usage.`,
    );
  }
}

async function setupPage(
  browser: Browser,
  width: number,
  height: number,
  scale: number,
): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewport({
    width: width + 96,
    height: height + 96,
    deviceScaleFactor: scale,
  });
  return page;
}

async function loadHtml(page: Page, opts: RenderOptions): Promise<void> {
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

const PRINT_CSS = `
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

async function screenshotSlides(
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

async function generatePdf(
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

export async function renderSlides(options: RenderOptions): Promise<RenderResult> {
  const selector = options.selector ?? DEFAULTS.selector;
  const width = options.width ?? DEFAULTS.width;
  const height = options.height ?? DEFAULTS.height;
  const scale = options.scale ?? DEFAULTS.scale;
  const formats = options.formats ?? DEFAULTS.formats;
  const webpQuality = options.webpQuality ?? DEFAULTS.webpQuality;
  const outDir = path.resolve(options.outDir);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

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
