import fs from "node:fs";
import path from "node:path";
import { type PromptVariant, fetchCatalog, type ThemeEntry } from "../prompts.js";
import { defaultOutDir } from "../helpers.js";
import { cacheHtml, resetDiscovery, markDiscoveryDone, isDiscoveryDone, markApproved } from "../cache.js";

const THEME_CATALOG_FALLBACK: ThemeEntry[] = [
  { id: "generic", name: "Clean Minimal", emoji: "📋", style: "Inter, white cards, flexible", palette: ["#FFF", "#1a1a1a", "#888"] },
  { id: "branded", name: "Ketan Slides", emoji: "🎯", style: "Space Mono, teal/coral accents", palette: ["#F0EDE7", "#00B894", "#E84C1E", "#1A1A1A"] },
  { id: "instagram-carousel", name: "Instagram Carousel", emoji: "📸", style: "Poppins, bold gradients, vibrant", palette: ["#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"] },
  { id: "infographic", name: "Infographic", emoji: "📊", style: "DM Sans, data-heavy, stat cards", palette: ["#2563EB", "#10B981", "#F59E0B", "#F8FAFC"] },
  { id: "pitch-deck", name: "Pitch Deck", emoji: "🚀", style: "DM Sans, KPI cards, timelines", palette: ["#0F172A", "#3B82F6", "#8B5CF6", "#FFF"] },
  { id: "dark-modern", name: "Dark Modern", emoji: "🌙", style: "Inter, neon accents, glassmorphism", palette: ["#0A0A0F", "#22D3EE", "#E879F9", "#34D399"] },
  { id: "editorial", name: "Editorial", emoji: "📰", style: "Playfair Display, gold accents, serif", palette: ["#FAF8F5", "#C9963B", "#2C2824", "#1A1814"] },
  { id: "browser-shell", name: "Browser Shell", emoji: "🖥️", style: "Bebas Neue + DM Sans, yellow/navy chrome", palette: ["#FFD233", "#12122A", "#0A0A0A", "#FFF"] },
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
  cacheHtml(html, htmlPath);
  return htmlPath;
}

function countSlides(html: string): number {
  const matches = html.match(/class\s*=\s*["'][^"']*\bslide\b/g);
  return matches ? matches.length : 0;
}

async function discoverStep() {
  resetDiscovery();

  let themes: ThemeEntry[];
  try {
    const fetched = await fetchCatalog();
    themes = fetched && fetched.length > 0 ? fetched : THEME_CATALOG_FALLBACK;
  } catch {
    themes = THEME_CATALOG_FALLBACK;
  }

  markDiscoveryDone();

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: themes.map(t => ({ id: t.id, name: t.name, emoji: t.emoji, style: t.style })),
        ask: [
          { id: "theme", type: "select", prompt: "Which theme?", options: themes.map(t => t.id) },
          { id: "topic", type: "freetext", prompt: "What topic/content for the slides?" },
          { id: "orientation", type: "select", prompt: "Portrait or landscape?", options: ["portrait", "landscape"], default: "portrait" },
          { id: "formats", type: "multiselect", prompt: "Output formats?", options: ["pdf", "pptx", "png", "webp"], default: ["pdf"] },
          { id: "pptxMode", type: "select", prompt: "If PPTX: native (editable) or image (pixel-perfect)?", options: ["native", "image"], condition: "formats includes pptx" },
        ],
        flow: "discover→get_slide_schema→assemble_slides→show HTML→user approval→review→render",
        instruction: "MANDATORY: 1) Present all themes as a numbered menu with emoji+name+style. 2) Ask ALL questions (theme, topic, orientation, formats) in ONE message. 3) STOP and WAIT for the user to answer. Do NOT generate HTML, call assemble_slides, or proceed until the user has explicitly answered. 4) After HTML is generated, show it to the user and ask for approval before rendering.",
      }),
    }],
  };
}

function requireDiscovery() {
  if (!isDiscoveryDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "DISCOVERY_REQUIRED",
          instruction: "Call create_slides with step='discover' first. You MUST present themes to the user and ask for their preferences (theme, topic, orientation, formats) BEFORE generating any HTML.",
        }),
      }],
      isError: true,
    };
  }
  return null;
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
        instruction: `${slideCount} slides ready. You MUST: 1) Show the HTML to the user as a code block, 2) Ask "Does this look good? Should I render the final output?", 3) WAIT for user to explicitly approve, 4) Call create_slides with step='review', 5) THEN call render_html_to_images. Do NOT render without user approval.`,
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

  cacheHtml(resolvedHtml, resolvedPath);
  const slideCount = countSlides(resolvedHtml);

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        slideCount,
        htmlPath: resolvedPath,
        instruction: `${slideCount} slides confirmed. Wait for user approval, then call render_html_to_images (no html/htmlPath needed — server has it cached).`,
      }),
    }],
  };
}

export async function handleCreate(args: { step: string; html?: string; htmlPath?: string; aspectRatio?: string }) {
  if (args.step === "discover") return discoverStep();

  const gate = requireDiscovery();
  if (gate) return gate;

  if (args.step === "preview") return previewStep(args.html, args.htmlPath);
  if (args.step === "review") {
    const result = reviewStep(args.html, args.htmlPath);
    markApproved();
    return result;
  }
  throw new Error(`Unknown step "${args.step}". Use "discover", "preview", or "review".`);
}
