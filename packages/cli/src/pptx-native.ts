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

export interface ImageElement {
  data: string;
  mimeType: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SlideData {
  backgroundColor: string;
  width: number;
  height: number;
  elements: SlideElement[];
  images: ImageElement[];
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

      const CSS_NAMED_COLORS: Record<string, string> = {
        black: "000000", white: "FFFFFF", red: "FF0000", green: "008000",
        blue: "0000FF", yellow: "FFFF00", cyan: "00FFFF", magenta: "FF00FF",
        orange: "FFA500", purple: "800080", pink: "FFC0CB", gray: "808080",
        grey: "808080", silver: "C0C0C0", navy: "000080", teal: "008080",
        maroon: "800000", olive: "808000", lime: "00FF00", aqua: "00FFFF",
        coral: "FF7F50", salmon: "FA8072", gold: "FFD700", khaki: "F0E68C",
        ivory: "FFFFF0", beige: "F5F5DC", wheat: "F5DEB3", tan: "D2B48C",
        chocolate: "D2691E", crimson: "DC143C", tomato: "FF6347",
        orangered: "FF4500", indianred: "CD5C5C", darkred: "8B0000",
        darkblue: "00008B", darkgreen: "006400", darkcyan: "008B8B",
        darkviolet: "9400D3", deeppink: "FF1493", dodgerblue: "1E90FF",
        firebrick: "B22222", forestgreen: "228B22", hotpink: "FF69B4",
        indigo: "4B0082", lavender: "E6E6FA", lawngreen: "7CFC00",
        lightblue: "ADD8E6", lightcoral: "F08080", lightgray: "D3D3D3",
        lightgreen: "90EE90", lightyellow: "FFFFE0", linen: "FAF0E6",
        midnightblue: "191970", mintcream: "F5FFFA", mistyrose: "FFE4E1",
        moccasin: "FFE4B5", oldlace: "FDF5E6", orchid: "DA70D6",
        plum: "DDA0DD", royalblue: "4169E1", seagreen: "2E8B57",
        sienna: "A0522D", skyblue: "87CEEB", slateblue: "6A5ACD",
        slategray: "708090", steelblue: "4682B4", thistle: "D8BFD8",
        turquoise: "40E0D0", violet: "EE82EE", yellowgreen: "9ACD32",
        rebeccapurple: "663399", transparent: "",
      };

      function clamp(v: number): number { return Math.max(0, Math.min(255, Math.round(v))); }

      function hslToRgb(h: number, s: number, l: number): [number, number, number] {
        h = ((h % 360) + 360) % 360;
        s = s / 100;
        l = l / 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; }
        else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; }
        else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; }
        else { r = c; b = x; }
        return [clamp((r + m) * 255), clamp((g + m) * 255), clamp((b + m) * 255)];
      }

      function toHex(r: number, g: number, b: number): string {
        return (
          ((1 << 24) | (r << 16) | (g << 8) | b)
            .toString(16)
            .slice(1)
            .toUpperCase()
        );
      }

      function parseColor(raw: string): string {
        if (!raw) return "";
        const s = raw.trim().toLowerCase();

        if (s === "transparent" || s === "rgba(0, 0, 0, 0)") return "";

        if (CSS_NAMED_COLORS[s] !== undefined) return CSS_NAMED_COLORS[s];

        if (s.startsWith("#")) {
          let hex = s.slice(1);
          if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          if (hex.length === 4) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          if (hex.length >= 6) return hex.slice(0, 6).toUpperCase();
        }

        const rgbaM = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (rgbaM) return toHex(parseInt(rgbaM[1]), parseInt(rgbaM[2]), parseInt(rgbaM[3]));

        const hslM = s.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
        if (hslM) {
          const [r, g, b] = hslToRgb(parseFloat(hslM[1]), parseFloat(hslM[2]), parseFloat(hslM[3]));
          return toHex(r, g, b);
        }

        const m = s.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (m) return toHex(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));

        return "";
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
            color: parseColor(style.color),
            backgroundColor: parseColor(style.backgroundColor),
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
              color: parseColor(style.color),
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

      function getImageElements(el: Element, slideRect: DOMRect): Array<{ tagName: string; src: string; x: number; y: number; w: number; h: number }> {
        const results: Array<{ tagName: string; src: string; x: number; y: number; w: number; h: number }> = [];
        const style = window.getComputedStyle(el);

        if (style.display === "none" || style.visibility === "hidden") return results;

        if (el.tagName === "IMG") {
          const rect = el.getBoundingClientRect();
          if (rect.width > 4 && rect.height > 4) {
            results.push({
              tagName: "IMG",
              src: (el as HTMLImageElement).src || "",
              x: rect.left - slideRect.left,
              y: rect.top - slideRect.top,
              w: rect.width,
              h: rect.height,
            });
          }
        }

        if (el.tagName === "SVG") {
          const rect = el.getBoundingClientRect();
          if (rect.width > 4 && rect.height > 4) {
            results.push({
              tagName: "SVG",
              src: "",
              x: rect.left - slideRect.left,
              y: rect.top - slideRect.top,
              w: rect.width,
              h: rect.height,
            });
          }
        }

        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== "none") {
          const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
          if (urlMatch) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 4 && rect.height > 4) {
              results.push({
                tagName: "BG",
                src: urlMatch[1],
                x: rect.left - slideRect.left,
                y: rect.top - slideRect.top,
                w: rect.width,
                h: rect.height,
              });
            }
          }
        }

        for (const child of el.children) {
          results.push(...getImageElements(child, slideRect));
        }
        return results;
      }

      return slides.map((slide) => {
        const rect = slide.getBoundingClientRect();
        const style = window.getComputedStyle(slide);
        const elements = getLeafTextNodes(slide, rect);
        const imgElements = getImageElements(slide, rect);

        return {
          backgroundColor: parseColor(style.backgroundColor),
          width: rect.width,
          height: rect.height,
          elements,
          images: imgElements.map(ie => ({
            data: "",
            mimeType: "image/png",
            x: ie.x,
            y: ie.y,
            w: ie.w,
            h: ie.h,
          })),
          _imageSelectors: imgElements,
        };
      });
    },
    selector,
    slideRange ?? null,
  );
}

export async function captureSlideImages(
  page: Page,
  selector: string,
  slidesData: SlideData[],
  slideRange?: [number, number],
): Promise<void> {
  const allSlides = await page.$$(selector);
  const startIdx = slideRange ? slideRange[0] - 1 : 0;

  for (let si = 0; si < slidesData.length; si++) {
    const slideEl = allSlides[startIdx + si];
    if (!slideEl) continue;
    const sd = slidesData[si];
    const rawData = sd as any;
    const imageSelectors: Array<{ tagName: string; x: number; y: number; w: number; h: number }> = rawData._imageSelectors || [];

    for (let ii = 0; ii < imageSelectors.length; ii++) {
      const imgInfo = imageSelectors[ii];
      if (!sd.images[ii]) continue;

      try {
        const buf = await page.screenshot({
          type: "png",
          encoding: "binary",
          clip: {
            x: imgInfo.x + (await slideEl.boundingBox())!.x,
            y: imgInfo.y + (await slideEl.boundingBox())!.y,
            width: Math.max(imgInfo.w, 1),
            height: Math.max(imgInfo.h, 1),
          },
        });
        sd.images[ii].data = Buffer.from(buf).toString("base64");
      } catch {
        // Non-critical: skip images that can't be captured
      }
    }
  }
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
): Promise<{ path: string; warnings: string[] }> {
  const mod = await import("pptxgenjs");
  const PptxGenJS = (mod as any).default ?? mod;
  const pres = typeof PptxGenJS === "function" ? new PptxGenJS() : PptxGenJS;
  const warnings: string[] = [];

  const { wInch, hInch } = calcLayout(widthPx, heightPx);

  pres.defineLayout({ name: "SLIDESHOT", width: wInch, height: hInch });
  pres.layout = "SLIDESHOT";
  pres.author = "slideshot";
  pres.subject = "Generated by slideshot";

  for (let si = 0; si < slidesData.length; si++) {
    const sd = slidesData[si];
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

    if (sd.images) {
      for (const img of sd.images) {
        if (!img.data) continue;

        try {
          const x = (img.x / sW) * wInch;
          const y = (img.y / sH) * hInch;
          const w = Math.max((img.w / sW) * wInch, 0.2);
          const h = Math.max((img.h / sH) * hInch, 0.2);

          if (x < 0 || y < 0 || x > wInch || y > hInch) continue;

          slide.addImage({
            data: `image/png;base64,${img.data}`,
            x,
            y,
            w: Math.min(w, wInch - x),
            h: Math.min(h, hInch - y),
          });
        } catch (err: any) {
          warnings.push(`Slide ${si + 1}: failed to add image — ${err.message}`);
        }
      }
    }
  }

  const fullPath = path.resolve(outPath);
  await pres.writeFile({ fileName: fullPath });
  return { path: outPath, warnings };
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

const SYSTEM_SAFE_FONTS = new Set([
  "arial", "helvetica", "times new roman", "times", "courier new", "courier",
  "georgia", "verdana", "tahoma", "trebuchet ms", "impact", "comic sans ms",
  "calibri", "cambria", "consolas", "lucida console", "palatino linotype",
  "book antiqua", "century gothic", "garamond", "segoe ui",
]);

function mapFont(cssFont: string): string {
  const lower = cssFont.toLowerCase().trim();

  if (SYSTEM_SAFE_FONTS.has(lower)) return cssFont;

  if (lower.includes("bebas neue") || lower.includes("bebas")) return "Impact";
  if (lower.includes("dm sans")) return "Calibri";
  if (lower.includes("poppins")) return "Arial";
  if (lower.includes("playfair display") || lower.includes("playfair")) return "Georgia";
  if (lower.includes("space mono")) return "Courier New";
  if (lower.includes("space grotesk")) return "Calibri";
  if (lower.includes("inter")) return "Calibri";
  if (lower.includes("roboto mono")) return "Consolas";
  if (lower.includes("roboto")) return "Arial";
  if (lower.includes("open sans")) return "Calibri";
  if (lower.includes("lato")) return "Calibri";
  if (lower.includes("montserrat")) return "Arial";
  if (lower.includes("raleway")) return "Calibri";
  if (lower.includes("nunito")) return "Calibri";
  if (lower.includes("merriweather")) return "Georgia";
  if (lower.includes("lora")) return "Georgia";
  if (lower.includes("source sans")) return "Calibri";
  if (lower.includes("source serif")) return "Georgia";
  if (lower.includes("source code") || lower.includes("fira code") || lower.includes("jetbrains mono")) return "Courier New";
  if (lower.includes("oswald")) return "Impact";

  if (lower.includes("monospace")) return "Courier New";
  if (lower.includes("serif")) return "Georgia";
  if (lower.includes("sans-serif") || lower.includes("sans")) return "Calibri";

  return cssFont || "Calibri";
}

function mapAlign(cssAlign: string): "left" | "center" | "right" {
  if (cssAlign === "center") return "center";
  if (cssAlign === "right") return "right";
  return "left";
}
