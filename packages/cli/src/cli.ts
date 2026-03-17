#!/usr/bin/env node

import { Command } from "commander";
import { renderSlides, type ImageFormat } from "./index.js";
import path from "node:path";
import fs from "node:fs";

const VARIANTS = [
  "generic", "branded", "instagram-carousel", "infographic",
  "pitch-deck", "dark-modern", "editorial",
] as const;

function promptsDir(): string {
  const thisDir = path.dirname(new URL(import.meta.url).pathname);
  const bundled = path.resolve(thisDir, "../prompts");
  if (fs.existsSync(bundled)) return bundled;
  return path.resolve(thisDir, "../../../prompts");
}

function loadPrompt(variant: string): string {
  const filePath = path.join(promptsDir(), `${variant}.md`);
  if (!fs.existsSync(filePath)) {
    return `Prompt variant "${variant}" not found. Available: ${VARIANTS.join(", ")}`;
  }
  return fs.readFileSync(filePath, "utf-8");
}

const program = new Command();

program
  .name("slideshot")
  .description("Convert HTML slides to high-res PNG, WebP, and PDF")
  .version("2.4.0");

program
  .command("prompt [variant]")
  .description(`Print an AI prompt template. Variants: ${VARIANTS.join(", ")}`)
  .action((variant?: string) => {
    const v = variant?.toLowerCase() ?? "generic";
    console.log(loadPrompt(v));
  });

program
  .argument("[file]", "Path to HTML file")
  .option("-s, --selector <sel>", "CSS selector for slides", ".slide")
  .option("-W, --width <n>", "Slide width in CSS pixels", "540")
  .option("-H, --height <n>", "Slide height in CSS pixels", "675")
  .option("--scale <n>", "Device scale factor (2-6)", "4")
  .option("-f, --formats <list>", "Comma-separated: png,webp,pdf", "png,webp,pdf")
  .option("-q, --quality <n>", "WebP quality (0-100)", "95")
  .option("-o, --out <dir>", "Output directory", "./slides")
  .action(async (file: string | undefined, opts) => {
    if (!file) {
      program.help();
      return;
    }

    const htmlPath = path.resolve(file);
    if (!fs.existsSync(htmlPath)) {
      console.error(`File not found: ${htmlPath}`);
      process.exit(1);
    }

    const formats = opts.formats.split(",").map((f: string) => f.trim()) as ImageFormat[];
    const width = parseInt(opts.width, 10);
    const height = parseInt(opts.height, 10);
    const scale = parseInt(opts.scale, 10);
    const quality = parseInt(opts.quality, 10);

    console.log(`\n  slideshot`);
    console.log(`  ──────────────────────────────`);
    console.log(`  File:     ${htmlPath}`);
    console.log(`  Selector: ${opts.selector}`);
    console.log(`  Size:     ${width}×${height} @ ${scale}× → ${width * scale}×${height * scale} px`);
    console.log(`  Formats:  ${formats.join(", ")}`);
    console.log(`  Output:   ${path.resolve(opts.out)}\n`);

    try {
      const result = await renderSlides({
        htmlPath,
        selector: opts.selector,
        width,
        height,
        scale,
        formats,
        webpQuality: quality,
        outDir: opts.out,
      });

      for (const f of result.files) {
        const kb = (fs.statSync(f).size / 1024).toFixed(0);
        console.log(`  ✓  ${path.basename(f)}  ${kb} KB`);
      }

      console.log(`\n  Done! ${result.slideCount} slides → ${result.files.length} files\n`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`\n  Error: ${message}\n`);
      process.exit(1);
    }
  });

program.parse();
