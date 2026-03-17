import { renderToBuffers } from "slideshot";
import { PROMPT_VARIANTS, type PromptVariant } from "../prompts.js";

const THEME_CATALOG: Array<{
  id: PromptVariant;
  name: string;
  style: string;
  palette: string[];
}> = [
  { id: "generic", name: "Clean Minimal", style: "Simple Inter font, white cards, flexible layout", palette: ["#FFFFFF", "#1a1a1a", "#888888"] },
  { id: "branded", name: "Ketan Slides", style: "Monospace Space Mono, teal/coral accents, corner decorations", palette: ["#F0EDE7", "#00B894", "#E84C1E", "#1A1A1A"] },
  { id: "instagram-carousel", name: "Instagram Carousel", style: "Bold gradients, Poppins, vibrant swipe-friendly", palette: ["#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"] },
  { id: "infographic", name: "Infographic", style: "Data-heavy, DM Sans, progress bars, stat cards", palette: ["#2563EB", "#10B981", "#F59E0B", "#F8FAFC"] },
  { id: "pitch-deck", name: "Pitch Deck", style: "Professional, DM Sans, KPI cards, timelines", palette: ["#0F172A", "#3B82F6", "#8B5CF6", "#FFFFFF"] },
  { id: "dark-modern", name: "Dark Modern", style: "Neon accents, glassmorphism, Inter, code blocks", palette: ["#0A0A0F", "#22D3EE", "#E879F9", "#34D399"] },
  { id: "editorial", name: "Editorial", style: "Magazine serif, Playfair Display, gold accents", palette: ["#FAF8F5", "#C9963B", "#2C2824", "#1A1814"] },
];

const OUTPUT_PRESETS: Record<string, { formats: string[]; width: number; height: number; scale: number; description: string }> = {
  instagram: { formats: ["webp"], width: 1080, height: 1350, scale: 1, description: "Instagram post/carousel (1080x1350)" },
  linkedin: { formats: ["pdf", "webp"], width: 540, height: 675, scale: 4, description: "LinkedIn carousel (2160x2700 @4x)" },
  presentation: { formats: ["pdf"], width: 1920, height: 1080, scale: 2, description: "Presentation/deck (3840x2160 @2x)" },
  custom: { formats: ["png", "webp", "pdf"], width: 540, height: 675, scale: 4, description: "Custom — all formats, default dims" },
};

function discoverStep() {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: THEME_CATALOG,
        outputPresets: OUTPUT_PRESETS,
        availableFormats: ["png", "webp", "pdf"],
        askUser: [
          "Present the theme list as a numbered menu with names and style descriptions.",
          "Ask these in ONE bundled message:",
          "1. Which theme? (pick from the list or describe your own style)",
          "2. What content/topic for the slides? (or paste existing content)",
          "3. Target platform: Instagram, LinkedIn, Presentation, or Custom?",
          "After the user answers, use get_slide_prompt with the chosen theme variant to get the full CSS/prompt, then generate the HTML.",
        ].join(" "),
      }, null, 2),
    }],
  };
}

async function previewStep(html?: string) {
  if (!html) {
    throw new Error("html is required for preview step");
  }

  const result = await renderToBuffers({
    html,
    scale: 1,
    formats: ["webp"],
    slideRange: [1, 1],
  });

  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; data: string; mimeType: string }
  > = [];

  if (result.images.length > 0) {
    content.push({
      type: "image" as const,
      data: result.images[0].buffer.toString("base64"),
      mimeType: "image/webp",
    });
  }

  content.push({
    type: "text" as const,
    text: JSON.stringify({
      slideCount: result.slideCount,
      previewSlide: 1,
      askUser: `Show the preview image above and ask: "Here's slide 1 of ${result.slideCount}. Any changes, or should I render all slides at full resolution?"`,
    }, null, 2),
  });

  return { content };
}

export async function handleCreate(args: { step: string; html?: string }) {
  if (args.step === "discover") return discoverStep();
  if (args.step === "preview") return previewStep(args.html);
  throw new Error(`Unknown step "${args.step}". Use "discover" or "preview".`);
}
