"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyBlock({
  text,
  children,
  className = "",
  dark = false,
  multiline = false,
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  multiline?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${className}`}>
      {children}
      <button
        onClick={handleCopy}
        className={`absolute right-3 z-10 w-7 h-7 flex items-center justify-center border-2 transition-all duration-150 ${
          multiline ? "top-3" : "top-1/2 -translate-y-1/2"
        } ${
          copied
            ? "bg-[#FFD233] border-[#FFD233] text-[#0A0A0A]"
            : dark
              ? "bg-[#2A2A44] border-[#2A2A44] text-[#FFD233] hover:bg-[#FFD233] hover:text-[#0A0A0A]"
              : "bg-white border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#FFD233]"
        }`}
        title={copied ? "Copied!" : "Copy"}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
