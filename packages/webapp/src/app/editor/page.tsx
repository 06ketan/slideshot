"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { RefreshCw, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { trackEvent } from "@/components/TrackEvent";

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1A1A1A;padding:12px;font-family:'Space Mono',monospace;display:flex;flex-direction:column;align-items:flex-start;gap:40px;}
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

export default function EditorPage() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [selector, setSelector] = useState(".slide");
  const [width, setWidth] = useState(540);
  const [height, setHeight] = useState(675);
  const [scale, setScale] = useState(4);
  const [formats, setFormats] = useState({ png: true, webp: true, pdf: true });
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [previewZoom, setPreviewZoom] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const autoFitOnLoad = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc?.body || !iframe) return;
    doc.body.style.zoom = "1";
    const contentW = doc.body.scrollWidth;
    const availableW = iframe.clientWidth - 40;
    if (contentW > availableW && contentW > 0) {
      const fit = Math.floor((availableW / contentW) * 100) / 100;
      doc.body.style.zoom = String(fit);
      setPreviewZoom(fit);
    }
  }, []);

  const updatePreview = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      doc.body.style.zoom = String(previewZoom);
    }
  }, [html, previewZoom]);

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

    trackEvent("export_clicked", { formats: selectedFormats.join(","), scale });

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, selector, width, height, scale, formats: selectedFormats }),
      });

      if (!res.ok) {
        const err = await res.json();
        setStatus(`Error: ${err.error}`);
        trackEvent("export_failed", { error: err.error || "unknown" });
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
      trackEvent("export_completed", { formats: selectedFormats.join(","), scale });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setStatus(`Export failed: ${message}`);
      trackEvent("export_failed", { error: message });
    } finally {
      setExporting(false);
    }
  };

  const toggleFormat = (f: keyof typeof formats) =>
    setFormats((prev) => ({ ...prev, [f]: !prev[f] }));

  const toggleCode = () => {
    if (showCode && !showPreview) return;
    setShowCode((p) => !p);
    setTimeout(zoomFit, 250);
  };

  const togglePreview = () => {
    if (showPreview && !showCode) return;
    const willShow = !showPreview;
    setShowPreview((p) => !p);
    if (willShow) setTimeout(zoomFit, 250);
  };

  const zoomIn = () => setPreviewZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)));
  const zoomOut = () => setPreviewZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(1)));
  const zoomFit = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc?.body || !iframe) return;
    doc.body.style.zoom = "1";
    const contentW = doc.body.scrollWidth;
    const availableW = iframe.clientWidth - 2;
    const fit = contentW > 0 ? Math.min(1, Math.floor((availableW / contentW) * 100) / 100) : 1;
    doc.body.style.zoom = String(fit);
    setPreviewZoom(fit);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc?.body) return;
    doc.body.style.zoom = String(previewZoom);
  }, [previewZoom]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute("content") || "";
    meta?.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
    return () => { meta?.setAttribute("content", original); };
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-[#FFFDF5] overflow-hidden" style={{ touchAction: "manipulation" }}>
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
            className="flex items-center gap-1.5 bg-[#FFD233] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-5 py-2 border-[3px] border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-wait transition-all duration-150"
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
        {/* Left: Code editor */}
        <div
          className={`flex flex-col border-r-[3px] border-[#0A0A0A] transition-all duration-200 ease-in-out min-h-0 ${
            !showCode ? "w-0 overflow-hidden border-r-0" : showPreview ? "w-1/2" : "w-full"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#12122A] shrink-0 border-b-[3px] border-[#0A0A0A]">
            <div className="flex gap-[6px]">
              <div className="w-[10px] h-[10px] rounded-full bg-[#FF6059]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#2A2A44]" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#FFD233] uppercase tracking-widest ml-2">
              HTML Editor
            </span>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-4 bg-[#12122A] text-[#D4D4D8] font-mono text-xs leading-relaxed resize-none border-none focus:outline-none min-h-0"
            placeholder="Paste your HTML here..."
          />
        </div>

        {/* Collapse divider */}
        <div className="flex flex-col items-center justify-center bg-[#F5F3EE] border-r-[3px] border-[#0A0A0A] shrink-0 w-8 gap-1">
          <button
            onClick={toggleCode}
            className={`w-6 h-6 flex items-center justify-center border-2 border-[#0A0A0A] transition-all duration-150 ${
              showCode && !showPreview
                ? "bg-[#E5E3DE] text-[#aaa] cursor-not-allowed"
                : "bg-[#FFD233] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FFD233]"
            }`}
            title={showCode ? "Collapse code" : "Expand code"}
          >
            {showCode ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          </button>
          <button
            onClick={togglePreview}
            className={`w-6 h-6 flex items-center justify-center border-2 border-[#0A0A0A] transition-all duration-150 ${
              showPreview && !showCode
                ? "bg-[#E5E3DE] text-[#aaa] cursor-not-allowed"
                : "bg-[#FFD233] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FFD233]"
            }`}
            title={showPreview ? "Collapse preview" : "Expand preview"}
          >
            {showPreview ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Right: Preview */}
        <div
          className={`flex flex-col bg-[#FFFDF5] transition-all duration-200 ease-in-out min-h-0 ${
            !showPreview ? "w-0 overflow-hidden" : showCode ? "w-1/2" : "w-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b-[3px] border-[#0A0A0A] bg-[#F5F3EE] shrink-0">
            <span className="text-xs uppercase tracking-widest text-[#666] font-bold">
              PREVIEW
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="w-6 h-6 flex items-center justify-center bg-white border-2 border-[#0A0A0A] hover:bg-[#FFD233] transition-all duration-150"
                title="Zoom out"
              >
                <ZoomOut size={12} />
              </button>
              <span className="text-[10px] font-mono font-bold text-[#0A0A0A] w-10 text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="w-6 h-6 flex items-center justify-center bg-white border-2 border-[#0A0A0A] hover:bg-[#FFD233] transition-all duration-150"
                title="Zoom in"
              >
                <ZoomIn size={12} />
              </button>
              <button
                onClick={zoomFit}
                className="w-6 h-6 flex items-center justify-center bg-white border-2 border-[#0A0A0A] hover:bg-[#FFD233] transition-all duration-150"
                title="Fit to width"
              >
                <Maximize size={12} />
              </button>
              {/* <div className="w-px h-5 bg-[#0A0A0A]/20 mx-1" /> */}
              {/* <button
                onClick={updatePreview}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#0A0A0A] border-[3px] border-[#0A0A0A] px-3 py-1 shadow-[3px_3px_0px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all bg-white"
              >
                <RefreshCw size={12} />
                REFRESH
              </button> */}
            </div>
          </div>
          <div className="flex-1 overflow-hidden min-h-0 bg-[#F5F3EE] px-3 py-2 rounded-sm">
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="w-full h-full border-none bg-white rounded-sm"
              sandbox="allow-same-origin allow-scripts"
              title="Slide preview"
              onLoad={autoFitOnLoad}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
