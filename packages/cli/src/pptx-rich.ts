/**
 * Rich-Native PPTX Export — scaffold for Option B work.
 *
 * Status: NOT YET IMPLEMENTED. Calling generateRichNativePptx() currently
 * throws a NotImplementedError that callers (render.ts) intercept and fall
 * back to image-mode export.
 *
 * See docs/pptx-rich-roadmap.md for the full implementation plan:
 *   Phase 1 — shape extraction (every visible element → PPTX shape)
 *   Phase 2 — pseudo-elements (::before / ::after via getComputedStyle)
 *   Phase 3 — backgrounds (gradients → PPTX gradient stops)
 *   Phase 4 — SVG handling (flatten or convert to freeform shapes)
 *   Phase 5 — layout fidelity (extract at target dims, not 540×675)
 *   Phase 6 — validation harness (snapshot tests + LibreOffice render-back)
 */

import type { Page } from "puppeteer";

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotImplementedError";
  }
}

/**
 * Phase 1 type: every visible element captured as a structured shape.
 * Will be the base for both shape rendering AND pseudo-element capture.
 */
export interface RichShape {
  /** PPTX shape preset: "rect" | "roundRect" | "ellipse" | "line" | "freeform" */
  prstGeom: string;
  /** Position in slide-relative pixels — converted to inches at emit time */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Fill: solid color hex, gradient stops, or null for transparent */
  fill: SolidFill | GradientFill | null;
  /** Stroke (border) — hex color and weight in pt, or null */
  stroke: { color: string; weightPt: number } | null;
  /** Border radius in px (for roundRect prstGeom) */
  borderRadiusPx?: number;
  /** Drop shadow if any */
  shadow?: { color: string; blurPx: number; offsetX: number; offsetY: number };
  /** Z-index (higher = on top), to handle stacking when emitting */
  zIndex: number;
  /** Text content if this shape contains text (paragraph runs) */
  text?: TextBody;
  /** Source DOM node selector for debugging */
  sourceSelector?: string;
}

export interface SolidFill {
  type: "solid";
  color: string;
}

export interface GradientFill {
  type: "gradient";
  /** Direction in degrees (0 = top to bottom, 90 = left to right) */
  angleDeg: number;
  /** Stops in order, position 0-100 */
  stops: Array<{ position: number; color: string }>;
}

export interface TextBody {
  paragraphs: Array<{
    align: "left" | "center" | "right";
    runs: Array<{
      text: string;
      bold: boolean;
      italic: boolean;
      fontFace: string;
      fontSizePt: number;
      color: string;
    }>;
  }>;
}

export interface RichSlideData {
  width: number;
  height: number;
  background: SolidFill | GradientFill | null;
  shapes: RichShape[];
}

/**
 * Phase 1 shape-extraction skeleton (implement in follow-up commits).
 *
 * Intended pipeline:
 * 1. Resolve slide roots from selector + optional slideRange slice.
 * 2. Depth-first traverse visible descendants; skip nodes fully obscured by opaque children (same roadmap rules).
 * 3. For each node: getBoundingClientRect + getComputedStyle → RichShape (prstGeom, fill, stroke, text optional).
 * 4. Build RichSlideData per slide: background from slide root, shapes sorted by zIndex before emit.
 */
export type Phase1DomWalkStep =
  | "enumerate_slide_roots"
  | "collect_visible_boxes"
  | "map_computed_style_to_rich_shape"
  | "sort_by_z_index";

/** Marker for Phase 1 instrumentation — replace with real metrics when extraction lands. */
export const PHASE1_PIPELINE_ORDER: readonly Phase1DomWalkStep[] = [
  "enumerate_slide_roots",
  "collect_visible_boxes",
  "map_computed_style_to_rich_shape",
  "sort_by_z_index",
] as const;

/**
 * Phase 1 entry point — walk DOM, capture each visible element as a RichShape.
 * NOT YET IMPLEMENTED.
 */
export async function extractRichSlideData(
  _page: Page,
  _selector: string,
  _slideRange?: [number, number],
): Promise<RichSlideData[]> {
  throw new NotImplementedError(
    "extractRichSlideData is not yet implemented. See docs/pptx-rich-roadmap.md for the plan.",
  );
}

/**
 * Phase 1 + emit — generate a fully rich PPTX from RichSlideData.
 * NOT YET IMPLEMENTED.
 */
export async function generateRichNativePptx(
  _slidesData: RichSlideData[],
  _widthPx: number,
  _heightPx: number,
  _outPath: string,
): Promise<{ path: string; warnings: string[] }> {
  throw new NotImplementedError(
    "generateRichNativePptx is not yet implemented. Set pptxMode: 'image' for pixel-perfect output, " +
      "or 'native' for text-only export.",
  );
}
