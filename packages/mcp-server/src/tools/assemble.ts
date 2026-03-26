import fs from "node:fs";
import path from "node:path";
import { assembleHtml, getSlotSchema } from "../templates/assembler.js";
import type { AssembleInput, SlideData } from "../templates/types.js";
import { defaultOutDir } from "../helpers.js";
import { cacheHtml, isDiscoveryDone } from "../cache.js";

function ensureOutDir(): string {
  const dir = defaultOutDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function handleAssemble(args: {
  theme: string;
  slides: Record<string, unknown>[];
  orientation?: "portrait" | "landscape";
  brandName?: string;
}) {
  if (!isDiscoveryDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "DISCOVERY_REQUIRED",
          instruction: "Call create_slides with step='discover' first to present themes and gather user preferences.",
        }),
      }],
      isError: true,
    };
  }

  try {
    const input: AssembleInput = {
      theme: args.theme,
      slides: args.slides as unknown as SlideData[],
      orientation: args.orientation,
      brandName: args.brandName,
    };

    const html = assembleHtml(input);

    const dir = ensureOutDir();
    const htmlPath = path.join(dir, "slides.html");
    fs.writeFileSync(htmlPath, html, "utf-8");
    cacheHtml(html, htmlPath);

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: true,
          slides: args.slides.length,
          htmlPath,
          html,
          instruction: `${args.slides.length} slides assembled. Ask user to approve or request changes. On approval: call render_html_to_images (no html/htmlPath needed — server has it cached). If htmlPath is inaccessible, pass the html field inline.`,
        }),
      }],
    };
  } catch (err: any) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ ok: false, error: err.message }),
      }],
      isError: true,
    };
  }
}

export async function handleGetSchema(args: { theme: string }) {
  if (!isDiscoveryDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "DISCOVERY_REQUIRED",
          instruction: "Call create_slides with step='discover' first.",
        }),
      }],
      isError: true,
    };
  }

  try {
    const schema = getSlotSchema(args.theme);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(schema),
      }],
    };
  } catch (err: any) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ ok: false, error: err.message }),
      }],
      isError: true,
    };
  }
}
