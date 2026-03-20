"use client";

import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";

const COMMAND = "npx slideshot ./slides.html --scale 4";
const OUTPUT_LINES = [
  "  Finding slides... found 4 elements matching .slide",
  "  Rendering slide 1/4 ████████████████████ done",
  "  Rendering slide 2/4 ████████████████████ done",
  "  Rendering slide 3/4 ████████████████████ done",
  "  Rendering slide 4/4 ████████████████████ done",
  "",
  "  ✓ slides.zip — 4 slides (PNG, WebP, PDF)",
  "  ✓ 2160×2700px @ 4x scale",
];

export default function HeroTerminal() {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const [typedLen, setTypedLen] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (typedLen < COMMAND.length) {
      const t = setTimeout(() => setTypedLen((p) => p + 1), 45);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowOutput(true), 400);
    return () => clearTimeout(t);
  }, [inView, typedLen]);

  useEffect(() => {
    if (!showOutput) return;
    if (visibleLines < OUTPUT_LINES.length) {
      const t = setTimeout(() => setVisibleLines((p) => p + 1), 120);
      return () => clearTimeout(t);
    }
  }, [showOutput, visibleLines]);

  const typing = inView && typedLen < COMMAND.length;

  return (
    <div ref={ref} className="bg-[#FFD233] p-5 border-[3px] border-[#0A0A0A] shadow-[8px_8px_0px_0px_#0A0A0A]">
      <div className="bg-[#12122A] overflow-hidden">
        <div className="flex items-center justify-between px-4 h-10">
          <div className="flex gap-[7px]">
            <div className="w-[11px] h-[11px] rounded-full bg-[#FF6059]" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E]" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#2A2A44]" />
          </div>
          <span className="text-white/50 text-[10px] font-mono tracking-wider uppercase">
            terminal
          </span>
        </div>

        <div className="px-5 py-4 font-mono text-sm leading-relaxed min-h-[220px]">
          <div className="flex">
            <span className="text-[#FFD233] font-bold mr-2">$</span>
            {inView ? (
              <>
                <span className="text-white">
                  {COMMAND.slice(0, typedLen)}
                </span>
                {typing && (
                  <span className="text-[#FFD233] animate-blink ml-px">▌</span>
                )}
              </>
            ) : (
              <span className="text-[#FFD233] animate-blink">▌</span>
            )}
          </div>

          {showOutput && (
            <div className="mt-3 space-y-px">
              {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className={
                    line.startsWith("  ✓")
                      ? "text-[#FFD233] font-bold"
                      : "text-white/60"
                  }
                >
                  {line || "\u00A0"}
                </div>
              ))}
              {visibleLines >= OUTPUT_LINES.length && (
                <div className="flex mt-2">
                  <span className="text-[#FFD233] font-bold mr-2">$</span>
                  <span className="text-[#FFD233] animate-blink">▌</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
