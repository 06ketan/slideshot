"use client";

import { useState, useRef, useCallback } from "react";

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1A1A1A;padding:48px;font-family:'Space Mono',monospace;display:flex;flex-direction:column;align-items:flex-start;gap:40px;}
.slide{position:relative;width:540px;height:675px;background:#F0EDE7;padding:32px 40px 52px;overflow:hidden;font-family:'Space Mono',monospace;flex-shrink:0;}
.slide::before{content:'';position:absolute;top:24px;right:24px;width:80px;height:80px;border-top:1px solid #B8B4AD;border-right:1px solid #B8B4AD;pointer-events:none;}
.slide::after{content:'';position:absolute;bottom:24px;left:24px;width:60px;height:60px;border-bottom:1px solid #B8B4AD;border-left:1px solid #B8B4AD;pointer-events:none;}
.h1{font-size:72px;font-weight:700;line-height:1.0;margin-bottom:18px;color:#1A1A1A;letter-spacing:-.02em;}
.h1 i{color:#00B894;font-style:italic;}
.h1 s{color:#C0BCB5;text-decoration:none;}
.lbl{font-size:10px;color:#888;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;}
.ft{position:absolute;bottom:0;left:0;right:0;padding:0px 24px 8px;display:flex;justify-content:space-between;align-items:flex-end;}
.ft-h{font-size:8.5px;font-weight:700;color:#1A1A1A;}
.ft-sw{font-size:8.5px;color:#888;}
</style>
</head>
<body>
<div class="slide">
  <div class="lbl">Welcome</div>
  <div class="h1">Paste your<br><i>HTML</i><br><s>here.</s></div>
  <div style="margin-top:20px;font-size:11px;color:#888;line-height:1.6;">
    This is a sample slide. Replace this HTML with<br>
    your own AI-generated carousel content.<br><br>
    Each <code style="background:#E8E5DF;padding:2px 6px;border-radius:3px;font-size:10px;">.slide</code> element becomes one image.
  </div>
  <div class="ft">
    <span class="ft-h">slideshot</span>
    <span class="ft-sw">Export to PNG, WebP, PDF</span>
  </div>
</div>
</body>
</html>`;

type Tab = "editor" | "prompts";
type PromptVariant = "generic" | "branded";

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

The tool will screenshot each .slide element at 4x resolution → 2160×2700 px output.`;

const BRANDED_PROMPT = `You are generating HTML slides using the "Ketan Slides" design system — a minimal, monospace carousel style.

DESIGN TOKENS: Font: Space Mono | Teal: #00B894 | Coral: #E84C1E | Purple: #7C5CBF | Dark: #1A1A1A | Light BG: #F0EDE7

SLIDE BASE: .slide { width: 540px; height: 675px; background: #F0EDE7; padding: 32px 40px 52px; }
DARK VARIANT: .slide.dark { background: #0D0D0D; }

COMPONENTS: .dots+.dot, .btag, .h1/.h2 (<i>=teal, <s>=muted), .lbl, .ft (footer), .scols+.sc (stat cards 3-col), .itrow+.it (icon tiles 4-col), .ul+.ur (list rows), .br+.bl+.bt+.bf (bar chart), .cg+.cc+.cbad+.cgood (comparison), .hg+.hc (hook cards), .cr+.ck+.cv (config rows), .al+.ai (action list), .mg+.mc (metric grid), .hr, .pnote, .lrow+.lchip

Include the full CSS from the branded prompt file and use Space Mono from Google Fonts.
Each .slide is screenshotted at 4x → 2160×2700 px.`;

export default function Home() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [tab, setTab] = useState<Tab>("editor");
  const [promptVariant, setPromptVariant] = useState<PromptVariant>("generic");
  const [selector, setSelector] = useState(".slide");
  const [width, setWidth] = useState(540);
  const [height, setHeight] = useState(675);
  const [scale, setScale] = useState(4);
  const [formats, setFormats] = useState({ png: true, webp: true, pdf: true });
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = useCallback(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  const handleExport = async () => {
    setExporting(true);
    setStatus("Rendering slides...");

    const selectedFormats = Object.entries(formats)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (selectedFormats.length === 0) {
      setStatus("Select at least one format.");
      setExporting(false);
      return;
    }

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          selector,
          width,
          height,
          scale,
          formats: selectedFormats,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setStatus(`Error: ${err.error}`);
        setExporting(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "slides.zip";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Export complete!");
    } catch (err: unknown) {
      setStatus(`Export failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setExporting(false);
    }
  };

  const toggleFormat = (f: keyof typeof formats) =>
    setFormats((prev) => ({ ...prev, [f]: !prev[f] }));

  const copyPrompt = () => {
    const text = promptVariant === "generic" ? GENERIC_PROMPT : BRANDED_PROMPT;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen font-mono">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b-2 border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <h1 className="text-sm font-black tracking-widest uppercase font-mono">
            SLIDESHOT
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/06ketan/slideshot"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-border rounded-none px-2 py-0.5 text-xs font-mono text-muted hover:border-primary hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/slideshot"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-border rounded-none px-2 py-0.5 text-xs font-mono text-muted hover:border-primary hover:text-primary"
          >
            npm
          </a>
          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-border rounded-none px-2 py-0.5 text-xs font-mono text-muted hover:border-primary hover:text-primary"
          >
            API
          </a>
          <span className="border-2 border-border rounded-none px-2 py-0.5 text-xs font-mono text-muted">
            {width * scale} x {height * scale} px
          </span>
          <span className="bg-primary text-black font-black text-xs px-2 py-0.5 rounded-none border-2 border-black">
            {scale}x
          </span>
        </div>
      </header>

      {/* Controls */}
      <div className="flex items-center gap-4 px-5 py-2.5 border-b-2 border-border bg-surface-2 shrink-0 flex-wrap">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-muted">Selector</span>
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            className="bg-background border-2 border-border rounded-none px-2 py-1 w-24 text-xs font-mono text-foreground"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-muted">W</span>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
            className="bg-background border-2 border-border rounded-none px-2 py-1 w-16 text-xs font-mono text-foreground"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-muted">H</span>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(+e.target.value)}
            className="bg-background border-2 border-border rounded-none px-2 py-1 w-16 text-xs font-mono text-foreground"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-muted">Scale</span>
          <select
            value={scale}
            onChange={(e) => setScale(+e.target.value)}
            className="bg-background border-2 border-border rounded-none px-2 py-1 text-xs font-mono text-foreground"
          >
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-3 text-xs font-mono">
          {(["png", "webp", "pdf"] as const).map((f) => (
            <label key={f} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formats[f]}
                onChange={() => toggleFormat(f)}
                className="accent-primary"
              />
              <span className="uppercase text-muted tracking-wider font-bold">{f}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="ml-auto bg-primary text-black font-black text-xs uppercase tracking-widest px-5 py-2 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-wait"
        >
          {exporting ? "EXPORTING..." : "EXPORT"}
        </button>
        {status && (
          <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
            {status}
          </span>
        )}
      </div>

      {/* Footer Bar */}
      <div className="flex items-center justify-between px-5 py-1.5 border-b-2 border-border bg-surface shrink-0">
        <div className="flex items-center gap-4 text-xs font-mono text-muted">
          <span>
            CLI:{" "}
            <code className="text-primary font-bold">npx slideshot ./slides.html</code>
          </span>
          <span className="text-border">|</span>
          <span>
            MCP:{" "}
            <a
              href="https://www.npmjs.com/package/slideshot-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:underline"
            >
              slideshot-mcp
            </a>
            {" "}for Claude / Cursor
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted">
          <a
            href="https://github.com/06ketan/slideshot"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            Star on GitHub
          </a>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Editor + Prompts */}
        <div className="flex flex-col w-1/2 border-r-2 border-border">
          {/* Tabs */}
          <div className="flex border-b-2 border-border shrink-0">
            <button
              onClick={() => setTab("editor")}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest font-black font-mono border-r-2 border-border ${
                tab === "editor"
                  ? "bg-primary text-black"
                  : "text-muted bg-surface hover:bg-surface-2"
              }`}
            >
              HTML EDITOR
            </button>
            <button
              onClick={() => setTab("prompts")}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest font-black font-mono ${
                tab === "prompts"
                  ? "bg-primary text-black"
                  : "text-muted bg-surface hover:bg-surface-2"
              }`}
            >
              AI PROMPTS
            </button>
          </div>

          {tab === "editor" ? (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full p-4 bg-background text-foreground font-mono text-xs leading-relaxed resize-none border-none focus:outline-none"
              placeholder="Paste your HTML here..."
            />
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border">
                <button
                  onClick={() => setPromptVariant("generic")}
                  className={`text-xs uppercase tracking-widest font-black px-3 py-1.5 rounded-none border-2 font-mono ${
                    promptVariant === "generic"
                      ? "bg-primary text-black border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      : "text-muted border-border hover:bg-surface-2"
                  }`}
                >
                  GENERIC
                </button>
                <button
                  onClick={() => setPromptVariant("branded")}
                  className={`text-xs uppercase tracking-widest font-black px-3 py-1.5 rounded-none border-2 font-mono ${
                    promptVariant === "branded"
                      ? "bg-secondary text-white border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      : "text-muted border-border hover:bg-surface-2"
                  }`}
                >
                  BRANDED
                </button>
                <button
                  onClick={copyPrompt}
                  className="ml-auto text-xs uppercase tracking-widest font-black text-foreground font-mono border-2 border-border rounded-none px-3 py-1.5 shadow-[3px_3px_0px_0px_#404040] hover:shadow-[3px_3px_0px_0px_#BFFF00] hover:border-primary active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {copied ? "COPIED!" : "COPY PROMPT"}
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-muted font-mono whitespace-pre-wrap">
                {promptVariant === "generic"
                  ? GENERIC_PROMPT
                  : BRANDED_PROMPT}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col w-1/2 bg-surface">
          <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-border shrink-0">
            <span className="text-xs uppercase tracking-widest text-muted font-black font-mono">
              PREVIEW
            </span>
            <button
              onClick={updatePreview}
              className="text-xs uppercase tracking-widest font-black text-foreground font-mono border-2 border-border rounded-none px-3 py-1 shadow-[3px_3px_0px_0px_#404040] hover:shadow-[3px_3px_0px_0px_#BFFF00] hover:border-primary active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              REFRESH
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 flex justify-center">
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="border-2 border-border rounded-none bg-white"
              style={{ width: width + 96, minHeight: height + 96 }}
              sandbox="allow-same-origin allow-scripts"
              title="Slide preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
