import { isDiscoveryDone } from "../cache.js";
import { saveHtml } from "../save.js";
import { assembleHtml } from "../templates/assembler.js";
import type { SlideData, AssembleInput } from "../templates/types.js";
import { loadPrompt, type PromptVariant } from "../prompts.js";
import { ORIENTATION_PRESETS } from "../schema.js";
import { savePrefs } from "../preferences.js";

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

const PREVIEW_STOP_INSTRUCTION = `STOP. Show htmlPath as a code preview artifact to the user. Ask: "Does this look good? Should I render the final PDF?" WAIT for user response. Do NOT call render_slides in this turn.`;

async function handleDefault(args: {
  theme: string;
  html?: string;
  orientation?: string;
  width?: number;
  height?: number;
}) {
  if (!args.html) {
    const dims = resolveOrientation(args.orientation, args.width, args.height);
    const promptText = await loadPrompt(args.theme as PromptVariant, dims);
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

  const input: AssembleInput = {
    theme: args.theme,
    slides: args.slides as unknown as SlideData[],
    orientation: args.orientation,
    width: dims.width,
    height: dims.height,
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
    const result = args.mode === "token_saver"
      ? handleTokenSaver(args)
      : await handleDefault(args);

    // Persist user choices for next session (postmortem roadmap #5).
    // Only save when we actually produced HTML — skip the "generate_html"
    // intermediate response that has no slides yet.
    try {
      const parsed = JSON.parse(result.content[0].text);
      if (parsed?.htmlPath) {
        savePrefs({
          lastTheme: args.theme,
          lastOrientation: args.orientation || "portrait",
          lastTokenMode: args.mode === "token_saver" ? "token_saver" : "default",
          ...(args.brandName ? { brandName: args.brandName } : {}),
        });
      }
    } catch {
      // pref-write failures must never break the create flow
    }

    return result;
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
