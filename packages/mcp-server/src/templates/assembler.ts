import { getThemeCSS } from "./css.js";
import { renderSlide, getSupportedSlideTypes } from "./renderers.js";
import type { AssembleInput, SlideData } from "./types.js";

function normalizeSlide(raw: Record<string, unknown>): SlideData {
  const s = { ...raw } as Record<string, unknown>;
  const type = s.type as string;

  if ((type === "cover" || type === "cta") && !s.headline && s.title) {
    s.headline = s.title;
  }
  if ((type === "content" || type === "list" || type === "steps" || type === "code" || type === "timeline" || type === "team") && !s.title && s.headline) {
    s.title = s.headline;
  }

  return s as unknown as SlideData;
}

export interface SlotSchema {
  theme: string;
  supportedSlideTypes: string[];
  slideTypeSchemas: Record<string, Record<string, string>>;
}

const SLIDE_TYPE_FIELDS: Record<string, Record<string, string>> = {
  cover: { headline: "string", subtitle: "string?", badges: "string[]?", facts: "string[]?" },
  content: { title: "string", paragraphs: "string[]", label: "string?" },
  stats: { title: "string?", label: "string?", cards: "{value,label,sub?,trend?}[]", tags: "string[]?" },
  list: { title: "string", label: "string?", items: "{title,description?,tag?}[]" },
  steps: { title: "string", label: "string?", items: "{num,title,description}[]" },
  comparison: { title: "string?", leftLabel: "string", rightLabel: "string", left: "{label,description?}[]", right: "{label,description?}[]" },
  quote: { quote: "string", attribution: "string?", label: "string?" },
  code: { title: "string", code: "string", language: "string?" },
  cta: { headline: "string", description: "string?", action: "string?", email: "string?", note: "string?" },
  timeline: { title: "string", items: "{year,description}[]" },
  team: { title: "string", members: "{name,role,emoji?}[]" },
};

export function getSlotSchema(theme: string): SlotSchema {
  const supported = getSupportedSlideTypes(theme);
  const schemas: Record<string, Record<string, string>> = {};
  for (const st of supported) {
    schemas[st] = SLIDE_TYPE_FIELDS[st] ?? {};
  }
  return { theme, supportedSlideTypes: supported, slideTypeSchemas: schemas };
}

export function assembleHtml(input: AssembleInput): string {
  const themeCSS = getThemeCSS(input.theme);
  if (!themeCSS) {
    throw new Error(`Unknown theme "${input.theme}". Available: generic, branded, instagram-carousel, infographic, pitch-deck, dark-modern, editorial, browser-shell, academic-poster, clinical-medical, sketch-handdrawn`);
  }

  // Resolve dimensions: explicit width/height > orientation preset > theme default
  const { width, height } = resolveAssembleDimensions(input, themeCSS.dimensions);
  const isLandscape = width > height;

  // Inject CSS custom properties so theme CSS rules `width:var(--slide-w,540px)` resolve correctly.
  // Add `.orient-landscape` body class when geometry is wider than tall, so theme's `.slide.landscape`
  // reflow rules apply (paired with `.slide.landscape` on each slide).
  const dimsCSS = `:root{--slide-w:${width}px;--slide-h:${height}px;}`;
  const bodyClass = isLandscape ? ' class="orient-landscape"' : "";
  const slideExtraClass = isLandscape ? " landscape" : "";

  const normalized = input.slides.map(s => normalizeSlide(s as unknown as Record<string, unknown>));
  const slidesHtml = normalized
    .map((slide: SlideData, i: number) => {
      const html = renderSlide(input.theme, slide, i, normalized.length);
      // Inject `landscape` modifier class onto every .slide. Renderers emit `class="slide ..."`;
      // we tack it on after `slide` so theme-specific modifiers (e.g. `slide dark`) keep working.
      return slideExtraClass ? html.replace(/class="slide([^"]*)"/g, `class="slide${slideExtraClass}$1"`) : html;
    })
    .join("\n  ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${themeCSS.font}
  <style>
    ${dimsCSS}
    ${themeCSS.css}
  </style>
</head>
<body${bodyClass}>
  ${slidesHtml}
</body>
</html>`;
}

function resolveAssembleDimensions(
  input: AssembleInput,
  defaultDims: { width: number; height: number },
): { width: number; height: number } {
  // Explicit width+height takes priority (custom orientation case).
  if (typeof input.width === "number" && typeof input.height === "number") {
    return { width: input.width, height: input.height };
  }

  // Otherwise map orientation key to preset dimensions.
  // Keep ORIENTATION_DIMS source of truth in sync with packages/cli/src/types.ts.
  const ORIENTATION_DIMS: Record<string, { width: number; height: number }> = {
    portrait: { width: 540, height: 675 },
    landscape: { width: 1920, height: 1080 },
    linkedin: { width: 540, height: 675 },
    instagram: { width: 1080, height: 1080 },
    a4: { width: 595, height: 842 },
  };

  if (input.orientation && ORIENTATION_DIMS[input.orientation]) {
    return ORIENTATION_DIMS[input.orientation];
  }

  return defaultDims;
}
