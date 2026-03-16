#!/usr/bin/env node

import { Command } from "commander";
import { renderSlides, type ImageFormat } from "./core.js";
import path from "node:path";
import fs from "node:fs";

const GENERIC_PROMPT = `You are generating HTML slides for a visual carousel (LinkedIn, Instagram, presentations).

RULES:
1. Create a single HTML file with a <style> block and a <body> containing multiple slide divs.
2. Each slide MUST use the CSS class ".slide" and have fixed dimensions: width: 540px; height: 675px.
3. Use overflow: hidden on each slide — content must fit within the frame.
4. Use Google Fonts via <link> tags in <head> if you need custom fonts.
5. Each slide must be visually self-contained — no JavaScript required.
6. Use print-safe colors (avoid transparency-only effects).

Template:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; padding: 48px; display: flex; flex-direction: column; gap: 40px; align-items: flex-start; }
    .slide { position: relative; width: 540px; height: 675px; padding: 32px 40px; overflow: hidden; font-family: 'Inter', sans-serif; flex-shrink: 0; background: #fff; }
  </style>
</head>
<body>
  <div class="slide"><!-- Slide 1 --></div>
  <div class="slide"><!-- Slide 2 --></div>
</body>
</html>

The tool will screenshot each .slide element at 4x resolution (2160x2700 px).
Run: npx slideshot output.html --formats png,webp,pdf`;

const BRANDED_PROMPT = `You are generating HTML slides using the "Ketan Slides" design system — a minimal, monospace carousel style.

DESIGN TOKENS: Font: Space Mono | Teal: #00B894 | Coral: #E84C1E | Purple: #7C5CBF | Dark: #1A1A1A | Light BG: #F0EDE7

SLIDE BASE: .slide { width: 540px; height: 675px; background: #F0EDE7; padding: 32px 40px 52px; }
DARK VARIANT: .slide.dark { background: #0D0D0D; }

COMPONENTS: .dots+.dot, .btag, .h1/.h2 (<i>=teal, <s>=muted), .lbl, .ft (footer), .scols+.sc (stat cards), .itrow+.it (icon tiles), .ul+.ur (list rows), .br (bar chart), .cg+.cbad+.cgood (comparison), .hg+.hc (hook cards), .cr+.ck+.cv (config rows), .al+.ai (action list), .mg+.mc (metric grid), .hr, .pnote, .lrow+.lchip

FULL CSS (include in <style>):
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1A1A1A;padding:48px;font-family:'Space Mono',monospace;display:flex;flex-direction:column;align-items:flex-start;gap:40px;}
.slide{position:relative;width:540px;height:675px;background:#F0EDE7;padding:32px 40px 52px;overflow:hidden;font-family:'Space Mono',monospace;flex-shrink:0;}
.slide::before{content:'';position:absolute;top:24px;right:24px;width:80px;height:80px;border-top:1px solid #B8B4AD;border-right:1px solid #B8B4AD;pointer-events:none;}
.slide::after{content:'';position:absolute;bottom:24px;left:24px;width:60px;height:60px;border-bottom:1px solid #B8B4AD;border-left:1px solid #B8B4AD;pointer-events:none;}
.dark{background:#0D0D0D;}.dark::before{border-color:#252525;}.dark::after{border-color:#252525;}
.dots{display:flex;gap:5px;margin-bottom:18px;}.dot{width:17px;height:17px;border-radius:50%;background:#C8C4BC;display:flex;align-items:center;justify-content:center;font-size:6.5px;font-weight:700;color:transparent;}.dot.on{background:#1A1A1A;color:#FFF;}.dot.tl{background:#00B894;color:#FFF;}
.ft{position:absolute;bottom:0;left:0;right:0;padding:0 24px 8px;display:flex;justify-content:space-between;align-items:flex-end;}.ft-l{display:flex;gap:1px;}.ft-pl{font-size:8.5px;color:#888;letter-spacing:.12em;text-transform:uppercase;}.ft-h{font-size:8.5px;font-weight:700;color:#1A1A1A;}.ft-sw{font-size:8.5px;color:#888;}
.btag{display:inline-flex;align-items:center;gap:7px;background:#1A1A1A;border-radius:100px;padding:5px 12px 5px 8px;margin-bottom:16px;}.bdot{width:8px;height:8px;background:#E84C1E;border-radius:50%;}.btxt{font-size:8.5px;font-weight:700;color:#FFF;letter-spacing:.12em;text-transform:uppercase;}.burl{font-size:8.5px;color:#555;}
.h1{font-size:72px;font-weight:700;line-height:1.0;margin-bottom:18px;color:#1A1A1A;letter-spacing:-.02em;}.h1 i{color:#00B894;font-style:italic;}.h1 s{color:#C0BCB5;text-decoration:none;}
.h2{font-size:46px;font-weight:700;line-height:1.05;margin-bottom:14px;letter-spacing:-.02em;color:#1A1A1A;}.h2 i{color:#00B894;font-style:italic;}.h2 s{color:#C0BCB5;text-decoration:none;}
.lbl{font-size:10px;color:#888;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;}
.scols{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:13px;}.sc{background:#FFF;border:.5px solid #DEDAD4;border-radius:6px;padding:11px 10px;}.sn{font-size:24px;font-weight:700;line-height:1;}.sb{width:24px;height:2px;background:#1A1A1A;margin:5px 0;}.sk{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;}.sd{font-size:7.5px;color:#888;margin-top:2px;}

Include <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> in <head>.
The tool screenshots each .slide at 4x (2160x2700 px).
Run: npx slideshot output.html --formats png,webp,pdf`;

const program = new Command();

program
  .name("slideshot")
  .description("Convert HTML slides to high-res PNG, WebP, and PDF")
  .version("2.0.0");

program
  .command("prompt [variant]")
  .description("Print the AI prompt template (generic or branded)")
  .action((variant?: string) => {
    const v = variant?.toLowerCase() ?? "generic";
    if (v === "branded") {
      console.log(BRANDED_PROMPT);
    } else {
      console.log(GENERIC_PROMPT);
    }
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
