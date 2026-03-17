import { z } from "zod";

export const RenderInputSchema = {
  html: z.string().optional().describe("Full HTML string containing slide elements (use htmlPath for large content)"),
  htmlPath: z.string().optional().describe("Absolute path to an HTML file on disk — faster than passing html string for large slides"),
  selector: z.string().optional().describe("CSS selector for slide elements (default: .slide)"),
  width: z.number().optional().describe("Slide width in CSS pixels (default: 540)"),
  height: z.number().optional().describe("Slide height in CSS pixels (default: 675)"),
  scale: z.number().optional().describe("Device scale factor 1-6 (default: 4)"),
  formats: z.array(z.enum(["png", "webp", "pdf"])).optional().describe("Output formats (default: [webp, pdf])"),
  outDir: z.string().optional().describe("Absolute path to output directory (default: ~/Desktop/slideshot-output)"),
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
