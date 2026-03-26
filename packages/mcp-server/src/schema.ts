import { z } from "zod";

export const RenderInputSchema = {
  html: z.string().optional().describe("HTML string (prefer htmlPath to save tokens)"),
  htmlPath: z.string().optional().describe("Path to HTML file on disk (preferred over html)"),
  selector: z.string().optional().describe("Slide selector (default: .slide)"),
  width: z.number().optional().describe("Width px (default: 540)"),
  height: z.number().optional().describe("Height px (default: 675)"),
  scale: z.number().optional().describe("Scale 1-6 (default: 4)"),
  formats: z.array(z.enum(["png", "webp", "pdf", "pptx"])).optional().describe("Output formats (default: [pdf])"),
  outDir: z.string().optional().describe("Output directory (default: ~/Desktop/slideshot-output)"),
  pdfFilename: z.string().optional().describe("PDF filename (default: carousel.pdf)"),
  pptxFilename: z.string().optional().describe("PPTX filename (default: carousel.pptx)"),
  slideRange: z.tuple([z.number(), z.number()]).optional().describe("Render slides N-M, 1-indexed"),
  orientation: z.enum(["portrait", "landscape"]).optional().describe("portrait=540x675, landscape=1920x1080"),
  pptxMode: z.enum(["native", "image"]).optional().describe("native=editable text, image=pixel-perfect"),
};

export const PromptInputSchema = {
  variant: z
    .enum(["generic", "branded", "instagram-carousel", "infographic", "pitch-deck", "dark-modern", "editorial", "browser-shell"])
    .describe("User-selected theme from discover. DO NOT auto-select."),
};

export const CreateInputSchema = {
  step: z.enum(["discover", "preview", "review"]).describe(
    "discover=MUST call first, returns themes+questions. preview=save HTML, returns htmlPath, MUST get approval. review=optional re-confirm.",
  ),
  html: z.string().optional().describe("HTML string (required on first preview)"),
  htmlPath: z.string().optional().describe("HTML file path (from preview, use for render)"),
  aspectRatio: z.enum(["portrait", "landscape"]).optional().describe("portrait=540x675, landscape=1920x1080"),
};
