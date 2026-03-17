import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { renderSlides, type ImageFormat } from "slideshot";
import { defaultOutDir, resolveFormats, formatSummary } from "../helpers.js";

export async function handleRender(args: {
  html?: string;
  htmlPath?: string;
  selector?: string;
  width?: number;
  height?: number;
  scale?: number;
  formats?: string[];
  outDir?: string;
}) {
  try {
    const { html, htmlPath, selector, width, height, scale, formats, outDir } = args;

    if (!html && !htmlPath) {
      throw new Error("Provide either `html` (string) or `htmlPath` (absolute file path).");
    }

    let resolvedOutDir = outDir || defaultOutDir();
    let outDirFallback = false;
    const requestedOutDir = outDir || null;

    if (outDir) {
      try {
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      } catch {
        resolvedOutDir = defaultOutDir();
        outDirFallback = true;
        if (!fs.existsSync(resolvedOutDir)) fs.mkdirSync(resolvedOutDir, { recursive: true });
      }
    }

    const resolvedFormats = resolveFormats(formats as ImageFormat[] | undefined);

    let effectiveHtml = html;
    let effectiveHtmlPath = htmlPath;
    let htmlPathFallback = false;

    if (htmlPath && !fs.existsSync(htmlPath)) {
      if (html) {
        const tmpFile = path.join(os.tmpdir(), `slideshot-${Date.now()}.html`);
        fs.writeFileSync(tmpFile, html, "utf-8");
        effectiveHtmlPath = tmpFile;
        htmlPathFallback = true;
      } else {
        throw new Error(
          `htmlPath "${htmlPath}" is not accessible from the MCP server process. ` +
          `This often happens in sandboxed environments (e.g. Claude Code) where the MCP server ` +
          `runs in a separate filesystem context. Pass the HTML content via the \`html\` parameter instead.`,
        );
      }
    }

    const renderOpts: Record<string, unknown> = {
      selector,
      width,
      height,
      scale,
      formats: resolvedFormats,
      outDir: resolvedOutDir,
    };

    if (effectiveHtmlPath) {
      renderOpts.htmlPath = effectiveHtmlPath;
    } else {
      renderOpts.html = effectiveHtml;
    }

    const result = await renderSlides(renderOpts as any);

    if (htmlPathFallback && effectiveHtmlPath) {
      try { fs.unlinkSync(effectiveHtmlPath); } catch {}
    }

    const absOutDir = path.resolve(resolvedOutDir);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          success: true,
          slideCount: result.slideCount,
          outDir: absOutDir,
          openFolder: `file://${absOutDir}`,
          files: result.files,
          formatSummary: formatSummary(result.files),
          ...(outDirFallback && { outDirFallback: true, requestedOutDir }),
          ...(htmlPathFallback && { htmlPathFallback: true, note: "htmlPath was inaccessible; used html string via temp file" }),
        }, null, 2),
      }],
    };
  } catch (err: any) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: err.message }),
      }],
      isError: true,
    };
  }
}
