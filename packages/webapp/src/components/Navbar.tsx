"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, ExternalLink, Menu, X } from "lucide-react";

export default function Navbar({ stars }: { stars?: number }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
<>
<nav className="fixed w-full top-0 z-50 bg-[#FFFDF5] border-b-[3px] border-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#FFD233] border-[3px] border-[#0A0A0A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A]">
            <span className="font-[var(--font-bebas-neue)] text-[#0A0A0A] text-xl leading-none">S</span>
          </div>
          <span className="font-[var(--font-bebas-neue)] text-2xl tracking-wide text-[#0A0A0A]">
            slideshot
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {[
            { href: "/", label: "Home" },
            { href: "/editor", label: "Editor" },
            { href: "/gallery", label: "Gallery" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-1.5 text-sm font-bold transition-all ${
                isActive(href)
                  ? "bg-[#FFD233] border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] text-[#0A0A0A]"
                  : "text-[#666] hover:text-[#0A0A0A] border-[3px] border-transparent"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-sm font-bold text-[#666] hover:text-[#0A0A0A] flex items-center gap-1 border-[3px] border-transparent"
          >
            API <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.npmjs.com/package/slideshot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold bg-white border-[3px] border-[#0A0A0A] px-3 py-1 text-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:shadow-[4px_4px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
          >
            npm
          </a>
          <a
            href="https://github.com/06ketan/slideshot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-bold bg-[#0A0A0A] text-white px-4 py-1.5 border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_0px_#FFD233] hover:shadow-[5px_5px_0px_0px_#FFD233] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
          >
            <Github size={14} />
            {stars !== undefined && (
              <span className="font-mono text-xs">{stars.toLocaleString()}</span>
            )}
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 border-[3px] border-[#0A0A0A] bg-white hover:bg-[#FFD233] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#FFFDF5] border-t-[3px] border-[#0A0A0A] px-6 pb-4">
          {[
            { href: "/", label: "Home" },
            { href: "/editor", label: "Editor" },
            { href: "/gallery", label: "Gallery" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block py-3 text-base font-bold border-b-[2px] border-[#E5E3DE] ${
                isActive(href) ? "text-[#0A0A0A]" : "text-[#666]"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-3 text-base font-bold text-[#666] flex items-center gap-1"
            onClick={() => setMobileOpen(false)}
          >
            API <ExternalLink size={12} />
          </a>
        </div>
      )}
    </nav>
    <div className="h-17"></div>
</>
  );
}
