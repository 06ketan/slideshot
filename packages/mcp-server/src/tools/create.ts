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

function discoverStep() {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: THEME_CATALOG,
        requiredQuestions: [
          { id: "theme", q: "Which theme? (show numbered list)" },
          { id: "topic", q: "What topic/content?" },
          { id: "orientation", q: "Portrait (PDF/social) or Landscape (PPTX)?" },
          { id: "formats", q: "Formats: pdf, pptx, png, webp? Presets: instagram=webp, linkedin=pdf+webp, presentation=pptx" },
          { id: "pptxMode", q: "If PPTX: native (editable) or image (pixel-perfect)?" },
        ],
        instruction: "STOP. MUST present themes as numbered menu and ask ALL requiredQuestions in ONE message. DO NOT call get_slide_prompt or generate HTML until user answers.",
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
        confirmationRequired: true,
        instruction: `Show HTML as code block. Ask: "${slideCount} slides — approve or request changes?" MUST wait for user approval. DO NOT auto-advance.`,
        onApproval: `Call render_html_to_images with htmlPath='${resolvedPath}' and user-chosen formats/orientation.`,
        onChangesRequested: "Edit HTML, call create_slides step='preview' with updated html string.",
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
        instruction: `${slideCount} slides confirmed. Ask user to approve for final render. MUST wait for approval.`,
        onApproval: `Call render_html_to_images with htmlPath='${resolvedPath}' and user-chosen formats/orientation.`,
        onChangesRequested: "Edit HTML, call create_slides step='preview' with updated html string.",
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
