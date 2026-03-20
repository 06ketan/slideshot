import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowRight,
  Palette,
  Download,
  Terminal,
  Image as ImageIcon,
  FileCode,
  Zap,
  Star,
} from "lucide-react";
import PromptBlocks from "@/components/PromptBlocks";

async function getStats() {
  try {
    const [npmRes, ghRes] = await Promise.all([
      fetch("https://api.npmjs.org/downloads/point/last-week/slideshot", {
        next: { revalidate: 3600 },
      }),
      fetch("https://api.github.com/repos/06ketan/slideshot", {
        next: { revalidate: 3600 },
      }),
    ]);

    const npmData = npmRes.ok ? await npmRes.json() : null;
    const ghData = ghRes.ok ? await ghRes.json() : null;

    return {
      downloads: npmData?.downloads ?? 0,
      stars: ghData?.stargazers_count ?? 0,
      forks: ghData?.forks_count ?? 0,
    };
  } catch {
    return { downloads: 0, stars: 0, forks: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <Navbar stars={stats.stars} />

      {/* HERO */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-[#FFD233] border-[3px] border-[#0A0A0A] px-4 py-1.5 mb-8 shadow-[3px_3px_0px_0px_#0A0A0A]">
                <Zap size={14} className="text-[#0A0A0A]" />
                <span className="text-sm font-bold text-[#0A0A0A]">
                  HTML to slides in seconds
                </span>
              </div>

              <h1 className="font-[var(--font-bebas-neue)] text-7xl md:text-9xl text-[#0A0A0A] leading-[0.85] mb-6">
                THE BEST
                <br />
                WAY TO
                <br />
                CREATE
                <br />
                <span className="text-[#FFD233] [-webkit-text-stroke:3px_#0A0A0A]">
                  SLIDES
                </span>
              </h1>

              <p className="text-lg font-medium text-[#444] max-w-md mb-8 leading-relaxed">
                Paste HTML+CSS, preview live, export to high-res PNG, WebP,
                and PDF. Use AI prompts, CLI, or MCP server.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all text-sm"
                >
                  Open Editor <ArrowRight size={16} />
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all text-sm"
                >
                  Browse Gallery <Palette size={16} />
                </Link>
              </div>
            </div>

            {/* Browser shell preview */}
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="bg-[#FFD233] p-5 border-[3px] border-[#0A0A0A] shadow-[8px_8px_0px_0px_#0A0A0A]">
                <div className="bg-[#12122A] overflow-hidden">
                  <div className="flex items-center justify-between px-4 h-10">
                    <div className="flex gap-[7px]">
                      <div className="w-[11px] h-[11px] rounded-full bg-[#FF6059]" />
                      <div className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E]" />
                      <div className="w-[11px] h-[11px] rounded-full bg-[#2A2A44]" />
                    </div>
                    <span className="text-white text-sm font-bold">slideshot</span>
                  </div>
                  <div className="bg-white p-6">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-[#FFD233] mt-1.5" />
                        <div className="h-3 bg-[#F5F3EE] w-3/4" />
                      </div>
                      <div className="h-16 bg-[#FFFDF5] border-[3px] border-[#0A0A0A] flex items-center justify-center">
                        <span className="font-[var(--font-bebas-neue)] text-3xl text-[#0A0A0A]/20">
                          YOUR SLIDE
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 bg-[#F5F3EE] flex-1" />
                        <div className="h-3 bg-[#FFD233]/30 w-1/4" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 bg-[#F5F3EE] w-1/2" />
                        <div className="h-3 bg-[#F5F3EE] w-1/3" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#12122A] px-4 py-2 text-center">
                    <span className="text-white/60 text-[8px] font-bold tracking-[2px] uppercase">
                      Export to PNG / WebP / PDF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="npm Downloads" value={stats.downloads.toLocaleString()} sub="Last 7 days" icon={<Download size={18} />} delay={0} />
            <StatCard label="GitHub Stars" value={stats.stars.toLocaleString()} sub="Open source" icon={<Star size={18} />} delay={0.05} />
            <StatCard label="Prompt Templates" value="8" sub="Ready to use" icon={<FileCode size={18} />} delay={0.1} />
            <StatCard label="Export Formats" value="3" sub="PNG / WebP / PDF" icon={<ImageIcon size={18} />} delay={0.15} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-3">
              EVERYTHING YOU NEED
            </h2>
            <p className="text-[#666] text-lg font-medium max-w-xl mx-auto">
              From AI-generated prompts to high-res exports, slideshot handles the full pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Palette size={24} />}
              title="AI Prompt Templates"
              description="8 built-in style variants: minimal, monospace, bold social, data cards, corporate, dark neon, editorial, and browser-shell."
              accent="#FFD233"
              delay={0}
            />
            <FeatureCard
              icon={<ImageIcon size={24} />}
              title="High-Res Export"
              description="PNG, WebP, and PDF at up to 6x scale. Each .slide element becomes one image. Bundled as a ZIP."
              accent="#FF6059"
              delay={0.05}
            />
            <FeatureCard
              icon={<Terminal size={24} />}
              title="CLI + MCP Server"
              description="Use from terminal with npx slideshot, or integrate with Claude / Cursor via the slideshot-mcp server."
              accent="#0A0A0A"
              delay={0.1}
            />
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-3">
              HOW TO USE SLIDESHOT
            </h2>
            <p className="text-[#0A0A0A]/70 text-lg font-medium max-w-xl mx-auto">
              Four ways to convert HTML into slides. Pick what fits your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HowToCard
              num="01"
              title="Web Editor"
              description="Open the editor, paste your HTML+CSS, preview live in the browser, then export with one click."
              cta={{ label: "Open Editor", href: "/editor" }}
              delay={0}
            />
            <HowToCard
              num="02"
              title="npx (Zero Install)"
              description="Run directly without installing. Renders your HTML file and outputs a ZIP with slide images."
              code="npx slideshot ./slides.html --scale 4 --formats png,webp,pdf"
              delay={0.05}
            />
            <HowToCard
              num="03"
              title="npm Global Install"
              description="Install once, use anywhere. Same options as npx but faster on repeat runs."
              code={`npm i -g slideshot\nslideshot render ./slides.html --scale 4`}
              delay={0.1}
            />
            <HowToCard
              num="04"
              title="MCP Server"
              description="Let AI generate and render slides directly. Works with Claude, Cursor, and Windsurf."
              code="npm i -g slideshot-mcp"
              cta={{ label: "View on npm", href: "https://www.npmjs.com/package/slideshot-mcp", external: true }}
              delay={0.15}
            />
          </div>
        </div>
      </section>

      {/* PROMPT SECTIONS */}
      <PromptBlocks />

      {/* CTA */}
      <section className="bg-[#FFD233] border-t-[3px] border-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-[var(--font-bebas-neue)] text-6xl md:text-7xl text-[#0A0A0A] mb-4">
            READY TO BUILD
            <br />
            YOUR SLIDES?
          </h2>
          <p className="text-[#0A0A0A]/70 text-lg font-medium mb-8 max-w-lg mx-auto">
            Open the editor, paste your HTML, and export. Or grab a prompt
            template from the gallery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all text-sm"
            >
              Open Editor <ArrowRight size={16} />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all text-sm"
            >
              Browse Gallery
            </Link>
          </div>
          <div className="mt-8">
            <code className="text-sm font-mono bg-[#0A0A0A] border-[3px] border-[#0A0A0A] px-4 py-2 text-[#FFD233] inline-block max-w-full overflow-x-auto">
              npx slideshot ./slides.html
            </code>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <div className="bg-white border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] p-4 animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-[#0A0A0A]">{icon}</div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-[#888]">
          {label}
        </span>
      </div>
      <div className="font-[var(--font-bebas-neue)] text-4xl text-[#0A0A0A] leading-none">
        {value}
      </div>
      <div className="text-xs font-medium text-[#888] mt-1">{sub}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  delay?: number;
}) {
  return (
    <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px transition-all duration-150 group animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div
        className="w-12 h-12 flex items-center justify-center mb-5 border-[3px] border-[#0A0A0A]"
        style={{ background: accent, color: "#0A0A0A" }}
      >
        {icon}
      </div>
      <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] mb-2 tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-[#666] leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function HowToCard({
  num,
  title,
  description,
  code,
  cta,
  delay = 0,
}: {
  num: string;
  title: string;
  description: string;
  code?: string;
  cta?: { label: string; href: string; external?: boolean };
  delay?: number;
}) {
  return (
    <div className="border-[3px] border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px transition-all duration-150 group animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-start gap-4 mb-4">
        <span className="font-[var(--font-bebas-neue)] text-4xl text-[#FFD233] [-webkit-text-stroke:1.5px_#0A0A0A] leading-none shrink-0">
          {num}
        </span>
        <div>
          <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] tracking-wide mb-1">
            {title}
          </h3>
          <p className="text-sm text-[#666] leading-relaxed">{description}</p>
        </div>
      </div>
      {code && (
        <code className="block text-xs font-mono bg-[#0A0A0A] border-[3px] border-[#0A0A0A] px-4 py-3 text-[#FFD233] whitespace-pre leading-relaxed overflow-x-auto">
          {code}
        </code>
      )}
      {cta && (
        <div className="mt-4">
          {cta.external ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0A0A0A] hover:text-[#FFD233] transition-colors duration-150"
            >
              {cta.label} <ArrowRight size={12} />
            </a>
          ) : (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0A0A0A] hover:text-[#FFD233] transition-colors duration-150"
            >
              {cta.label} <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
