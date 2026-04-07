import fs from "node:fs";
import path from "node:path";
import { defaultOutDir } from "../helpers.js";
import { cacheHtml, isDiscoveryDone, markCreateDone } from "../cache.js";
import { assembleHtml } from "../templates/assembler.js";
import type { SlideData, AssembleInput } from "../templates/types.js";
import { loadPrompt, type PromptVariant } from "../prompts.js";
import { ORIENTATION_PRESETS } from "../schema.js";

function ensureOutDir(): string {
  const dir = defaultOutDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function saveHtml(html: string): string {
  const dir = ensureOutDir();
  const htmlPath = path.join(dir, "slides.html");
  fs.writeFileSync(htmlPath, html, "utf-8");
  cacheHtml(html, htmlPath);
  markCreateDone();
  return htmlPath;
}

function countSlides(html: string): number {
  // Match class="slide" or class="slide ..." but NOT class="slide-label" etc.
  // Looks for the word "slide" at the START of the class value or preceded by a space.
  const matches = html.match(/class\s*=\s*["'](?:slide(?:\s|["'])|[^"']*\sslide(?:\s|["']))/g);
  return matches ? matches.length : 0;
}

function resolveOrientation(orientation?: string, customWidth?: number, customHeight?: number): { width: number; height: number } {
  if (orientation === "custom" && customWidth && customHeight) {
    return { width: customWidth, height: customHeight };
  }
  return ORIENTATION_PRESETS[orientation || "portrait"] || ORIENTATION_PRESETS.portrait;
}

function discoveryGate() {
  if (!isDiscoveryDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "DISCOVERY_REQUIRED",
          instruction: "You MUST call discover_themes first. Present themes, orientation, token mode, and format options to the user. WAIT for their choices. DO NOT auto-select.",
        }),
      }],
      isError: true,
    };
  }
  return null;
}

const PREVIEW_STOP_INSTRUCTION = `STOP — DO NOT call render_slides yet.
You MUST now:
1. Show the saved HTML file as a code preview artifact using the htmlPath below. The user needs to see a live preview of the slides.
2. Ask the user: "Does this look good? Should I render the final output, or do you want changes?"
3. WAIT for the user's explicit response.
4. ONLY after the user says yes/confirmed/looks good, call render_slides with the htmlPath.
DO NOT call render_slides in this same turn. The user MUST see and approve the preview first.`;

async function handleDefault(args: {
  theme: string;
  html?: string;
  orientation?: string;
  width?: number;
  height?: number;
}) {
  if (!args.html) {
    const promptText = await loadPrompt(args.theme as PromptVariant);
    const dims = resolveOrientation(args.orientation, args.width, args.height);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: true,
          action: "generate_html",
          theme: args.theme,
          dimensions: dims,
          prompt: promptText,
          instruction: `Use the prompt above to generate a full HTML document with .slide elements at ${dims.width}x${dims.height}px. Then call create_slides again with mode=default and html=<your HTML>.`,
        }),
      }],
    };
  }

  const htmlPath = saveHtml(args.html);
  const slideCount = countSlides(args.html);

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        ok: true,
        slideCount,
        htmlPath,
        instruction: `${slideCount} slides saved to ${htmlPath}.\n\n${PREVIEW_STOP_INSTRUCTION}`,
      }),
    }],
  };
}

function handleTokenSaver(args: {
  theme: string;
  slides?: Record<string, unknown>[];
  orientation?: string;
  width?: number;
  height?: number;
  brandName?: string;
}) {
  if (!args.slides || args.slides.length === 0) {
    throw new Error("mode=token_saver requires a non-empty `slides` array with structured slide data.");
  }

  const dims = resolveOrientation(args.orientation, args.width, args.height);
  const isLandscape = dims.width > dims.height;

  const input: AssembleInput = {
    theme: args.theme,
    slides: args.slides as unknown as SlideData[],
    orientation: isLandscape ? "landscape" : "portrait",
    brandName: args.brandName,
  };

  const html = assembleHtml(input);
  const htmlPath = saveHtml(html);
  const slideCount = args.slides.length;

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        ok: true,
        slideCount,
        htmlPath,
        instruction: `${slideCount} slides saved to ${htmlPath}.\n\n${PREVIEW_STOP_INSTRUCTION}`,
      }),
    }],
  };
}

export async function handleCreate(args: {
  mode: string;
  theme: string;
  orientation?: string;
  width?: number;
  height?: number;
  html?: string;
  slides?: Record<string, unknown>[];
  brandName?: string;
}) {
  const gate = discoveryGate();
  if (gate) return gate;

  try {
    if (args.mode === "token_saver") {
      return handleTokenSaver(args);
    }
    return await handleDefault(args);
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
