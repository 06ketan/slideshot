import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { renderSlides, type ImageFormat } from "slideshot";
import { defaultOutDir, resolveFormats, formatSummary } from "../helpers.js";
import { getCachedHtml, isDiscoveryDone, isApproved } from "../cache.js";

export async function handleRender(args: {
  html?: string;
  htmlPath?: string;
  selector?: string;
  width?: number;
  height?: number;
  scale?: number;
  formats?: string[];
  outDir?: string;
  pdfFilename?: string;
  pptxFilename?: string;
  slideRange?: [number, number];
  orientation?: "portrait" | "landscape";
  pptxMode?: "native" | "image";
}) {
  if (!isDiscoveryDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "DISCOVERY_REQUIRED",
          instruction: "Call create_slides with step='discover' first. You MUST present themes to the user and ask for their preferences before rendering.",
        }),
      }],
      isError: true,
    };
  }

  if (!isApproved()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "APPROVAL_REQUIRED",
          instruction: "User has not approved the slides yet. You MUST: 1) Create an artifact with the HTML for live preview (right panel, Code/Preview tabs), 2) Explicitly ask 'Does this look good? Should I render the final output?', 3) Wait for the user to confirm, 4) Call create_slides with step='review' to confirm approval, THEN call render_html_to_images.",
        }),
      }],
      isError: true,
    };
  }

  try {
    let { html, htmlPath } = args;
    const { selector, width, height, scale, formats, outDir, pdfFilename, pptxFilename, slideRange, orientation, pptxMode } = args;

    let pptxOrientationWarning: string | undefined;
    if (formats?.includes("pptx") && orientation === "portrait") {
      pptxOrientationWarning = "PPTX requested with portrait orientation (540x675). Standard presentations use landscape (1920x1080). Consider orientation: 'landscape' for better PowerPoint compatibility.";
    }

    let usedCache = false;
    if (!html && !htmlPath) {
      const cached = getCachedHtml();
      if (cached) {
        html = cached.html;
        htmlPath = cached.htmlPath;
        usedCache = true;
      } else {
        throw new Error("Provide either `html` (string) or `htmlPath` (absolute file path). No cached HTML available — call assemble_slides or create_slides preview first.");
      }
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
      selector, width, height, scale,
      formats: resolvedFormats,
      outDir: resolvedOutDir,
      ...(pdfFilename && { pdfFilename }),
      ...(pptxFilename && { pptxFilename }),
      ...(slideRange && { slideRange }),
      ...(orientation && { orientation }),
      ...(pptxMode && { pptxMode }),
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

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; data: string; mimeType: string }
    > = [];

    const fileList = result.files.map((f: string) => path.basename(f));
    const hasPdf = resolvedFormats.includes("pdf");
    const hasPptx = resolvedFormats.includes("pptx");

    content.push({
      type: "text" as const,
      text: JSON.stringify({
        success: true,
        slideCount: result.slideCount,
        outDir: absOutDir,
        openFolder: `file://${absOutDir}`,
        files: result.files,
        formatSummary: formatSummary(result.files),
        instruction: `Rendered ${result.slideCount} slides to ${fileList.join(", ")}. Tell user: files saved to ${absOutDir}.${hasPdf ? " PDF can be opened directly from the file path." : ""}${hasPptx ? " PPTX can be opened in PowerPoint or Google Slides." : ""} Provide the folder link so user can access files.`,
        ...(outDirFallback && { outDirFallback: true, requestedOutDir }),
        ...(usedCache && { usedCache: true, note: "Used cached HTML from last assemble/preview call" }),
        ...(htmlPathFallback && { htmlPathFallback: true, htmlPathNote: "htmlPath was inaccessible; used html string via temp file" }),
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

    const hasRasterFormats = resolvedFormats.some(f => f === "png" || f === "webp");
    if (hasRasterFormats) {
      const previewFile = result.files.find(f => f.endsWith(".webp") || f.endsWith(".png"));
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
