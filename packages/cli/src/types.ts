export type ImageFormat = "png" | "webp" | "pdf" | "pptx";

export interface RenderOptions {
  html?: string;
  htmlPath?: string;
  selector?: string;
  width?: number;
  height?: number;
  scale?: number;
  formats?: ImageFormat[];
  webpQuality?: number;
  outDir: string;
  pdfFilename?: string;
  pptxFilename?: string;
  slideRange?: [number, number];
  orientation?: "portrait" | "landscape";
}

export interface RenderResult {
  files: string[];
  slideCount: number;
}

export const ORIENTATION_PRESETS = {
  portrait: { width: 540, height: 675 },
  landscape: { width: 1920, height: 1080 },
} as const;

export const DEFAULTS = {
  selector: ".slide",
  width: 540,
  height: 675,
  scale: 4,
  formats: ["png", "webp", "pdf"] as ImageFormat[],
  webpQuality: 95,
};
