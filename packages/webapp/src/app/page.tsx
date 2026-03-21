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
  Shield,
  Eye,
  Server,
  Sparkles,
  Globe,
  MousePointerClick,
  Workflow,
  ExternalLink,
} from "lucide-react";
import PromptBlocks from "@/components/PromptBlocks";
import HeroTerminal from "@/components/HeroTerminal";
import ScrollReveal from "@/components/ScrollReveal";

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
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFD233] border-[3px] border-[#0A0A0A] px-4 py-1.5 mb-8 shadow-[3px_3px_0px_0px_#0A0A0A] animate-slide-in-line">
                <Zap size={14} className="text-[#0A0A0A]" />
                <span className="text-sm font-bold text-[#0A0A0A]">
                  HTML to slides in seconds
                </span>
              </div>

              <h1 className="font-[var(--font-bebas-neue)] text-6xl sm:text-8xl lg:text-[10rem] text-[#0A0A0A] leading-[0.82] mb-6">
                <span className="block animate-slide-in-line" style={{ animationDelay: "0.1s" }}>
                  HTML
                </span>
                <span className="block animate-slide-in-line" style={{ animationDelay: "0.2s" }}>
                  TO{" "}
                  <span className="text-[#FFD233] [-webkit-text-stroke:3px_#0A0A0A]">
                    SLIDES
                  </span>
                </span>
              </h1>

              <p className="text-lg font-medium text-[#444] max-w-md mb-4 leading-relaxed animate-slide-in-line" style={{ animationDelay: "0.35s" }}>
                Paste HTML+CSS, get high-res PNG, WebP &amp; PDF carousels.
                Use the web editor, CLI, or MCP server.
              </p>

              <code className="inline-block text-xs font-mono bg-[#0A0A0A] text-[#FFD233] px-4 py-2 border-[3px] border-[#0A0A0A] mb-8 animate-slide-in-line overflow-x-auto max-w-full" style={{ animationDelay: "0.45s" }}>
                npx slideshot ./slides.html --scale 4
              </code>

              <div className="flex flex-wrap gap-4 animate-slide-in-line" style={{ animationDelay: "0.55s" }}>
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

            <div className="animate-slide-in-line" style={{ animationDelay: "0.3s" }}>
              <HeroTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A] overflow-hidden py-2.5">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex shrink-0">
              {[
                "npx slideshot",
                "4 slides → ZIP",
                "PNG + WebP + PDF",
                "540 × 675",
                "MCP Server",
                "AI Prompts",
                "Up to 6x Scale",
                "Open Source",
                "Privacy First",
              ].map((item, i) => (
                <span
                  key={i}
                  className="font-[var(--font-bebas-neue)] text-[#FFD233] text-lg tracking-wider uppercase mx-8 flex items-center gap-3"
                >
                  <span className="w-2 h-2 bg-[#FFD233] shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScrollReveal delay={0}><StatCard label="npm Downloads" value={stats.downloads.toLocaleString()} sub="Last 7 days" icon={<Download size={18} />} /></ScrollReveal>
            <ScrollReveal delay={0.05}><StatCard label="GitHub Stars" value={stats.stars.toLocaleString()} sub="Open source" icon={<Star size={18} />} /></ScrollReveal>
            <ScrollReveal delay={0.1}><StatCard label="Prompt Templates" value="8" sub="Ready to use" icon={<FileCode size={18} />} /></ScrollReveal>
            <ScrollReveal delay={0.15}><StatCard label="Export Formats" value="3" sub="PNG / WebP / PDF" icon={<ImageIcon size={18} />} /></ScrollReveal>
          </div>
        </div>
      </section>

      {/* WHY SLIDESHOT? */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-3">
              WHY SLIDESHOT?
            </h2>
            <p className="text-[#666] text-lg font-medium max-w-xl mx-auto">
              You write code. Your slides should be code too.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <PainCard
                icon={<MousePointerClick size={24} />}
                title="Canva is slow for devs"
                description="Drag-and-drop is fine for marketers. You need to generate 20 slides from data, not click through templates one by one."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <PainCard
                icon={<ImageIcon size={24} />}
                title="Screenshots lose quality"
                description="Screenshotting your browser at 1x gives you blurry, low-res images. Slideshot renders at up to 6x scale -- print-ready."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <PainCard
                icon={<Workflow size={24} />}
                title="No automation pipeline"
                description="Need slides generated in CI, from a script, or by an AI agent? There's no API for that -- until now."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MCP -- LET AI DO IT */}
      <section className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FFD233] border-[3px] border-[#FFD233] flex items-center justify-center">
                <Server size={20} className="text-[#0A0A0A]" />
              </div>
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#FFD233]">
                Model Context Protocol
              </span>
            </div>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-7xl text-white mb-4">
              LET AI BUILD
              <br />
              <span className="text-[#FFD233]">YOUR SLIDES</span>
            </h2>
            <p className="text-white/60 text-lg font-medium max-w-2xl mb-8 leading-relaxed">
              Connect slideshot to your AI tool via MCP. Describe what you want,
              the AI writes the HTML, and slideshot renders it -- all in one step.
              No copy-paste, no context switching.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                "Claude",
                "Cursor IDE",
                "Windsurf",
                "ChatGPT (Custom GPTs)",
                "Antigravity",
                "Any MCP Client",
              ].map((tool) => (
                <span
                  key={tool}
                  className="text-xs font-bold uppercase tracking-wider bg-[#FFD233] text-[#0A0A0A] px-4 py-2 border-[3px] border-[#FFD233]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScrollReveal delay={0.15}>
              <div className="border-[3px] border-[#FFD233] p-6">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-3">
                  INSTALL IN 10 SECONDS
                </h3>
                <code className="block text-sm font-mono bg-[#12122A] border-[3px] border-[#2A2A44] px-4 py-3 text-[#FFD233] leading-relaxed overflow-x-auto">
                  npm i -g slideshot-mcp
                </code>
                <p className="text-white/50 text-sm mt-3">
                  Then add it to your AI tool&apos;s MCP config. That&apos;s it.
                </p>
                <a
                  href="https://www.npmjs.com/package/slideshot-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-[#FFD233] hover:text-white transition-colors duration-150"
                >
                  View on npm <ExternalLink size={12} />
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="border-[3px] border-[#2A2A44] p-6">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-3">
                  PRO TIP: SANDBOX ENVIRONMENTS
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  In Claude and similar sandboxes, generated HTML is stored in{" "}
                  <code className="text-[#FFD233] bg-[#12122A] px-1.5 py-0.5 text-xs">/tmp</code>.
                  Pass the path directly to the MCP tool for instant rendering --
                  no file upload needed.
                </p>
                <code className="block text-xs font-mono bg-[#12122A] border-[3px] border-[#2A2A44] px-4 py-3 text-[#FFD233] leading-relaxed overflow-x-auto">
                  {`slideshot.render({ html_path: "/tmp/slides.html", scale: 4 })`}
                </code>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ZERO INSTALL CLI */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#0A0A0A] border-[3px] border-[#0A0A0A] flex items-center justify-center">
                  <Terminal size={20} className="text-[#FFD233]" />
                </div>
                <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#0A0A0A]">
                  Zero Install
                </span>
              </div>
              <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-4">
                ONE COMMAND.
                <br />
                DONE.
              </h2>
              <p className="text-[#0A0A0A]/70 text-lg font-medium max-w-md mb-6 leading-relaxed">
                No install. No config. Just <code className="bg-[#0A0A0A] text-[#FFD233] px-2 py-0.5 text-sm font-mono">npx</code> and
                your HTML file. Works in CI/CD pipelines, GitHub Actions, scripts, or your terminal.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white text-[#0A0A0A] px-3 py-1.5 border-[3px] border-[#0A0A0A]">
                  CI/CD Ready
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white text-[#0A0A0A] px-3 py-1.5 border-[3px] border-[#0A0A0A]">
                  GitHub Actions
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white text-[#0A0A0A] px-3 py-1.5 border-[3px] border-[#0A0A0A]">
                  Shell Scripts
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white text-[#0A0A0A] px-3 py-1.5 border-[3px] border-[#0A0A0A]">
                  Cross Platform
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[8px_8px_0px_0px_#0A0A0A] overflow-hidden">
                <div className="flex items-center gap-2 px-4 h-10">
                  <div className="flex gap-[7px]">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#FF6059]" />
                    <div className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E]" />
                    <div className="w-[11px] h-[11px] rounded-full bg-[#2A2A44]" />
                  </div>
                  <span className="text-white/50 text-[10px] font-mono tracking-wider uppercase ml-2">
                    terminal
                  </span>
                </div>
                <div className="px-5 py-4 font-mono text-sm leading-loose">
                  <div className="text-white/50 mb-1"># Zero install -- just run it</div>
                  <div><span className="text-[#FFD233] font-bold">$</span> <span className="text-white">npx slideshot ./slides.html --scale 4</span></div>
                  <div className="text-white/40 mt-3 mb-1"># Or install globally for speed</div>
                  <div><span className="text-[#FFD233] font-bold">$</span> <span className="text-white">npm i -g slideshot</span></div>
                  <div><span className="text-[#FFD233] font-bold">$</span> <span className="text-white">slideshot render ./deck.html --formats png,webp,pdf</span></div>
                  <div className="text-white/40 mt-3 mb-1"># Output</div>
                  <div className="text-[#FFD233] font-bold">✓ slides.zip — 4 slides (PNG, WebP, PDF)</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WEB EDITOR CALLOUT */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="bg-[#F5F3EE] border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-1">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#12122A]">
                  <div className="flex gap-[5px]">
                    <div className="w-2 h-2 rounded-full bg-[#FF6059]" />
                    <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#2A2A44]" />
                  </div>
                  <span className="text-white/40 text-[9px] font-mono ml-1">slideshot/editor</span>
                </div>
                <div className="flex h-40">
                  <div className="w-1/2 bg-[#12122A] p-3">
                    <div className="space-y-1">
                      {["<div class=\"slide\">", "  <h1>Your content</h1>", "  <p>Goes here</p>", "</div>"].map((line, i) => (
                        <div key={i} className="text-[10px] font-mono text-[#D4D4D8]/60">{line}</div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/2 bg-white p-3 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-[var(--font-bebas-neue)] text-lg text-[#0A0A0A]">LIVE PREVIEW</div>
                      <div className="text-[10px] text-[#888]">Real-time rendering</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FFD233] border-[3px] border-[#0A0A0A] flex items-center justify-center">
                  <Globe size={20} className="text-[#0A0A0A]" />
                </div>
                <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#888]">
                  Web App
                </span>
              </div>
              <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-4">
                PASTE. PREVIEW.
                <br />
                EXPORT.
              </h2>
              <p className="text-[#666] text-lg font-medium max-w-md mb-6 leading-relaxed">
                No setup needed. Open the web editor, paste your HTML+CSS,
                see a live preview, and export with one click. Collapsible
                code and preview panels for a distraction-free experience.
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all text-sm"
              >
                Open Editor <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* PRIVACY FIRST */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-3">
              PRIVACY FIRST
            </h2>
            <p className="text-[#0A0A0A]/70 text-lg font-medium max-w-xl mx-auto">
              Your data never leaves your machine. No tracking, no analytics, no cloud uploads.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ScrollReveal delay={0}>
              <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white text-center">
                <div className="w-14 h-14 bg-[#0A0A0A] border-[3px] border-[#0A0A0A] flex items-center justify-center mx-auto mb-5">
                  <Shield size={28} className="text-[#FFD233]" />
                </div>
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] mb-2 tracking-wide">
                  NO DATA STORED
                </h3>
                <p className="text-sm text-[#666] leading-relaxed font-medium">
                  Your HTML is processed in-memory and discarded immediately. Nothing is saved to any server or database.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white text-center">
                <div className="w-14 h-14 bg-[#0A0A0A] border-[3px] border-[#0A0A0A] flex items-center justify-center mx-auto mb-5">
                  <Eye size={28} className="text-[#FFD233]" />
                </div>
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] mb-2 tracking-wide">
                  ZERO TRACKING
                </h3>
                <p className="text-sm text-[#666] leading-relaxed font-medium">
                  No cookies, no analytics scripts, no telemetry. The webapp and CLI collect nothing about your usage.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white text-center">
                <div className="w-14 h-14 bg-[#0A0A0A] border-[3px] border-[#0A0A0A] flex items-center justify-center mx-auto mb-5">
                  <Sparkles size={28} className="text-[#FFD233]" />
                </div>
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] mb-2 tracking-wide">
                  100% OPEN SOURCE
                </h3>
                <p className="text-sm text-[#666] leading-relaxed font-medium">
                  Every line of code is on GitHub. Audit it, fork it, self-host it. MIT licensed.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.15} className="flex justify-center">
            <a
              href="https://github.com/06ketan/slideshot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-6 py-3 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all text-sm"
            >
              <Star size={16} /> View Source on GitHub
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-3">
              EVERYTHING YOU NEED
            </h2>
            <p className="text-[#666] text-lg font-medium max-w-xl mx-auto">
              From AI-generated prompts to high-res exports, slideshot handles the full pipeline.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <FeatureCard
                icon={<Palette size={24} />}
                title="AI Prompt Templates"
                description="8 built-in style variants: minimal, monospace, bold social, data cards, corporate, dark neon, editorial, and browser-shell."
                accent="#FFD233"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <FeatureCard
                icon={<ImageIcon size={24} />}
                title="High-Res Export"
                description="PNG, WebP, and PDF at up to 6x scale. Each .slide element becomes one image. Bundled as a ZIP."
                accent="#FF6059"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <FeatureCard
                icon={<Terminal size={24} color="#ffffff" />}
                title="CLI + MCP Server"
                description="Use from terminal with npx slideshot, or integrate with Claude / Cursor via the slideshot-mcp server."
                accent="#0A0A0A"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CHATGPT CUSTOM GPT BANNER */}
      <section className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <ScrollReveal>
            <div className="border-[3px] border-[#FFD233] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 bg-[#FFD233] border-[3px] border-[#FFD233] flex items-center justify-center shrink-0">
                <Sparkles size={24} className="text-[#0A0A0A]" />
              </div>
              <div className="flex-1">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-1">
                  USE WITH CHATGPT CUSTOM GPTS
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Create a Custom GPT with our system prompt from the gallery. ChatGPT generates
                  slideshot-compatible HTML -- paste the output into the editor or pipe it through the CLI.
                </p>
              </div>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-6 py-3 border-[3px] border-[#FFD233] shadow-[3px_3px_0px_0px_#FFD233] hover:shadow-[5px_5px_0px_0px_#FFD233] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all text-sm shrink-0"
              >
                Get Prompts <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PROMPT SECTIONS */}
      <PromptBlocks />

      {/* CTA */}
      <section className="bg-[#FFD233] border-t-[3px] border-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-6xl md:text-7xl text-[#0A0A0A] mb-4">
              READY TO BUILD
              <br />
              YOUR SLIDES?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-[#0A0A0A]/70 text-lg font-medium mb-8 max-w-lg mx-auto">
              Open the editor, paste your HTML, and export. Or grab a prompt
              template from the gallery.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
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
          </ScrollReveal>
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
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] p-4">
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

function PainCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white">
      <div className="w-12 h-12 flex items-center justify-center mb-5 border-[3px] border-[#0A0A0A] bg-[#FF6059]">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] mb-2 tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-[#666] leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px transition-all duration-150 group">
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
