"use client";

import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Copy, Check, RefreshCw, Download } from "lucide-react";

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
type PromptVariant = "generic" | "branded" | "instagram-carousel" | "infographic" | "pitch-deck" | "dark-modern" | "editorial" | "obsio-carousel";

const VARIANT_META: Record<PromptVariant, { name: string; style: string; palette: string[] }> = {
  generic: { name: "Clean Minimal", style: "Inter, white/black", palette: ["#FFFFFF", "#1A1A1A", "#F5F5F5"] },
  branded: { name: "Monospace", style: "Space Mono, teal accents", palette: ["#F0EDE7", "#00B894", "#1A1A1A"] },
  "instagram-carousel": { name: "Bold Social", style: "Poppins, warm orange", palette: ["#FF6B35", "#1A1A1A", "#FFF8F0"] },
  infographic: { name: "Data Cards", style: "DM Sans, green/amber", palette: ["#10B981", "#F59E0B", "#1A1A1A"] },
  "pitch-deck": { name: "Corporate", style: "Inter, dark headers, red", palette: ["#0A0A0A", "#FF4444", "#E8E8E8"] },
  "dark-modern": { name: "Dark Neon", style: "Coral/gold on dark", palette: ["#0A0A0F", "#FF6B6B", "#FFC107"] },
  editorial: { name: "Editorial", style: "Serif, gold accents", palette: ["#FAF8F5", "#C9963B", "#2C2824"] },
  "obsio-carousel": { name: "Browser Shell", style: "Bebas Neue, browser chrome", palette: ["#FFD233", "#12122A", "#0A0A0A"] },
};

export default function EditorPage() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [tab, setTab] = useState<Tab>("editor");
  const [promptVariant, setPromptVariant] = useState<PromptVariant>("generic");
  const [promptText, setPromptText] = useState<string>("Loading...");
  const [promptLoading, setPromptLoading] = useState(false);
  const [selector, setSelector] = useState(".slide");
  const [width, setWidth] = useState(540);
  const [height, setHeight] = useState(675);
  const [scale, setScale] = useState(4);
  const [formats, setFormats] = useState({ png: true, webp: true, pdf: true });
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setPromptLoading(true);
    fetch(`/api/prompt?variant=${promptVariant}`)
      .then((r) => r.json())
      .then((d) => setPromptText(d.prompt || d.error || "Not found"))
      .catch(() => setPromptText("Failed to load prompt"))
      .finally(() => setPromptLoading(false));
  }, [promptVariant]);

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
        body: JSON.stringify({ html, selector, width, height, scale, formats: selectedFormats }),
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
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFFDF5]">
      <Navbar />

      {/* Controls bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b-[3px] border-[#0A0A0A] bg-[#FFFDF5] shrink-0 flex-wrap">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-[#666] font-bold">Selector</span>
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            className="bg-white border-[3px] border-[#0A0A0A] px-2 py-1 w-24 text-xs font-mono text-[#0A0A0A] focus:border-[#FFD233]"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-[#666] font-bold">W</span>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
            className="bg-white border-[3px] border-[#0A0A0A] px-2 py-1 w-16 text-xs font-mono text-[#0A0A0A] focus:border-[#FFD233]"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-[#666] font-bold">H</span>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(+e.target.value)}
            className="bg-white border-[3px] border-[#0A0A0A] px-2 py-1 w-16 text-xs font-mono text-[#0A0A0A] focus:border-[#FFD233]"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
          <span className="text-[#666] font-bold">Scale</span>
          <select
            value={scale}
            onChange={(e) => setScale(+e.target.value)}
            className="bg-white border-[3px] border-[#0A0A0A] px-2 py-1 text-xs font-mono text-[#0A0A0A] focus:border-[#FFD233]"
          >
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <option key={s} value={s}>{s}x</option>
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
                className="accent-[#FFD233]"
              />
              <span className="uppercase text-[#666] tracking-wider font-bold">{f}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="bg-[#0A0A0A] text-[#FFD233] font-mono font-bold text-xs px-3 py-1 border-[3px] border-[#0A0A0A]">
            {width * scale} × {height * scale}
          </span>
          <span className="bg-[#FFD233] text-[#0A0A0A] font-black text-xs px-2 py-1 border-[3px] border-[#0A0A0A]">
            {scale}x
          </span>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 bg-[#FFD233] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-5 py-2 border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-wait transition-all"
          >
            <Download size={12} />
            {exporting ? "EXPORTING..." : "EXPORT"}
          </button>
        </div>
        {status && (
          <span className="text-xs font-mono text-[#0A0A0A] font-bold uppercase tracking-wider">
            {status}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Code/Prompts */}
        <div className="flex flex-col w-1/2 border-r-[3px] border-[#0A0A0A]">
          <div className="flex shrink-0">
            <button
              onClick={() => setTab("editor")}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest font-black font-mono border-r-[3px] border-b-[3px] border-[#0A0A0A] ${
                tab === "editor"
                  ? "bg-[#FFD233] text-[#0A0A0A]"
                  : "text-[#888] bg-[#F5F3EE] hover:bg-[#FFD233]/20"
              }`}
            >
              HTML EDITOR
            </button>
            <button
              onClick={() => setTab("prompts")}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest font-black font-mono border-b-[3px] border-[#0A0A0A] ${
                tab === "prompts"
                  ? "bg-[#FFD233] text-[#0A0A0A]"
                  : "text-[#888] bg-[#F5F3EE] hover:bg-[#FFD233]/20"
              }`}
            >
              AI PROMPTS
            </button>
            <div className="flex-1 border-b-[3px] border-[#0A0A0A] bg-[#FFFDF5]" />
          </div>

          {tab === "editor" ? (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full p-4 bg-[#12122A] text-[#D4D4D8] font-mono text-xs leading-relaxed resize-none border-none focus:outline-none"
              placeholder="Paste your HTML here..."
            />
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b-[3px] border-[#0A0A0A] bg-[#FFFDF5] flex-wrap">
                {(Object.keys(VARIANT_META) as PromptVariant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setPromptVariant(v)}
                    className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 font-mono flex items-center gap-1.5 border-[3px] transition-all ${
                      promptVariant === v
                        ? "bg-[#FFD233] text-[#0A0A0A] border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A]"
                        : "text-[#888] border-[#E5E3DE] hover:border-[#0A0A0A]"
                    }`}
                  >
                    <span className="flex gap-0.5">
                      {VARIANT_META[v].palette.slice(0, 3).map((c, i) => (
                        <span key={i} className="w-2 h-2 inline-block border border-[#0A0A0A]" style={{ background: c }} />
                      ))}
                    </span>
                    {VARIANT_META[v].name}
                  </button>
                ))}
                <button
                  onClick={copyPrompt}
                  className="ml-auto flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold bg-[#FFD233] text-[#0A0A0A] border-[3px] border-[#0A0A0A] px-3 py-1.5 shadow-[3px_3px_0px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "COPIED!" : "COPY PROMPT"}
                </button>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#12122A]">
                <div className="flex gap-[5px]">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#FF6059]" />
                  <div className="w-[8px] h-[8px] rounded-full bg-[#FEBC2E]" />
                  <div className="w-[8px] h-[8px] rounded-full bg-[#2A2A44]" />
                </div>
                <span className="text-[10px] font-mono text-white/50 ml-2">
                  {promptVariant}.md
                </span>
              </div>
              <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-[#D4D4D8] font-mono whitespace-pre-wrap bg-[#12122A]">
                {promptLoading ? "Loading..." : promptText}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col w-1/2 bg-[#FFFDF5]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b-[3px] border-[#0A0A0A] bg-[#F5F3EE] shrink-0">
            <span className="text-xs uppercase tracking-widest text-[#666] font-bold">
              PREVIEW
            </span>
            <button
              onClick={updatePreview}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#0A0A0A] border-[3px] border-[#0A0A0A] px-3 py-1 shadow-[3px_3px_0px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all bg-white"
            >
              <RefreshCw size={12} />
              REFRESH
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 flex justify-center bg-[#F5F3EE]">
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white"
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
