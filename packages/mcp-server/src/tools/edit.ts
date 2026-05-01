import fs from "node:fs";
import * as cheerio from "cheerio";
import { getCachedHtml } from "../cache.js";
import { saveHtml } from "../save.js";

/**
 * Token-efficient partial editor for HTML decks (postmortem SS-005).
 *
 * Without this tool, every slide tweak requires regenerating the entire
 * 6500-token HTML document. With it:
 *   - `swap_token` for a brand color: ~50 tokens
 *   - `replace_slide` for one slide rewrite: ~600-1200 tokens
 *   - `patch_css` for a typography tweak: ~200 tokens
 *
 * All ops are idempotent in failure: if no match is found we return ok:false
 * with a clear error and leave the file untouched.
 */

type EditArgs = {
  htmlPath?: string;
  operation: "replace_slide" | "patch_css" | "swap_token" | "patch_class";
  slideIndex?: number;
  payload: string | Record<string, string>;
};

function loadHtml(htmlPath?: string): { html: string; htmlPath: string } {
  if (htmlPath && fs.existsSync(htmlPath)) {
    return { html: fs.readFileSync(htmlPath, "utf-8"), htmlPath };
  }
  const cached = getCachedHtml();
  if (cached) return cached;
  throw new Error(
    "NO_HTML_AVAILABLE: pass htmlPath explicitly or call create_slides first.",
  );
}

function asString(p: unknown, op: string): string {
  if (typeof p !== "string") {
    throw new Error(`${op} requires a string payload, got ${typeof p}`);
  }
  return p;
}

function asMap(p: unknown, op: string): Record<string, string> {
  if (!p || typeof p !== "object" || Array.isArray(p)) {
    throw new Error(`${op} requires an object payload {key: value}, got ${typeof p}`);
  }
  return p as Record<string, string>;
}

function replaceSlide(html: string, slideIndex: number, replacement: string): string {
  const $ = cheerio.load(html, { xml: { decodeEntities: false } });
  const slides = $(".slide");
  if (slideIndex < 1 || slideIndex > slides.length) {
    throw new Error(
      `slideIndex out of range: deck has ${slides.length} slides, asked for ${slideIndex}`,
    );
  }
  $(slides[slideIndex - 1]).replaceWith(replacement);
  return $.html();
}

function patchCss(html: string, css: string): string {
  // Append the new rules to the LAST <style> block in <head>.
  // If none exists, inject one.
  const styleClose = html.lastIndexOf("</style>");
  if (styleClose === -1) {
    const headClose = html.indexOf("</head>");
    if (headClose === -1) {
      throw new Error("Document has no <head> or <style> — cannot patch CSS");
    }
    const styleTag = `<style>\n${css}\n</style>\n`;
    return html.slice(0, headClose) + styleTag + html.slice(headClose);
  }
  return html.slice(0, styleClose) + "\n/* edit_slides: patch_css */\n" + css + "\n" + html.slice(styleClose);
}

function swapTokens(html: string, tokens: Record<string, string>): { html: string; replaced: number } {
  let updated = html;
  let replaced = 0;
  for (const [name, value] of Object.entries(tokens)) {
    // Match `--name: <anything>;` (CSS custom property declaration), not usages.
    // Allow optional whitespace; capture the original value so we know what to swap.
    const safeName = name.startsWith("--") ? name : `--${name}`;
    const escaped = safeName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const re = new RegExp(`(${escaped}\\s*:\\s*)([^;\\n}]+)(;|\\n|})`, "g");
    let count = 0;
    updated = updated.replace(re, (_m, prefix, _old, suffix) => {
      count += 1;
      return `${prefix}${value}${suffix}`;
    });
    if (count === 0) {
      throw new Error(`swap_token: CSS variable "${safeName}" not declared in the document`);
    }
    replaced += count;
  }
  return { html: updated, replaced };
}

function patchClass(
  html: string,
  slideIndex: number,
  payload: Record<string, string>,
): string {
  const { add, remove } = payload as { add?: string; remove?: string };
  if (!add && !remove) {
    throw new Error('patch_class requires payload.add or payload.remove (string)');
  }
  const $ = cheerio.load(html, { xml: { decodeEntities: false } });
  const slides = $(".slide");
  if (slideIndex < 1 || slideIndex > slides.length) {
    throw new Error(
      `slideIndex out of range: deck has ${slides.length} slides, asked for ${slideIndex}`,
    );
  }
  const slide = $(slides[slideIndex - 1]);
  if (add) slide.addClass(add);
  if (remove) slide.removeClass(remove);
  return $.html();
}

export async function handleEdit(args: EditArgs) {
  try {
    const { html, htmlPath } = loadHtml(args.htmlPath);
    let nextHtml: string;
    let summary: string;

    switch (args.operation) {
      case "replace_slide": {
        if (!args.slideIndex) {
          throw new Error("replace_slide requires slideIndex (1-indexed)");
        }
        const block = asString(args.payload, "replace_slide");
        if (!/<div[^>]*class\s*=\s*["'][^"']*\bslide\b[^"']*["']/i.test(block)) {
          throw new Error(
            'replace_slide payload must be a <div class="slide">...</div> block',
          );
        }
        nextHtml = replaceSlide(html, args.slideIndex, block);
        summary = `Replaced slide ${args.slideIndex}.`;
        break;
      }
      case "patch_css": {
        const css = asString(args.payload, "patch_css");
        nextHtml = patchCss(html, css);
        summary = `Appended ${css.length} chars of CSS to the last <style> block.`;
        break;
      }
      case "swap_token": {
        const tokens = asMap(args.payload, "swap_token");
        const result = swapTokens(html, tokens);
        nextHtml = result.html;
        summary = `Swapped ${result.replaced} CSS variable declaration${result.replaced === 1 ? "" : "s"}: ${Object.keys(tokens).join(", ")}.`;
        break;
      }
      case "patch_class": {
        if (!args.slideIndex) {
          throw new Error("patch_class requires slideIndex (1-indexed)");
        }
        const map = asMap(args.payload, "patch_class");
        nextHtml = patchClass(html, args.slideIndex, map);
        summary = `Patched class on slide ${args.slideIndex}: ${JSON.stringify(map)}.`;
        break;
      }
      default:
        throw new Error(`Unknown operation: ${args.operation}`);
    }

    if (nextHtml === html) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            ok: false,
            error: "NO_CHANGE",
            message: "Operation produced no change — verify slideIndex and payload.",
          }),
        }],
        isError: true,
      };
    }

    const newHtmlPath = saveHtml(nextHtml);

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: true,
          operation: args.operation,
          summary,
          htmlPath: newHtmlPath,
          previousHtmlPath: htmlPath,
          instruction: `${summary}\n\nSTOP. Show ${newHtmlPath} as a code preview artifact. Ask the user: "Does this look good? Should I render the final PDF?" WAIT for response. Do NOT call render_slides in this turn.`,
        }),
      }],
    };
  } catch (err: any) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ ok: false, error: err.message }),
      }],
      isError: true,
    };
  }
}
