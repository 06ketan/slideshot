import fs from "node:fs";
import path from "node:path";
import { PROMPT_VARIANTS, type PromptVariant } from "../prompts.js";
import { defaultOutDir } from "../helpers.js";

interface ThemeEntry {
  id: PromptVariant;
  name: string;
  emoji: string;
  style: string;
  palette: string[];
}

const THEME_CATALOG: ThemeEntry[] = [
  { id: "generic", name: "Clean Minimal", emoji: "\ud83d\udccb", style: "Inter, white cards, flexible", palette: ["#FFF", "#1a1a1a", "#888"] },
  { id: "branded", name: "Ketan Slides", emoji: "\ud83c\udfaf", style: "Space Mono, teal/coral accents", palette: ["#F0EDE7", "#00B894", "#E84C1E", "#1A1A1A"] },
  { id: "instagram-carousel", name: "Instagram Carousel", emoji: "\ud83d\udcf8", style: "Poppins, bold gradients, vibrant", palette: ["#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"] },
  { id: "infographic", name: "Infographic", emoji: "\ud83d\udcca", style: "DM Sans, data-heavy, stat cards", palette: ["#2563EB", "#10B981", "#F59E0B", "#F8FAFC"] },
  { id: "pitch-deck", name: "Pitch Deck", emoji: "\ud83d\ude80", style: "DM Sans, KPI cards, timelines", palette: ["#0F172A", "#3B82F6", "#8B5CF6", "#FFF"] },
  { id: "dark-modern", name: "Dark Modern", emoji: "\ud83c\udf19", style: "Inter, neon accents, glassmorphism", palette: ["#0A0A0F", "#22D3EE", "#E879F9", "#34D399"] },
  { id: "editorial", name: "Editorial", emoji: "\ud83d\udcf0", style: "Playfair Display, gold accents, serif", palette: ["#FAF8F5", "#C9963B", "#2C2824", "#1A1814"] },
  { id: "browser-shell", name: "Browser Shell", emoji: "\ud83d\udda5\ufe0f", style: "Bebas Neue + DM Sans, yellow/navy chrome", palette: ["#FFD233", "#12122A", "#0A0A0A", "#FFF"] },
];

function ensureOutDir(): string {
  const dir = defaultOutDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function saveHtml(html: string): string {
  const dir = ensureOutDir();
  const htmlPath = path.join(dir, "slides.html");
  fs.writeFileSync(htmlPath, html, "utf-8");
  return htmlPath;
}

function countSlides(html: string): number {
  const matches = html.match(/class\s*=\s*["'][^"']*\bslide\b/g);
  return matches ? matches.length : 0;
}

const OUTPUT_PRESETS: Record<string, { formats: string[]; orientation: string; description: string }> = {
  instagram: { formats: ["webp"], orientation: "portrait", description: "Instagram post/carousel (1080x1350)" },
  linkedin: { formats: ["pdf", "webp"], orientation: "portrait", description: "LinkedIn carousel (2160x2700 @4x)" },
  presentation: { formats: ["pptx"], orientation: "landscape", description: "PowerPoint deck (1920x1080)" },
  custom: { formats: ["pdf"], orientation: "portrait", description: "Custom — pick your own formats" },
};

function discoverStep() {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: THEME_CATALOG,
        outputPresets: OUTPUT_PRESETS,
        availableFormats: ["png", "webp", "pdf", "pptx"],
        requiredQuestions: [
          { id: "theme", ask: "Which theme? Present the numbered list above and let the user pick." },
          { id: "topic", ask: "What content/topic for the slides?" },
          { id: "aspectRatio", ask: "Portrait (PDF, social media) or Landscape (PPTX, presentations)?" },
          { id: "formats", ask: "Output formats: png, webp, pdf, pptx? (or pick a preset above)" },
          { id: "pptxMode", ask: "If PPTX selected: editable text (native) or pixel-perfect screenshot (image)?" },
        ],
        instruction: "STOP. You MUST present the theme list as a numbered menu and ask ALL requiredQuestions above in ONE message. DO NOT call get_slide_prompt or generate any HTML until the user has answered. Wait for the user's response before proceeding.",
      }),
    }],
  };
}

function previewStep(html?: string, htmlPath?: string) {
  let resolvedHtml: string;
  let resolvedPath: string;

  if (html) {
    resolvedPath = saveHtml(html);
    resolvedHtml = html;
  } else if (htmlPath && fs.existsSync(htmlPath)) {
    resolvedHtml = fs.readFileSync(htmlPath, "utf-8");
    resolvedPath = htmlPath;
  } else {
    throw new Error("Provide html (string) or htmlPath (path to saved file).");
  }

  const slideCount = countSlides(resolvedHtml);

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        slideCount,
        htmlPath: resolvedPath,
        previewSlide: 1,
        confirmationRequired: true,
        blockedNextStep: "review or render_html_to_images",
        instruction: `Show the HTML as a code block. Ask: "Here's slide 1 of ${slideCount} — approve or request changes?" You MUST wait for explicit user approval before proceeding. DO NOT auto-advance.`,
        onApproval: `Call create_slides with step='review' and htmlPath='${resolvedPath}'. Do NOT re-send the HTML string.`,
        onChangesRequested: "Edit the HTML, then call create_slides with step='preview' and the updated html string.",
      }),
    }],
  };
}

function reviewStep(html?: string, htmlPath?: string) {
  let resolvedHtml: string;
  let resolvedPath: string;

  if (htmlPath && fs.existsSync(htmlPath)) {
    resolvedHtml = fs.readFileSync(htmlPath, "utf-8");
    resolvedPath = htmlPath;
  } else if (html) {
    resolvedPath = saveHtml(html);
    resolvedHtml = html;
  } else {
    throw new Error("Provide htmlPath (preferred) or html string.");
  }

  const slideCount = countSlides(resolvedHtml);

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        slideCount,
        htmlPath: resolvedPath,
        confirmationRequired: true,
        blockedNextStep: "render_html_to_images",
        instruction: `Show the HTML as a code block for review of all ${slideCount} slides. Ask: "All ${slideCount} slides look good? Render to final files?" You MUST wait for explicit user approval before calling render_html_to_images. DO NOT auto-advance.`,
        onApproval: `Call render_html_to_images with htmlPath='${resolvedPath}' and user-chosen formats/orientation. Do NOT pass the html string — use htmlPath only.`,
        onChangesRequested: `Edit the HTML, then call create_slides with step='preview' and the updated html string to re-save.`,
      }),
    }],
  };
}

export async function handleCreate(args: { step: string; html?: string; htmlPath?: string; aspectRatio?: string }) {
  if (args.step === "discover") return discoverStep();
  if (args.step === "preview") return previewStep(args.html, args.htmlPath);
  if (args.step === "review") return reviewStep(args.html, args.htmlPath);
  throw new Error(`Unknown step "${args.step}". Use "discover", "preview", or "review".`);
}
