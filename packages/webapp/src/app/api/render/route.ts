import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import JSZip from "jszip";

export const maxDuration = 60;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface RenderBody {
  html: string;
  selector?: string;
  width?: number;
  height?: number;
  scale?: number;
  formats?: string[];
  webpQuality?: number;
}

function jsonResponse(data: object, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
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

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: null,
    executablePath: await chromium.executablePath(),
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
      width = 540,
      height = 675,
      scale = 4,
      formats = ["png", "webp", "pdf"],
      webpQuality = 95,
    } = body;

    if (!html?.trim()) {
      return jsonResponse({ error: "HTML is required" }, 400);
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
      );
    }

    const zip = new JSZip();

    for (let i = 0; i < slides.length; i++) {
      const num = String(i + 1).padStart(2, "0");

      if (formats.includes("png")) {
        const buf = await slides[i].screenshot({
          type: "png",
          encoding: "binary",
        });
        zip.file(`slide-${num}.png`, buf);
      }

      if (formats.includes("webp")) {
        const buf = await slides[i].screenshot({
          type: "webp",
          quality: webpQuality,
          encoding: "binary",
        });
        zip.file(`slide-${num}.webp`, buf);
      }
    }

    if (formats.includes("pdf")) {
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
        ...corsHeaders,
      },
    });
  } catch (err: unknown) {
    if (browser) await browser.close();
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
