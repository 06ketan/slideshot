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
    throw new Error(`Unknown theme "${input.theme}". Available: generic, branded, instagram-carousel, infographic, pitch-deck, dark-modern, editorial, browser-shell`);
  }

  const { width, height } = input.orientation === "landscape"
    ? { width: 1920, height: 1080 }
    : themeCSS.dimensions;

  const landscapeCSS = input.orientation === "landscape"
    ? `.slide{width:${width}px !important;height:${height}px !important;}`
    : "";

  const normalized = input.slides.map(s => normalizeSlide(s as unknown as Record<string, unknown>));
  const slidesHtml = normalized
    .map((slide: SlideData, i: number) => renderSlide(input.theme, slide, i, normalized.length))
    .join("\n  ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${themeCSS.font}
  <style>
    ${themeCSS.css}
    ${landscapeCSS}
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;
}
