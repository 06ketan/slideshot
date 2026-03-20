"use client";

import { Eye } from "lucide-react";

export default function GalleryCard({
  name,
  style,
  palette,
  featured,
  sampleHtml,
  onClick,
  animationDelay,
}: {
  name: string;
  style: string;
  palette: string[];
  featured?: boolean;
  sampleHtml?: string;
  onClick: () => void;
  animationDelay?: number;
}) {
  const slideCount = sampleHtml
    ? (sampleHtml.match(/class="slide"/g) || []).length
    : 0;

  return (
    <button
      onClick={onClick}
      className={`group text-left border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px transition-all duration-150 animate-fade-in-up ${
        featured ? "bg-[#FFD233]/10" : "bg-white"
      }`}
      style={animationDelay ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      {sampleHtml ? (
        <div className="h-[200px] overflow-hidden border-b-[3px] border-[#0A0A0A] bg-[#1a1a1a] relative">
          <iframe
            srcDoc={sampleHtml}
            className="pointer-events-none absolute top-0 left-0"
            style={{
              width: 636,
              height: 771,
              transform: "scale(0.315)",
              transformOrigin: "top left",
            }}
            sandbox="allow-same-origin"
            title={`Preview: ${name}`}
            loading="lazy"
          />
          {slideCount > 0 && (
            <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-[#0A0A0A] text-[#FFD233] px-2 py-0.5">
              {slideCount} slides
            </span>
          )}
        </div>
      ) : (
        <div className="h-[200px] border-b-[3px] border-[#0A0A0A] bg-[#F5F3EE] flex items-center justify-center">
          <div className="flex gap-2">
            {palette.map((c, i) => (
              <span
                key={i}
                className="w-8 h-8 border-2 border-[#0A0A0A]"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-[var(--font-bebas-neue)] text-2xl tracking-wide text-[#0A0A0A]">
            {name}
          </h3>
          {featured && (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FFD233] text-[#0A0A0A] px-2 py-0.5 border-2 border-[#0A0A0A]">
              Featured
            </span>
          )}
        </div>
        <p className="text-sm text-[#666] mb-3">{style}</p>
        <div className="flex items-center gap-2 text-sm font-bold text-[#888] group-hover:text-[#0A0A0A] transition-colors duration-150">
          <Eye size={16} />
          <span>View code & preview</span>
        </div>
      </div>
    </button>
  );
}
