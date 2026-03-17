import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type { ImageFormat } from "slideshot";

export function defaultOutDir(): string {
  if (process.env.SLIDESHOT_OUTPUT_DIR) {
    return process.env.SLIDESHOT_OUTPUT_DIR;
  }

  const home = os.homedir();

  const desktop = path.join(home, "Desktop");
  if (fs.existsSync(desktop)) {
    return path.join(desktop, "slideshot-output");
  }

  const downloads = path.join(home, "Downloads");
  if (fs.existsSync(downloads)) {
    return path.join(downloads, "slideshot-output");
  }

  return path.join(os.tmpdir(), "slideshot-output");
}

export function resolveFormats(formats?: ImageFormat[]): ImageFormat[] {
  if (!formats || formats.length === 0) return ["webp", "pdf"];
  return formats;
}

export function formatSummary(files: string[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const f of files) {
    const ext = path.extname(f).replace(".", "");
    summary[ext] = (summary[ext] || 0) + 1;
  }
  return summary;
}
