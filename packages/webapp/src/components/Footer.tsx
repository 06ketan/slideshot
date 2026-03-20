import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FFFDF5] border-t-[3px] border-[#0A0A0A] text-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#FFD233] border-[3px] border-[#0A0A0A] flex items-center justify-center">
                <span className="font-[var(--font-bebas-neue)] text-[#0A0A0A] text-xl leading-none">S</span>
              </div>
              <span className="font-[var(--font-bebas-neue)] text-2xl tracking-wide">slideshot</span>
            </div>
            <p className="text-[#666] text-sm leading-relaxed max-w-sm mb-6">
              Convert HTML+CSS into high-resolution carousel slides.
              Export to PNG, WebP, and PDF. Use from the web, CLI, or MCP server.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/06ketan/slideshot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold bg-[#FFD233] text-[#0A0A0A] px-4 py-2 border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
              >
                <Github size={14} /> Star on GitHub
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold tracking-[2px] uppercase text-[#0A0A0A] mb-4 border-b-2 border-[#E5E3DE] pb-2">
              Product
            </h4>
            <div className="flex flex-col gap-3">
              <FooterLink href="/editor">Editor</FooterLink>
              <FooterLink href="/gallery">Gallery</FooterLink>
              <FooterLink href="/api/openapi.json" external>API</FooterLink>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold tracking-[2px] uppercase text-[#0A0A0A] mb-4 border-b-2 border-[#E5E3DE] pb-2">
              Resources
            </h4>
            <div className="flex flex-col gap-3">
              <FooterLink href="https://github.com/06ketan/slideshot" external>GitHub</FooterLink>
              <FooterLink href="https://www.npmjs.com/package/slideshot" external>npm</FooterLink>
              <FooterLink href="https://www.npmjs.com/package/slideshot-mcp" external>MCP Server</FooterLink>
            </div>
            <div className="mt-5">
              <code className="text-[11px] font-mono bg-[#0A0A0A] border-[3px] border-[#0A0A0A] px-3 py-2 text-[#FFD233] block leading-relaxed overflow-x-auto">
                npm i -g slideshot
              </code>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-[#E5E3DE] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <code className="text-xs font-mono bg-[#0A0A0A] border-[3px] border-[#0A0A0A] w-full px-3 py-2 text-[#FFD233] overflow-x-auto max-w-full block">
            npx slideshot ./slides.html --scale 4
          </code>
          <span className="text-xs text-[#888]">
            Built by{" "}
            <a
              href="https://github.com/06ketan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666] hover:text-[#FFD233] transition-colors duration-150"
            >
              Ketan
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const classes =
    "text-sm font-medium text-[#666] hover:text-[#FFD233] hover:-translate-y-px transition-all duration-150 flex items-center gap-1 w-fit";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children} <ExternalLink size={10} />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
