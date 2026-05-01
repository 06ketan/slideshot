import fs from "node:fs";
import path from "node:path";
import { defaultOutDir } from "./helpers.js";
import { cacheHtml, markCreateDone } from "./cache.js";

export function ensureOutDir(): string {
  const dir = defaultOutDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Persist generated HTML to the canonical output directory and update the
 * in-memory cache. Used by both `create_slides` (initial save) and
 * `edit_slides` (rewrite after a patch).
 */
export function saveHtml(html: string, filename = "slides.html"): string {
  const dir = ensureOutDir();
  const htmlPath = path.join(dir, filename);
  fs.writeFileSync(htmlPath, html, "utf-8");
  cacheHtml(html, htmlPath);
  markCreateDone();
  return htmlPath;
}
