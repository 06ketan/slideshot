import { z } from "zod";

export const RenderInputSchema = {
  html: z.string().optional().describe("Full HTML string containing slide elements (use htmlPath for large content)"),
  htmlPath: z.string().optional().describe("Absolute path to an HTML file on disk — faster than passing html string for large slides"),
  selector: z.string().optional().describe("CSS selector for slide elements (default: .slide)"),
  width: z.number().optional().describe("Slide width in CSS pixels (default: 540)"),
  height: z.number().optional().describe("Slide height in CSS pixels (default: 675)"),
  scale: z.number().optional().describe("Device scale factor 1-6 (default: 4)"),
  formats: z.array(z.enum(["png", "webp", "pdf", "pptx"])).optional().describe("Output formats (default: [webp, pdf]). Use 'pptx' for PowerPoint decks"),
  outDir: z.string().optional().describe("Absolute path to output directory (default: ~/Desktop/slideshot-output)"),
  pdfFilename: z.string().optional().describe("Custom PDF filename (default: carousel.pdf). E.g. 'brand-slides.pdf'"),
  pptxFilename: z.string().optional().describe("Custom PPTX filename (default: carousel.pptx). E.g. 'brand-deck.pptx'"),
  slideRange: z.tuple([z.number(), z.number()]).optional().describe("Render only slides N-M, 1-indexed (e.g. [1,3] for first 3 slides). Useful for quick iteration"),
  orientation: z.enum(["portrait", "landscape"]).optional().describe("Orientation preset: portrait (540x675) or landscape (1920x1080). Overridden by explicit width/height"),
  pptxMode: z.enum(["native", "image"]).optional().describe("PPTX mode: 'native' = editable text (default), 'image' = screenshot-based (pixel-perfect but not editable)"),
};

export const PromptInputSchema = {
  variant: z
    .enum(["generic", "branded", "instagram-carousel", "infographic", "pitch-deck", "dark-modern", "editorial"])
    .describe(
      "'generic' = clean minimal, 'branded' = Ketan Slides, 'instagram-carousel' = bold vibrant IG style, " +
      "'infographic' = data-heavy charts, 'pitch-deck' = professional presentation, " +
      "'dark-modern' = neon glassmorphism, 'editorial' = magazine serif style",
    ),
};

export const CreateInputSchema = {
  step: z.enum(["discover", "preview"]).describe(
    "'discover' = get theme catalog + output presets + smart questions to ask user. " +
    "'preview' = render slide 1 only at 1x for fast preview before full render",
  ),
  html: z.string().optional().describe("HTML to preview (required for 'preview' step)"),
};
