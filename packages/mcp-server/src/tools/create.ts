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
          { id: "theme", type: "select", prompt: "Which theme do you want?", options: themes.map(t => ({ value: t.id, label: `${t.emoji} ${t.name} — ${t.style}` })) },
          { id: "topic", type: "freetext", prompt: "What topic/content for the slides?" },
          { id: "orientation", type: "select", prompt: "Portrait or landscape?", options: [{ value: "portrait", label: "Portrait (PDF, social, LinkedIn)" }, { value: "landscape", label: "Landscape (PPTX, presentations)" }], default: "portrait" },
          { id: "formats", type: "multiselect", prompt: "Output format?", options: [{ value: "pdf", label: "PDF" }, { value: "pptx", label: "PPTX" }, { value: "png", label: "PNG" }, { value: "webp", label: "WebP" }], default: ["pdf"] },
          { id: "pptxMode", type: "select", prompt: "PPTX mode?", options: [{ value: "native", label: "Native (editable text)" }, { value: "image", label: "Image (pixel-perfect)" }], condition: "formats includes pptx" },
          { id: "brandName", type: "freetext", prompt: "Brand name? (optional)", optional: true },
          { id: "assets", type: "freetext", prompt: "Brand assets — logo URL, colors, images? (optional)", optional: true },
        ],
        flow: "discover→get_slide_schema→assemble_slides→artifact preview→user approval→review→render",
        hints: {
          preview: "After assembly, create an artifact with the full HTML so user gets a live preview in the right panel with Code/Preview tabs. Do NOT paste HTML inline in chat.",
          pdfSave: "After rendering PDF, provide the file path. Claude web/desktop users can open PDFs natively.",
          codeView: "If user asks to see the code, show it in a code block artifact alongside the visual preview.",
        },
        instruction: "MANDATORY: Use ONLY native interactive prompts to ask the user. Do NOT generate markdown tables, numbered lists, or verbose text describing themes. Keep your text response to one short sentence (e.g. 'Let me set up your slides.'). Then use native prompts for: theme selection, topic, orientation, formats. Skip optional questions (brandName, assets) unless user mentions them. STOP and WAIT for answers before proceeding.",
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
        instruction: `${slideCount} slides ready. You MUST: 1) Create an artifact containing the complete HTML document for live preview (right panel, Code/Preview tabs), 2) Ask "Does this look good? Should I render the final output?", 3) WAIT for user to explicitly approve, 4) Call create_slides with step='review', 5) THEN call render_html_to_images. Do NOT render without user approval.`,
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
