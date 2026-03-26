import { z } from "zod";

const THEMES = ["generic", "branded", "instagram-carousel", "infographic", "pitch-deck", "dark-modern", "editorial", "browser-shell"] as const;

export const RenderInputSchema = {
  html: z.string().optional().describe("HTML string (prefer htmlPath)"),
  htmlPath: z.string().optional().describe("Path to saved HTML file (preferred)"),
  selector: z.string().optional().describe("Slide selector (default: .slide)"),
  width: z.number().optional().describe("Width px (default: 540)"),
  height: z.number().optional().describe("Height px (default: 675)"),
  scale: z.number().optional().describe("Scale 1-6 (default: 4)"),
  formats: z.array(z.enum(["png", "webp", "pdf", "pptx"])).optional().describe("Output formats (default: [pdf])"),
  outDir: z.string().optional().describe("Output dir"),
  pdfFilename: z.string().optional().describe("PDF filename"),
  pptxFilename: z.string().optional().describe("PPTX filename"),
  slideRange: z.tuple([z.number(), z.number()]).optional().describe("Render slides N-M, 1-indexed"),
  orientation: z.enum(["portrait", "landscape"]).optional().describe("portrait=540x675 landscape=1920x1080"),
  pptxMode: z.enum(["native", "image"]).optional().describe("native=editable image=pixel-perfect"),
};

export const PromptInputSchema = {
  variant: z.enum(THEMES).describe("Theme variant from discover step"),
};

export const CreateInputSchema = {
  step: z.enum(["discover", "preview", "review"]).describe(
    "discover=themes+questions preview=save HTML review=re-confirm",
  ),
  html: z.string().optional().describe("HTML string for preview"),
  htmlPath: z.string().optional().describe("HTML file path"),
  aspectRatio: z.enum(["portrait", "landscape"]).optional(),
};

// Flat slide object — avoids 11-variant discriminatedUnion (saves ~900 tokens in tool definition).
// Fields are validated at runtime by the assembler; the type enum guides the LLM.
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
}).describe("Slide data — fields depend on type. Call get_slide_schema for per-type field reference.");

export const AssembleInputSchema = {
  theme: z.enum(THEMES).describe("Theme from discover"),
  slides: z.array(SlideSchema).min(1).describe("Slides array"),
  orientation: z.enum(["portrait", "landscape"]).optional(),
  brandName: z.string().optional(),
};

export const SchemaInputSchema = {
  theme: z.enum(THEMES).describe("Theme to get field reference for"),
};
