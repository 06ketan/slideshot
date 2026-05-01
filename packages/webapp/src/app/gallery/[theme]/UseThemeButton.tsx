"use client";

import { useState } from "react";

export default function UseThemeButton({
  theme,
  promptText,
}: {
  theme: string;
  promptText: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers / sandboxed iframes — fall back to manual selection
      // by selecting the textarea, but for now just degrade quietly.
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="bg-[#FFD233] text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all px-6 py-3 text-base font-bold tracking-wide uppercase"
      >
        {copied ? "✓ Copied to clipboard" : "Use this theme — copy prompt"}
      </button>
      <a
        href={`/editor?theme=${encodeURIComponent(theme)}`}
        className="bg-white text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all px-6 py-3 text-base font-bold tracking-wide uppercase text-center"
      >
        Open in editor →
      </a>
    </div>
  );
}
