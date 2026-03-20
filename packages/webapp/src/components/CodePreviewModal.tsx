"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Code, Eye, FileText, PanelLeftClose, PanelRightClose } from "lucide-react";

export default function CodePreviewModal({
  isOpen,
  onClose,
  title,
  code,
  sampleHtml,
  palette,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  code: string;
  sampleHtml: string;
  palette: string[];
}) {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const copyHtml = () => {
    navigator.clipboard.writeText(sampleHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(code);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const slideCount = (sampleHtml.match(/class="slide"/g) || []).length;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-7xl h-[90vh] bg-white border-[3px] border-[#0A0A0A] shadow-[8px_8px_0px_0px_#0A0A0A] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#FFD233] border-b-[3px] border-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-1.5">
              {palette.map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 border-2 border-[#0A0A0A]"
                  style={{ background: c }}
                />
              ))}
            </div>
            <h3 className="font-[var(--font-bebas-neue)] text-xl sm:text-2xl tracking-wide text-[#0A0A0A]">
              {title}
            </h3>
            {slideCount > 0 && (
              <span className="text-[10px] font-bold bg-[#0A0A0A] text-[#FFD233] px-2 py-0.5">
                {slideCount} slides
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-2 border-[3px] border-[#0A0A0A] transition-all duration-150 ${
                showCode
                  ? "bg-white text-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A]"
                  : "bg-[#0A0A0A] text-[#FFD233]"
              }`}
              title={showCode ? "Hide code" : "Show code"}
            >
              <PanelLeftClose size={14} />
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 border-[3px] border-[#0A0A0A] transition-all duration-150 ${
                showPreview
                  ? "bg-white text-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A]"
                  : "bg-[#0A0A0A] text-[#FFD233]"
              }`}
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              <PanelRightClose size={14} />
            </button>
            <div className="w-px h-6 bg-[#0A0A0A]/30 mx-1 hidden sm:block" />
            <button
              onClick={copyHtml}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:shadow-[4px_4px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
            >
              {copiedHtml ? <Check size={12} /> : <Copy size={12} />}
              {copiedHtml ? "Copied" : "HTML"}
            </button>
            <button
              onClick={copyPrompt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#0A0A0A] text-white border-[3px] border-[#0A0A0A] shadow-[2px_2px_0px_0px_#FFD233] hover:shadow-[4px_4px_0px_0px_#FFD233] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
            >
              {copiedPrompt ? <Check size={12} /> : <FileText size={12} />}
              {copiedPrompt ? "Copied" : "Prompt"}
            </button>
            <button
              onClick={onClose}
              className="p-2 border-[3px] border-[#0A0A0A] bg-white hover:bg-[#FF6059] hover:text-white transition-colors duration-150"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mobile copy buttons */}
        <div className="flex sm:hidden border-b-[3px] border-[#0A0A0A] shrink-0">
          <button
            onClick={copyHtml}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold border-r-[3px] border-[#0A0A0A] bg-white"
          >
            {copiedHtml ? <Check size={12} /> : <Copy size={12} />}
            {copiedHtml ? "Copied" : "Copy HTML"}
          </button>
          <button
            onClick={copyPrompt}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold bg-[#0A0A0A] text-white"
          >
            {copiedPrompt ? <Check size={12} /> : <FileText size={12} />}
            {copiedPrompt ? "Copied" : "Copy Prompt"}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {!showCode && !showPreview && (
            <div className="flex-1 flex items-center justify-center text-[#888]">
              <p className="text-sm font-bold">Toggle Code or Preview to view content</p>
            </div>
          )}

          {/* Code panel */}
          {showCode && (
            <div className={`flex flex-col ${showPreview ? "w-1/2 border-r-[3px] border-[#0A0A0A]" : "w-full"} transition-all duration-150`}>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#12122A] shrink-0">
                <div className="flex gap-[5px]">
                  <div className="w-[9px] h-[9px] rounded-full bg-[#FF6059]" />
                  <div className="w-[9px] h-[9px] rounded-full bg-[#FEBC2E]" />
                  <div className="w-[9px] h-[9px] rounded-full bg-[#2A2A44]" />
                </div>
                <Code size={12} className="text-white/60 ml-2" />
                <span className="text-xs font-mono text-white/60">prompt.md</span>
              </div>
              <pre className="flex-1 overflow-auto p-4 bg-[#12122A] text-[#D4D4D8] text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
                {code}
              </pre>
            </div>
          )}

          {/* Preview panel */}
          {showPreview && (
            <div className={`flex flex-col ${showCode ? "w-1/2" : "w-full"} transition-all duration-150`}>
              <div className="flex items-center justify-between px-4 py-2 bg-[#F5F3EE] border-b-[3px] border-[#0A0A0A] shrink-0">
                <div className="flex items-center gap-2">
                  <Eye size={12} className="text-[#888]" />
                  <span className="text-xs font-bold text-[#888]">Live Preview</span>
                </div>
                {slideCount > 0 && (
                  <span className="text-[10px] font-bold text-[#888]">
                    {slideCount} slides — scroll to view all
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-auto bg-[#1a1a1a]">
                <iframe
                  srcDoc={sampleHtml}
                  className="w-full border-none"
                  style={{ minHeight: slideCount * 770 + 96 }}
                  sandbox="allow-same-origin allow-scripts"
                  title={`Preview: ${title}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
