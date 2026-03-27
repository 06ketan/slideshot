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
        themes: themes.map(t => ({ id: t.id, name: t.name, emoji: t.emoji, style: t.style, palette: t.palette })),
        presets: {
          linkedin: { orientation: "portrait", formats: ["pdf"], note: "540x675 @4x, PDF carousel" },
          instagram: { orientation: "portrait", formats: ["png"], note: "1080x1350, single images" },
          presentation: { orientation: "landscape", formats: ["pptx"], note: "1920x1080, PowerPoint" },
          social: { orientation: "portrait", formats: ["webp"], note: "Quick share images" },
        },
        ask: [
          { id: "theme", type: "select", prompt: "Pick a theme. Show user a numbered menu with emoji, name, style, and palette colors.", options: themes.map(t => t.id) },
          { id: "topic", type: "freetext", prompt: "What topic or content should the slides cover? Ask user to describe or paste content." },
          { id: "orientation", type: "select", prompt: "Portrait (PDF, social, LinkedIn) or Landscape (PPTX, presentations)? Suggest based on chosen format/preset.", options: ["portrait", "landscape"], default: "portrait" },
          { id: "formats", type: "multiselect", prompt: "Output formats: pdf (default), pptx, png, webp. Mention presets (linkedin, instagram, presentation) as shortcuts.", options: ["pdf", "pptx", "png", "webp"], default: ["pdf"] },
          { id: "pptxMode", type: "select", prompt: "If PPTX: native (editable text) or image (pixel-perfect screenshots)?", options: ["native", "image"], condition: "formats includes pptx" },
          { id: "brandName", type: "freetext", prompt: "Brand or company name for the slides? (Optional — skip if none.)", optional: true },
          { id: "assets", type: "freetext", prompt: "Any brand assets? Logo URL, brand colors, images to include? (Optional — skip if none.)", optional: true },
        ],
        flow: "discover→get_slide_schema→assemble_slides→artifact preview→user approval→review→render",
        hints: {
          preview: "After generating HTML, render it as an HTML artifact so the user can preview visually. Do NOT just show raw code.",
          pdfSave: "After rendering PDF, provide the file path. Claude web/desktop users can open PDFs natively.",
          codeView: "If user asks to see the code, show it in a code block artifact alongside the visual preview.",
        },
        instruction: "MANDATORY: 1) Present all themes as a numbered visual menu with emoji+name+style+palette colors. 2) Mention presets (linkedin, instagram, presentation) as quick shortcuts. 3) Ask ALL questions (theme, topic, orientation, formats, brand name, assets) in ONE message. Mark optional questions clearly. 4) STOP and WAIT for the user to answer. Do NOT generate HTML, call assemble_slides, or proceed until the user has explicitly answered. 5) After HTML is generated, show it as an HTML artifact for visual preview (not just a code block). 6) After rendering, tell user where files are saved and how to open them.",
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
        instruction: `${slideCount} slides ready. You MUST: 1) Show the HTML as an interactive artifact for visual preview (not just a code block), 2) Ask "Does this look good? Should I render the final output?", 3) WAIT for user to explicitly approve, 4) Call create_slides with step='review', 5) THEN call render_html_to_images. Do NOT render without user approval.`,
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
