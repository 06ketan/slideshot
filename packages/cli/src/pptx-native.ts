import path from "node:path";
import type { Page } from "puppeteer";

export interface SlideElement {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  textAlign: string;
  isItalic: boolean;
  lineHeight: number;
}

export interface SlideData {
  backgroundColor: string;
  width: number;
  height: number;
  elements: SlideElement[];
}

export async function extractSlideData(
  page: Page,
  selector: string,
  slideRange?: [number, number],
): Promise<SlideData[]> {
  return page.evaluate(
    (sel: string, range: [number, number] | null) => {
      const allSlides = Array.from(document.querySelectorAll(sel));
      const startIdx = range ? range[0] - 1 : 0;
      const endIdx = range ? Math.min(range[1], allSlides.length) : allSlides.length;
      const slides = allSlides.slice(startIdx, endIdx);

      function rgbToHex(rgb: string): string {
        if (rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return "";
        const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return "";
        return (
          ((1 << 24) | (parseInt(m[1]) << 16) | (parseInt(m[2]) << 8) | parseInt(m[3]))
            .toString(16)
            .slice(1)
            .toUpperCase()
        );
      }

      function getLeafTextNodes(el: Element, slideRect: DOMRect): SlideElement[] {
        const results: SlideElement[] = [];
        const style = window.getComputedStyle(el);

        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
          return results;
        }

        const hasDirectText = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent?.trim() || "").length > 0,
        );

        if (hasDirectText && el.children.length === 0) {
          const rect = el.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) return results;
          const text = (el.textContent || "").trim();
          if (!text) return results;

          results.push({
            text,
            x: rect.left - slideRect.left,
            y: rect.top - slideRect.top,
            w: rect.width,
            h: rect.height,
            fontSize: parseFloat(style.fontSize),
            fontFamily: style.fontFamily.split(",")[0].replace(/['"]/g, "").trim(),
            fontWeight: style.fontWeight,
            color: rgbToHex(style.color),
            backgroundColor: rgbToHex(style.backgroundColor),
            textAlign: style.textAlign as string,
            isItalic: style.fontStyle === "italic",
            lineHeight: parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4,
          });
          return results;
        }

        if (hasDirectText && el.children.length > 0) {
          const rect = el.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) return results;

          let directText = "";
          for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              directText += (node.textContent || "").trim() + " ";
            }
          }
          directText = directText.trim();
          if (directText) {
            results.push({
              text: directText,
              x: rect.left - slideRect.left,
              y: rect.top - slideRect.top,
              w: rect.width,
              h: Math.min(rect.height, parseFloat(style.fontSize) * 1.8),
              fontSize: parseFloat(style.fontSize),
              fontFamily: style.fontFamily.split(",")[0].replace(/['"]/g, "").trim(),
              fontWeight: style.fontWeight,
              color: rgbToHex(style.color),
              backgroundColor: "",
              textAlign: style.textAlign as string,
              isItalic: style.fontStyle === "italic",
              lineHeight: parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4,
            });
          }
        }

        for (const child of el.children) {
          results.push(...getLeafTextNodes(child, slideRect));
        }
        return results;
      }

      return slides.map((slide) => {
        const rect = slide.getBoundingClientRect();
        const style = window.getComputedStyle(slide);
        const elements = getLeafTextNodes(slide, rect);

        return {
          backgroundColor: rgbToHex(style.backgroundColor),
          width: rect.width,
          height: rect.height,
          elements,
        };
      });
    },
    selector,
    slideRange ?? null,
  );
}

function calcLayout(widthPx: number, heightPx: number) {
  const isLandscape = widthPx >= heightPx;
  const maxInch = 10;
  const wInch = isLandscape ? maxInch : (maxInch * widthPx) / heightPx;
  const hInch = isLandscape ? (maxInch * heightPx) / widthPx : maxInch;
  return { wInch, hInch };
}

export async function generateNativePptx(
  slidesData: SlideData[],
  widthPx: number,
  heightPx: number,
  outPath: string,
): Promise<string> {
  const mod = await import("pptxgenjs");
  const PptxGenJS = (mod as any).default ?? mod;
  const pres = typeof PptxGenJS === "function" ? new PptxGenJS() : PptxGenJS;

  const { wInch, hInch } = calcLayout(widthPx, heightPx);

  pres.defineLayout({ name: "SLIDESHOT", width: wInch, height: hInch });
  pres.layout = "SLIDESHOT";
  pres.author = "slideshot";
  pres.subject = "Generated by slideshot";

  for (const sd of slidesData) {
    const slide = pres.addSlide();

    if (sd.backgroundColor) {
      slide.background = { fill: sd.backgroundColor };
    }

    const sW = sd.width || widthPx;
    const sH = sd.height || heightPx;

    const deduped = deduplicateElements(sd.elements);

    for (const el of deduped) {
      if (!el.text.trim()) continue;

      const x = (el.x / sW) * wInch;
      const y = (el.y / sH) * hInch;
      const w = Math.max((el.w / sW) * wInch, 0.5);
      const h = Math.max((el.h / sH) * hInch, 0.2);

      if (x < 0 || y < 0 || x > wInch || y > hInch) continue;

      const fontPt = Math.max(Math.round((el.fontSize / sH) * hInch * 72), 6);
      const isBold = parseInt(el.fontWeight) >= 700 || el.fontWeight === "bold";

      const textOpts: Record<string, any> = {
        x,
        y,
        w: Math.min(w, wInch - x),
        h: Math.min(h, hInch - y),
        fontSize: fontPt,
        fontFace: mapFont(el.fontFamily),
        color: el.color || "000000",
        bold: isBold,
        italic: el.isItalic,
        align: mapAlign(el.textAlign),
        valign: "top",
        wrap: true,
        margin: 0,
      };

      if (el.backgroundColor) {
        textOpts.fill = { color: el.backgroundColor };
      }

      slide.addText(el.text, textOpts);
    }
  }

  const fullPath = path.resolve(outPath);
  await pres.writeFile({ fileName: fullPath });
  return outPath;
}

function deduplicateElements(elements: SlideElement[]): SlideElement[] {
  const seen = new Map<string, SlideElement>();
  for (const el of elements) {
    const key = `${Math.round(el.x)}_${Math.round(el.y)}_${el.text.slice(0, 40)}`;
    if (!seen.has(key)) {
      seen.set(key, el);
    }
  }
  return Array.from(seen.values());
}

function mapFont(cssFont: string): string {
  const lower = cssFont.toLowerCase();
  if (lower.includes("space mono")) return "Courier New";
  if (lower.includes("playfair")) return "Georgia";
  if (lower.includes("source sans")) return "Calibri";
  if (lower.includes("source code")) return "Courier New";
  if (lower.includes("poppins")) return "Arial";
  if (lower.includes("dm sans")) return "Calibri";
  if (lower.includes("inter")) return "Calibri";
  if (lower.includes("monospace")) return "Courier New";
  if (lower.includes("serif")) return "Georgia";
  if (lower.includes("sans-serif")) return "Calibri";
  return cssFont || "Calibri";
}

function mapAlign(cssAlign: string): "left" | "center" | "right" {
  if (cssAlign === "center") return "center";
  if (cssAlign === "right") return "right";
  return "left";
}
