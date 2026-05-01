import { z } from "zod";

const THEMES = ["generic", "branded", "instagram-carousel", "infographic", "pitch-deck", "dark-modern", "editorial", "browser-shell", "academic-poster", "clinical-medical", "sketch-handdrawn"] as const;

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

// ── Tool: list_themes (idempotent) ──

export const ListThemesInputSchema = {};

// ── Tool: edit_slides (token-efficient partial edits) ──

export const EditInputSchema = {
  htmlPath: z.string().optional().describe("Path to HTML to edit. Falls back to cached HTML from last create_slides call."),
  operation: z.enum(["replace_slide", "patch_css", "swap_token", "patch_class"]).describe("Edit operation: replace_slide swaps one slide block; patch_css appends CSS rules to <style>; swap_token replaces a CSS variable's value; patch_class adds/removes a class on a slide."),
  slideIndex: z.number().int().positive().optional().describe("1-indexed slide position. Required for replace_slide and patch_class. Omit for global ops (patch_css, swap_token)."),
  payload: z.union([z.string(), z.record(z.string())]).describe("For replace_slide: the new <div class=\"slide\">...</div> HTML string. For patch_css: a CSS rules string. For swap_token: an object {tokenName: newValue}, e.g. {\"--coral\": \"#FF0000\"}. For patch_class: an object {add?: string, remove?: string}."),
};

// ── Tool 2: create_slides ──

const CoverSlideSchema = z.object({
  type: z.literal("cover"),
  headline: z.string().describe("Main heading (required for cover)"),
  title: z.string().optional().describe("Alias for headline — auto-mapped"),
  subtitle: z.string().optional(),
  badges: z.array(z.string()).optional(),
  facts: z.array(z.string()).optional(),
  label: z.string().optional(),
});

const ContentSlideSchema = z.object({
  type: z.literal("content"),
  title: z.string().describe("Section title (required for content)"),
  paragraphs: z.array(z.string()).describe("Body paragraphs (required for content)"),
  label: z.string().optional(),
  headline: z.string().optional().describe("Alias for title — auto-mapped"),
});

const StatsSlideSchema = z.object({
  type: z.literal("stats"),
  title: z.string().optional(),
  label: z.string().optional(),
  cards: z.array(z.object({
    value: z.string(),
    label: z.string(),
    sub: z.string().optional(),
    trend: z.string().optional(),
  })).describe("Stat cards (required for stats)"),
  tags: z.array(z.string()).optional(),
});

const ListSlideSchema = z.object({
  type: z.literal("list"),
  title: z.string().describe("List title (required for list)"),
  label: z.string().optional(),
  items: z.array(z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tag: z.string().optional(),
  })).describe("List items (required for list)"),
  headline: z.string().optional().describe("Alias for title — auto-mapped"),
});

const StepsSlideSchema = z.object({
  type: z.literal("steps"),
  title: z.string().describe("Steps title (required for steps)"),
  label: z.string().optional(),
  items: z.array(z.object({
    num: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  })).describe("Step items (required for steps)"),
  headline: z.string().optional().describe("Alias for title — auto-mapped"),
});

const ComparisonSlideSchema = z.object({
  type: z.literal("comparison"),
  title: z.string().optional(),
  leftLabel: z.string().describe("Left column label (required)"),
  rightLabel: z.string().describe("Right column label (required)"),
  left: z.array(z.object({ label: z.string(), description: z.string().optional() })).describe("Left items (required)"),
  right: z.array(z.object({ label: z.string(), description: z.string().optional() })).describe("Right items (required)"),
});

const QuoteSlideSchema = z.object({
  type: z.literal("quote"),
  quote: z.string().describe("Quote text (required for quote)"),
  attribution: z.string().optional(),
  label: z.string().optional(),
});

const CodeSlideSchema = z.object({
  type: z.literal("code"),
  title: z.string().describe("Code block title (required for code)"),
  code: z.string().describe("Code content (required for code)"),
  language: z.string().optional(),
  headline: z.string().optional().describe("Alias for title — auto-mapped"),
});

const CtaSlideSchema = z.object({
  type: z.literal("cta"),
  headline: z.string().describe("CTA heading (required for cta)"),
  title: z.string().optional().describe("Alias for headline — auto-mapped"),
  description: z.string().optional(),
  action: z.string().optional(),
  email: z.string().optional(),
  note: z.string().optional(),
  items: z.array(z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
});

const TimelineSlideSchema = z.object({
  type: z.literal("timeline"),
  title: z.string().describe("Timeline title (required for timeline)"),
  items: z.array(z.object({
    year: z.string().optional(),
    description: z.string().optional(),
  })).describe("Timeline items (required for timeline)"),
  headline: z.string().optional().describe("Alias for title — auto-mapped"),
});

const TeamSlideSchema = z.object({
  type: z.literal("team"),
  title: z.string().describe("Team section title (required for team)"),
  members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    emoji: z.string().optional(),
  })).describe("Team members (required for team)"),
  headline: z.string().optional().describe("Alias for title — auto-mapped"),
});

const SlideSchema = z.discriminatedUnion("type", [
  CoverSlideSchema,
  ContentSlideSchema,
  StatsSlideSchema,
  ListSlideSchema,
  StepsSlideSchema,
  ComparisonSlideSchema,
  QuoteSlideSchema,
  CodeSlideSchema,
  CtaSlideSchema,
  TimelineSlideSchema,
  TeamSlideSchema,
]).describe("Slide data — required fields depend on type");

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
  html: z.string().optional().describe("HTML string (prefer htmlPath to save tokens)"),
  selector: z.string().optional().describe("Slide selector (default: .slide)"),
  width: z.number().optional().describe("Width px (default: 540)"),
  height: z.number().optional().describe("Height px (default: 675)"),
  scale: z.number().optional().describe("Device scale 1-6 (default: 4)"),
  formats: z.array(z.enum(["png", "webp", "pdf", "pptx"])).optional().describe("Output formats (default: [pdf])"),
  webpQuality: z.number().optional().describe("WebP quality 0-100 (default: 95)"),
  outDir: z.string().optional().describe("Output directory override"),
  pdfFilename: z.string().optional().describe("Custom PDF filename"),
  pptxFilename: z.string().optional().describe("Custom PPTX filename"),
  slideRange: z.tuple([z.number(), z.number()]).optional().describe("Render slides N-M, 1-indexed"),
  orientation: z.enum(["portrait", "landscape"]).optional().describe("portrait=540x675, landscape=1920x1080"),
  pptxMode: z.enum(["native", "image", "rich-native"]).optional().describe(
    "Default: image (pixel-perfect, design preserved, not editable). 'native' = text-only opt-in (no design). 'rich-native' = EXPERIMENTAL — see docs/pptx-rich-roadmap.md (currently falls back to image with warning).",
  ),
};
