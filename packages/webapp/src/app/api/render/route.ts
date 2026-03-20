import path from "path";
import fs from "fs";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import JSZip from "jszip";

export const maxDuration = 60;

const MAX_HTML_BYTES = 512 * 1024; // 512 KB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 2400;
const MAX_SCALE = 6;
const MAX_SLIDES = 20;
const VALID_FORMATS = new Set(["png", "webp", "pdf"]);

function getAllowedOrigin(req: Request): string {
  const allowed = process.env.ALLOWED_ORIGINS;
  if (!allowed) return "*";
  const origin = req.headers.get("origin") ?? "";
  const list = allowed.split(",").map((o) => o.trim());
  return list.includes(origin) ? origin : list[0];
}

function corsHeaders(req: Request) {
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(req),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  };
}

interface RenderBody {
  html: string;
  selector?: string;
  width?: number;
  height?: number;
  scale?: number;
  formats?: string[];
  webpQuality?: number;
}

function jsonResponse(data: object, status: number, req: Request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(req) },
  });
}

async function getBrowser() {
  if (process.env.NODE_ENV === "development") {
    const puppeteerFull = await import("puppeteer");
    return puppeteerFull.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  let executablePath: string;
  const binPath = path.join(
    process.cwd(),
    "node_modules/@sparticuz/chromium/bin",
  );
  if (fs.existsSync(binPath)) {
    executablePath = await chromium.executablePath(binPath);
  } else {
    executablePath = await chromium.executablePath();
  }

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: null,
    executablePath,
    headless: true,
  });
}

export async function POST(req: Request) {
  let browser;
  try {
    const body: RenderBody = await req.json();
    const {
      html,
      selector = ".slide",
      formats = ["png", "webp", "pdf"],
      webpQuality = 95,
    } = body;

    if (!html?.trim()) {
      return jsonResponse({ error: "HTML is required" }, 400, req);
    }

    if (new TextEncoder().encode(html).length > MAX_HTML_BYTES) {
      return jsonResponse({ error: "HTML payload exceeds 512 KB limit" }, 400, req);
    }

    const width = Math.min(Math.max(body.width ?? 540, 1), MAX_WIDTH);
    const height = Math.min(Math.max(body.height ?? 675, 1), MAX_HEIGHT);
    const scale = Math.min(Math.max(body.scale ?? 4, 1), MAX_SCALE);
    const safeFormats = formats.filter((f) => VALID_FORMATS.has(f));
    if (safeFormats.length === 0) {
      return jsonResponse({ error: "No valid formats specified" }, 400, req);
    }

    browser = await getBrowser();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(15000);
    await page.setViewport({
      width: width + 96,
      height: height + 96,
      deviceScaleFactor: scale,
    });
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.evaluateHandle("document.fonts.ready");

    const slides = await page.$$(selector);
    if (slides.length === 0) {
      await browser.close();
      return jsonResponse(
        { error: `No elements found for selector "${selector}"` },
        400,
        req,
      );
    }

    if (slides.length > MAX_SLIDES) {
      await browser.close();
      return jsonResponse(
        { error: `Too many slides (${slides.length}). Maximum is ${MAX_SLIDES}.` },
        400,
        req,
      );
    }

    const zip = new JSZip();

    for (let i = 0; i < slides.length; i++) {
      const num = String(i + 1).padStart(2, "0");

      if (safeFormats.includes("png")) {
        const buf = await slides[i].screenshot({
          type: "png",
          encoding: "binary",
        });
        zip.file(`slide-${num}.png`, buf);
      }

      if (safeFormats.includes("webp")) {
        const buf = await slides[i].screenshot({
          type: "webp",
          quality: webpQuality,
          encoding: "binary",
        });
        zip.file(`slide-${num}.webp`, buf);
      }
    }

    if (safeFormats.includes("pdf")) {
      await page.setContent(html, { waitUntil: "domcontentloaded" });
      await page.evaluateHandle("document.fonts.ready");
      await page.addStyleTag({
        content: `
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
        `,
      });
      const pdfBuf = await page.pdf({
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
      });
      zip.file("carousel.pdf", pdfBuf);
    }

    await browser.close();

    const zipArrayBuffer = await zip.generateAsync({ type: "arraybuffer" });

    return new Response(zipArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="slides.zip"',
        ...corsHeaders(req),
      },
    });
  } catch (err: unknown) {
    if (browser) await browser.close();
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ error: message }, 500, req);
  }
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}
