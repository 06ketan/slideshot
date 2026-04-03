import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { renderSlides, type ImageFormat } from "slideshot";
import { defaultOutDir, resolveFormats, formatSummary } from "../helpers.js";
import { getCachedHtml, isDiscoveryDone, isCreateDone } from "../cache.js";

export async function handleRender(args: {
  htmlPath?: string;
  formats?: string[];
  scale?: number;
  slideRange?: [number, number];
  outDir?: string;
  pdfFilename?: string;
}) {
  if (!isDiscoveryDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "DISCOVERY_REQUIRED",
          instruction: "You MUST call discover_themes first, then create_slides, then render_slides. DO NOT skip steps.",
        }),
      }],
      isError: true,
    };
  }

  if (!isCreateDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "CREATE_REQUIRED",
          instruction: "You MUST call create_slides first to generate and save the HTML. Then show the user a preview artifact. Only call render_slides after the user explicitly confirms the preview looks good.",
        }),
      }],
      isError: true,
    };
  }

  try {
    let { htmlPath } = args;
    let html: string | undefined;
    let usedCache = false;

    if (!htmlPath) {
      const cached = getCachedHtml();
      if (cached) {
        html = cached.html;
        htmlPath = cached.htmlPath;
        usedCache = true;
      } else {
        throw new Error("No htmlPath provided and no cached HTML. Call create_slides first.");
      }
    }

    let resolvedOutDir = args.outDir || defaultOutDir();
    let outDirFallback = false;

    if (args.outDir) {
      try {
        if (!fs.existsSync(args.outDir)) fs.mkdirSync(args.outDir, { recursive: true });
      } catch {
        resolvedOutDir = defaultOutDir();
        outDirFallback = true;
        if (!fs.existsSync(resolvedOutDir)) fs.mkdirSync(resolvedOutDir, { recursive: true });
      }
    }

    if (!fs.existsSync(resolvedOutDir)) {
      fs.mkdirSync(resolvedOutDir, { recursive: true });
    }

    const resolvedFormats = resolveFormats(args.formats as ImageFormat[] | undefined);

    let effectiveHtmlPath = htmlPath;
    let htmlPathFallback = false;

    if (htmlPath && !fs.existsSync(htmlPath)) {
      if (html) {
        const tmpFile = path.join(os.tmpdir(), `slideshot-${Date.now()}.html`);
        fs.writeFileSync(tmpFile, html, "utf-8");
        effectiveHtmlPath = tmpFile;
        htmlPathFallback = true;
      } else {
        const cached = getCachedHtml();
        if (cached) {
          const tmpFile = path.join(os.tmpdir(), `slideshot-${Date.now()}.html`);
          fs.writeFileSync(tmpFile, cached.html, "utf-8");
          effectiveHtmlPath = tmpFile;
          htmlPathFallback = true;
        } else {
          throw new Error(
            `htmlPath "${htmlPath}" is not accessible. This often happens in sandboxed environments. ` +
            `Call create_slides again to regenerate the HTML.`,
          );
        }
      }
    }

    const renderOpts: Record<string, unknown> = {
      formats: resolvedFormats,
      outDir: resolvedOutDir,
      scale: args.scale,
      ...(args.slideRange && { slideRange: args.slideRange }),
      ...(args.pdfFilename && { pdfFilename: args.pdfFilename }),
    };

    if (effectiveHtmlPath) {
      renderOpts.htmlPath = effectiveHtmlPath;
    } else {
      renderOpts.html = html;
    }

    const result = await renderSlides(renderOpts as any);

    if (htmlPathFallback && effectiveHtmlPath) {
      try { fs.unlinkSync(effectiveHtmlPath); } catch {}
    }

    const absOutDir = path.resolve(resolvedOutDir);

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; data: string; mimeType: string }
    > = [];

    const fileList = result.files.map((f: string) => path.basename(f));
    const hasPdf = resolvedFormats.includes("pdf");

    content.push({
      type: "text" as const,
      text: JSON.stringify({
        success: true,
        slideCount: result.slideCount,
        outDir: absOutDir,
        openFolder: `file://${absOutDir}`,
        files: result.files,
        formatSummary: formatSummary(result.files),
        instruction: `Rendered ${result.slideCount} slides to ${fileList.join(", ")}. Tell the user: files saved to ${absOutDir}.${hasPdf ? " PDF can be opened directly." : ""} Provide the folder path.`,
        ...(outDirFallback && { outDirFallback: true }),
        ...(usedCache && { usedCache: true }),
        ...(htmlPathFallback && { htmlPathFallback: true }),
      }, null, 2),
    });

    const hasRaster = resolvedFormats.some(f => f === "png" || f === "webp");
    if (hasRaster) {
      const previewFile = result.files.find((f: string) => f.endsWith(".webp") || f.endsWith(".png"));
      if (previewFile && fs.existsSync(previewFile)) {
        try {
          const data = fs.readFileSync(previewFile).toString("base64");
          const mimeType = previewFile.endsWith(".webp") ? "image/webp" : "image/png";
          content.push({ type: "image" as const, data, mimeType });
        } catch {}
      }
    }

    return { content };
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
