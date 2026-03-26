import fs from "node:fs";
import path from "node:path";
import { assembleHtml, getSlotSchema } from "../templates/assembler.js";
import type { AssembleInput, SlideData } from "../templates/types.js";
import { defaultOutDir } from "../helpers.js";

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

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: true,
          slides: args.slides.length,
          htmlPath,
          instruction: `${args.slides.length} slides assembled. Ask user to approve or request changes. On approval: render_html_to_images htmlPath='${htmlPath}'.`,
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
