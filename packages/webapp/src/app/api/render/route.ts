import puppeteer from "puppeteer";
import JSZip from "jszip";

export const maxDuration = 60;

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
    headers: { "Content-Type": "application/json" },
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

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({
      width: width + 96,
      height: height + 96,
      deviceScaleFactor: scale,
    });
    await page.setContent(html, { waitUntil: "networkidle0" });
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
      await page.setContent(html, { waitUntil: "networkidle0" });
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
      },
    });
  } catch (err: unknown) {
    if (browser) await browser.close();
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
}
