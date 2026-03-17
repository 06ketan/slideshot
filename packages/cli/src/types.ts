export type ImageFormat = "png" | "webp" | "pdf";

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
  slideRange?: [number, number];
}

export interface RenderResult {
  files: string[];
  slideCount: number;
}

export const DEFAULTS = {
  selector: ".slide",
  width: 540,
  height: 675,
  scale: 4,
  formats: ["png", "webp", "pdf"] as ImageFormat[],
  webpQuality: 95,
};
