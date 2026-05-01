import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { renderSlides, type ImageFormat } from "slideshot";
import { defaultOutDir, resolveFormats, formatSummary } from "../helpers.js";
import { getCachedHtml, isDiscoveryDone, isCreateDone } from "../cache.js";
import { savePrefs } from "../preferences.js";

export async function handleRender(args: {
  htmlPath?: string;
  html?: string;
  selector?: string;
  width?: number;
  height?: number;
  scale?: number;
  formats?: string[];
  webpQuality?: number;
  outDir?: string;
  pdfFilename?: string;
  pptxFilename?: string;
  slideRange?: [number, number];
  orientation?: "portrait" | "landscape";
  pptxMode?: "native" | "image" | "rich-native";
}) {
  const hasExistingFile = args.htmlPath && fs.existsSync(args.htmlPath);
  const hasInlineHtml = !!args.html;

  if (!hasExistingFile && !hasInlineHtml) {
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
  }

  try {
    let { htmlPath, html } = args;
    let usedCache = false;

    if (!htmlPath && !html) {
      const cached = getCachedHtml();
      if (cached) {
        html = cached.html;
        htmlPath = cached.htmlPath;
        usedCache = true;
      } else {
        throw new Error("No htmlPath or html provided and no cached HTML. Call create_slides first.");
      }
    }

    let pptxOrientationWarning: string | undefined;
    const resolvedFormats = resolveFormats(args.formats as ImageFormat[] | undefined);
    if (resolvedFormats.includes("pptx") && args.orientation === "portrait") {
      pptxOrientationWarning = "PPTX requested with portrait orientation (540x675). Standard presentations use landscape (1920x1080). Consider orientation: 'landscape' for better PowerPoint compatibility.";
    }

    if (!html && !htmlPath) {
      throw new Error("Provide either `html` (string) or `htmlPath` (absolute file path).");
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
      selector: args.selector,
      width: args.width,
      height: args.height,
      formats: resolvedFormats,
      outDir: resolvedOutDir,
      scale: args.scale,
      webpQuality: args.webpQuality,
      ...(args.slideRange && { slideRange: args.slideRange }),
      ...(args.pdfFilename && { pdfFilename: args.pdfFilename }),
      ...(args.pptxFilename && { pptxFilename: args.pptxFilename }),
      ...(args.orientation && { orientation: args.orientation }),
      ...(args.pptxMode && { pptxMode: args.pptxMode }),
    };

    if (effectiveHtmlPath) {
      renderOpts.htmlPath = effectiveHtmlPath;
    } else if (html) {
      const tmpFile = path.join(os.tmpdir(), `slideshot-${Date.now()}.html`);
      fs.writeFileSync(tmpFile, html, "utf-8");
      renderOpts.htmlPath = tmpFile;
      htmlPathFallback = true;
    }

    const result = await renderSlides(renderOpts as any);

    if (htmlPathFallback && renderOpts.htmlPath) {
      try { fs.unlinkSync(renderOpts.htmlPath as string); } catch {}
    }

    // Persist last successful formats for next session (postmortem roadmap #5).
    try {
      const formatList = (renderOpts.formats as string[] | undefined) || ["pdf"];
      savePrefs({ lastFormats: formatList });
    } catch {
      // pref-write failures must never break the render flow
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
        ...(htmlPathFallback && { htmlPathFallback: true, note: "htmlPath was inaccessible; used html string via temp file" }),
        ...(result.nativeFallbackUsed && {
          nativeFallbackUsed: true,
          pptxNote: "PPTX was generated using image mode (native text extraction encountered issues). Text may not be editable in PowerPoint.",
        }),
        ...(result.nativeWarnings && result.nativeWarnings.length > 0 && {
          nativeWarnings: result.nativeWarnings,
        }),
        ...(pptxOrientationWarning && { pptxOrientationWarning }),
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
