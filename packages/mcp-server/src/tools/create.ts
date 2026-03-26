import { renderToBuffers } from "slideshot";
import { PROMPT_VARIANTS, type PromptVariant } from "../prompts.js";

interface ThemeEntry {
  id: PromptVariant;
  name: string;
  emoji: string;
  icon: string;
  style: string;
  palette: string[];
}

const THEME_CATALOG: ThemeEntry[] = [
  {
    id: "generic", name: "Clean Minimal", emoji: "\ud83d\udccb",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#888" stroke-width="1.5"/><rect x="6" y="7" width="12" height="2" rx="1" fill="#1a1a1a"/><rect x="6" y="11" width="8" height="2" rx="1" fill="#ccc"/><rect x="6" y="15" width="10" height="2" rx="1" fill="#ccc"/></svg>`,
    style: "Simple Inter font, white cards, flexible layout",
    palette: ["#FFFFFF", "#1a1a1a", "#888888"],
  },
  {
    id: "branded", name: "Ketan Slides", emoji: "\ud83c\udfaf",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="2" y="2" width="20" height="20" rx="1" fill="#F0EDE7"/><path d="M18 3v4h4" stroke="#00B894" stroke-width="1.5" fill="none"/><path d="M6 21v-4H2" stroke="#E84C1E" stroke-width="1.5" fill="none"/><rect x="5" y="8" width="14" height="2.5" rx="1" fill="#1A1A1A"/><rect x="5" y="12" width="8" height="1.5" rx=".75" fill="#00B894"/></svg>`,
    style: "Monospace Space Mono, teal/coral accents, corner decorations",
    palette: ["#F0EDE7", "#00B894", "#E84C1E", "#1A1A1A"],
  },
  {
    id: "instagram-carousel", name: "Instagram Carousel", emoji: "\ud83d\udcf8",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><defs><linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6C5CE7"/><stop offset="50%" stop-color="#FD79A8"/><stop offset="100%" stop-color="#FDCB6E"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)"/><circle cx="12" cy="12" r="5" stroke="#fff" stroke-width="1.5" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/></svg>`,
    style: "Bold gradients, Poppins, vibrant swipe-friendly",
    palette: ["#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"],
  },
  {
    id: "infographic", name: "Infographic", emoji: "\ud83d\udcca",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="3" y="14" width="4" height="7" rx="1" fill="#F59E0B"/><rect x="10" y="9" width="4" height="12" rx="1" fill="#10B981"/><rect x="17" y="4" width="4" height="17" rx="1" fill="#2563EB"/></svg>`,
    style: "Data-heavy, DM Sans, progress bars, stat cards",
    palette: ["#2563EB", "#10B981", "#F59E0B", "#F8FAFC"],
  },
  {
    id: "pitch-deck", name: "Pitch Deck", emoji: "\ud83d\ude80",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="2" y="3" width="20" height="18" rx="2" fill="#0F172A"/><rect x="5" y="7" width="10" height="2" rx="1" fill="#fff"/><rect x="5" y="11" width="6" height="1.5" rx=".75" fill="#3B82F6"/><rect x="5" y="14" width="14" height="1" rx=".5" fill="#8B5CF6" opacity=".6"/><rect x="5" y="17" width="14" height="1" rx=".5" fill="#8B5CF6" opacity=".3"/></svg>`,
    style: "Professional, DM Sans, KPI cards, timelines",
    palette: ["#0F172A", "#3B82F6", "#8B5CF6", "#FFFFFF"],
  },
  {
    id: "dark-modern", name: "Dark Modern", emoji: "\ud83c\udf19",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0A0A0F"/><circle cx="12" cy="10" r="3" fill="#22D3EE" opacity=".8"/><rect x="6" y="16" width="12" height="1.5" rx=".75" fill="#E879F9" opacity=".5"/><rect x="8" y="19" width="8" height="1" rx=".5" fill="#34D399" opacity=".4"/></svg>`,
    style: "Neon accents, glassmorphism, Inter, code blocks",
    palette: ["#0A0A0F", "#22D3EE", "#E879F9", "#34D399"],
  },
  {
    id: "editorial", name: "Editorial", emoji: "\ud83d\udcf0",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="2" y="2" width="20" height="20" rx="1" fill="#FAF8F5"/><rect x="4" y="4" width="16" height="3" rx=".5" fill="#2C2824"/><text x="12" y="16" text-anchor="middle" font-family="serif" font-size="10" font-weight="700" fill="#C9963B">A</text><rect x="4" y="19" width="16" height=".8" fill="#C9963B" opacity=".5"/></svg>`,
    style: "Magazine serif, Playfair Display, gold accents",
    palette: ["#FAF8F5", "#C9963B", "#2C2824", "#1A1814"],
  },
  {
    id: "browser-shell", name: "Browser Shell", emoji: "\ud83d\udda5\ufe0f",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="2" y="3" width="20" height="17" rx="2" fill="#12122A"/><rect x="2" y="3" width="20" height="4" rx="2" fill="#FFD233"/><circle cx="6" cy="5" r="1" fill="#FF6059"/><circle cx="9" cy="5" r="1" fill="#FFBD2E"/><circle cx="12" cy="5" r="1" fill="#27C93F"/><rect x="5" y="10" width="14" height="2" rx="1" fill="#fff"/><rect x="5" y="14" width="8" height="1.5" rx=".75" fill="#FFD233"/></svg>`,
    style: "Bebas Neue + DM Sans, yellow/navy browser chrome, versatile layout",
    palette: ["#FFD233", "#12122A", "#0A0A0A", "#FFFFFF"],
  },
];

const OUTPUT_PRESETS: Record<string, { formats: string[]; width: number; height: number; scale: number; orientation: string; description: string }> = {
  instagram: { formats: ["webp"], width: 1080, height: 1350, scale: 1, orientation: "portrait", description: "Instagram post/carousel (1080x1350)" },
  linkedin: { formats: ["pdf", "webp"], width: 540, height: 675, scale: 4, orientation: "portrait", description: "LinkedIn carousel (2160x2700 @4x)" },
  presentation: { formats: ["pptx"], width: 1920, height: 1080, scale: 2, orientation: "landscape", description: "PowerPoint deck (1920x1080 landscape)" },
  custom: { formats: ["png", "webp", "pdf"], width: 540, height: 675, scale: 4, orientation: "portrait", description: "Custom — all formats, default dims" },
};

function discoverStep() {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: THEME_CATALOG,
        outputPresets: OUTPUT_PRESETS,
        availableFormats: ["png", "webp", "pdf", "pptx"],
        workflow: [
          "1. discover -> user picks theme/topic/platform",
          "2. get_slide_prompt with chosen theme -> AI generates HTML",
          "3. preview (slide 1) -> show code + image to user",
          "4. IF changes needed -> revise HTML -> preview again",
          "5. review (all slides) -> user confirms entire deck",
          "6. render_html_to_images -> final high-res files",
        ],
        askUser: [
          "Present the theme list as a numbered menu using each theme's emoji, name, and style description.",
          "Ask these in ONE bundled message:",
          "1. Which theme? (pick from the list or describe your own style)",
          "2. What content/topic for the slides? (or paste existing content)",
          "3. Target platform: Instagram, LinkedIn, Presentation (PPTX), or Custom?",
          "4. Ratio: Portrait (PDF, social) or Landscape (PPTX, presentations)? (default: portrait)",
          "After the user answers, use get_slide_prompt with the chosen theme variant to get the full CSS/prompt, then generate the HTML.",
          "IMPORTANT: Always show the generated HTML code AND call preview before rendering. Loop preview until user approves.",
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
      htmlIncluded: true,
      askUser: [
        `Show the HTML code as a code block AND the preview image above to the user.`,
        `Ask: "Here's slide 1 of ${result.slideCount}. Review the code and preview — any changes needed?"`,
        `If user wants changes: revise the HTML and call preview again.`,
        `If user approves: call review with the full HTML to see all slides, or call render_html_to_images to generate final files.`,
      ].join(" "),
    }, null, 2),
  });

  content.push({
    type: "text" as const,
    text: `\n---HTML CODE---\n${html}\n---END HTML---`,
  });

  return { content };
}

async function reviewStep(html?: string) {
  if (!html) {
    throw new Error("html is required for review step");
  }

  const result = await renderToBuffers({
    html,
    scale: 1,
    formats: ["webp"],
  });

  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; data: string; mimeType: string }
  > = [];

  for (const img of result.images) {
    content.push({
      type: "image" as const,
      data: img.buffer.toString("base64"),
      mimeType: "image/webp",
    });
  }

  content.push({
    type: "text" as const,
    text: JSON.stringify({
      slideCount: result.slideCount,
      totalPreviews: result.images.length,
      askUser: [
        `Show ALL ${result.slideCount} slide preview images above to the user.`,
        `Ask: "Here are all ${result.slideCount} slides. Does everything look good?"`,
        `If user wants changes: ask which slide(s) to fix, revise the HTML, and call review again.`,
        `If user approves: call render_html_to_images with the final HTML and desired formats (portrait=PDF, landscape=PPTX).`,
      ].join(" "),
    }, null, 2),
  });

  return { content };
}

export async function handleCreate(args: { step: string; html?: string; aspectRatio?: string }) {
  if (args.step === "discover") return discoverStep();
  if (args.step === "preview") return previewStep(args.html);
  if (args.step === "review") return reviewStep(args.html);
  throw new Error(`Unknown step "${args.step}". Use "discover", "preview", or "review".`);
}
