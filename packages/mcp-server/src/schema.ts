import { z } from "zod";

const THEMES = ["generic", "branded", "instagram-carousel", "infographic", "pitch-deck", "dark-modern", "editorial", "browser-shell"] as const;

const ORIENTATIONS = ["portrait", "landscape", "linkedin", "instagram", "a4", "custom"] as const;

export const ORIENTATION_PRESETS: Record<string, { width: number; height: number }> = {
  portrait:  { width: 540,  height: 675  },
  landscape: { width: 1920, height: 1080 },
  linkedin:  { width: 540,  height: 675  },
  instagram: { width: 1080, height: 1080 },
  a4:        { width: 595,  height: 842  },
};

// ── Tool 1: discover_themes ──

export const DiscoverInputSchema = {};

// ── Tool 2: create_slides ──

const SlideSchema = z.object({
  type: z.enum(["cover", "content", "stats", "list", "steps", "comparison", "quote", "code", "cta", "timeline", "team"])
    .describe("Slide type"),
  headline: z.string().optional(),
  subtitle: z.string().optional(),
  title: z.string().optional(),
  label: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  quote: z.string().optional(),
  attribution: z.string().optional(),
  code: z.string().optional(),
  language: z.string().optional(),
  description: z.string().optional(),
  action: z.string().optional(),
  email: z.string().optional(),
  note: z.string().optional(),
  badges: z.array(z.string()).optional(),
  facts: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  cards: z.array(z.object({
    value: z.string(),
    label: z.string(),
    sub: z.string().optional(),
    trend: z.string().optional(),
  })).optional(),
  items: z.array(z.object({
    num: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    tag: z.string().optional(),
    year: z.string().optional(),
    label: z.string().optional(),
  })).optional(),
  members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    emoji: z.string().optional(),
  })).optional(),
  leftLabel: z.string().optional(),
  rightLabel: z.string().optional(),
  left: z.array(z.object({ label: z.string(), description: z.string().optional() })).optional(),
  right: z.array(z.object({ label: z.string(), description: z.string().optional() })).optional(),
}).describe("Slide data — fields depend on type");

export const CreateInputSchema = {
  mode: z.enum(["default", "token_saver"]).describe("default = AI writes full HTML (more tokens, full control). token_saver = AI sends JSON, server assembles HTML (fewer tokens)."),
  theme: z.enum(THEMES).describe("Theme from discover_themes"),
  orientation: z.enum(ORIENTATIONS).optional().describe("Preset or custom. Default: portrait"),
  width: z.number().optional().describe("Custom width px (only with orientation=custom)"),
  height: z.number().optional().describe("Custom height px (only with orientation=custom)"),
  html: z.string().optional().describe("Full HTML document (mode=default only)"),
  slides: z.array(SlideSchema).optional().describe("Structured slide data (mode=token_saver only)"),
  brandName: z.string().optional().describe("Brand name for branded themes"),
};

// ── Tool 3: render_slides ──

export const RenderInputSchema = {
  htmlPath: z.string().optional().describe("Path to saved HTML file (from create_slides). Falls back to cached HTML."),
  formats: z.array(z.enum(["pdf", "webp", "png"])).optional().describe("Output formats (default: [pdf])"),
  scale: z.number().optional().describe("Device scale 1-6 (default: 4)"),
  slideRange: z.tuple([z.number(), z.number()]).optional().describe("Render slides N-M, 1-indexed"),
  outDir: z.string().optional().describe("Output directory override"),
  pdfFilename: z.string().optional().describe("Custom PDF filename"),
};
