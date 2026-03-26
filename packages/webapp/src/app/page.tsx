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
  HelpCircle,
} from "lucide-react";
import PromptBlocks from "@/components/PromptBlocks";
import HeroTerminal from "@/components/HeroTerminal";
import ScrollReveal from "@/components/ScrollReveal";
import CopyBlock from "@/components/CopyBlock";
import { HomePageSchemas } from "@/components/JsonLd";

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
      <HomePageSchemas />
      <Navbar />

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

              <CopyBlock text="npx slideshot ./slides.html --scale 4" className="inline-block mb-8 animate-slide-in-line max-w-full" dark>
                <code className="block text-xs font-mono bg-[#0A0A0A] text-[#FFD233] px-4 py-2 pr-10 border-[3px] border-[#0A0A0A] whitespace-nowrap overflow-x-auto hide-scrollbar" style={{ animationDelay: "0.45s" }}>
                  npx slideshot ./slides.html --scale 4
                </code>
              </CopyBlock>

              <div className="flex flex-wrap gap-4 animate-slide-in-line" style={{ animationDelay: "0.55s" }}>
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
                >
                  Try the Editor Free <ArrowRight size={16} />
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
                >
                  Browse Templates <Palette size={16} />
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
      <section className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A] ">
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

          {/* Setup cards 2x2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ScrollReveal delay={0.15}>
              <div className="border-[3px] border-[#FFD233] p-6 h-full">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-3">
                  CLAUDE DESKTOP
                </h3>
                <p className="text-white/50 text-xs mb-3 font-mono break-all">
                  ~/Library/Application Support/Claude/claude_desktop_config.json
                </p>
                <CopyBlock text={`{\n  "mcpServers": {\n    "slideshot": {\n      "command": "npx",\n      "args": ["-y", "slideshot-mcp"]\n    }\n  }\n}`} dark multiline>
                  <pre className="text-xs font-mono bg-[#12122A] border-[3px] border-[#2A2A44] px-4 py-3 pr-10 text-[#FFD233] leading-relaxed whitespace-pre overflow-x-auto hide-scrollbar">{`{
  "mcpServers": {
    "slideshot": {
      "command": "npx",
      "args": ["-y", "slideshot-mcp"]
    }
  }
}`}</pre>
                </CopyBlock>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="border-[3px] border-[#FFD233] p-6 h-full">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-3">
                  CURSOR IDE
                </h3>
                <p className="text-white/50 text-xs mb-3 font-mono">
                  .cursor/mcp.json
                </p>
                <CopyBlock text={`{\n  "mcpServers": {\n    "slideshot": {\n      "command": "npx",\n      "args": ["-y", "slideshot-mcp"]\n    }\n  }\n}`} dark multiline>
                  <pre className="text-xs font-mono bg-[#12122A] border-[3px] border-[#2A2A44] px-4 py-3 pr-10 text-[#FFD233] leading-relaxed whitespace-pre overflow-x-auto hide-scrollbar">{`{
  "mcpServers": {
    "slideshot": {
      "command": "npx",
      "args": ["-y", "slideshot-mcp"]
    }
  }
}`}</pre>
                </CopyBlock>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <div className="border-[3px] border-[#2A2A44] p-6 h-full">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-3">
                  AVAILABLE TOOLS
                </h3>
                <div className="space-y-4">
                  <div>
                    <code className="text-sm font-mono text-[#FFD233] font-bold">render_html_to_images</code>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed">
                      Render HTML slides to PNG, WebP, and PDF files. Pass html string, output directory, selector, dimensions, scale (1-6x), and formats.
                    </p>
                  </div>
                  <div className="border-t border-[#2A2A44] pt-4">
                    <code className="text-sm font-mono text-[#FFD233] font-bold">get_slide_prompt</code>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed">
                      Returns an AI prompt template for generating slideshot-compatible HTML. Choose &quot;generic&quot; or &quot;branded&quot; variant.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="border-[3px] border-[#2A2A44] p-6 h-full">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-3">
                  WORKFLOW
                </h3>
                <div className="space-y-4">
                  {[
                    { n: "01", text: "Ask AI to use get_slide_prompt for the prompt template" },
                    { n: "02", text: "Provide your content topic -- AI generates slide HTML" },
                    { n: "03", text: "AI calls render_html_to_images with the HTML and output path" },
                    { n: "04", text: "Get PNG, WebP, and PDF files ready for LinkedIn, presentations, or anywhere" },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-3 items-start">
                      <span className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] leading-none [-webkit-text-stroke:1px_#FFD233] shrink-0 w-8">
                        {step.n}
          </span>
                      <p className="text-white/60 text-sm leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
      </div>

          {/* HTTP API + npm banner */}
          <ScrollReveal delay={0.35}>
            <div className="border-[3px] border-[#FFD233] p-6 overflow-hidden">
              <div className="min-w-0">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] tracking-wide mb-2">
                  NO MCP? USE THE HTTP API
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-3">
                  For ChatGPT Custom GPTs and OpenWebUI, import the OpenAPI spec as an Action or Tool. Same render + prompt endpoints, no MCP required.
                </p>
                <CopyBlock text="https://slideshot.chavan.in/api/openapi.json" dark>
                  <code className="text-xs font-mono bg-[#12122A] border-[3px] border-[#2A2A44] px-4 py-2 pr-10 text-[#FFD233] block whitespace-nowrap overflow-x-auto hide-scrollbar">
                    https://slideshot.chavan.in/api/openapi.json
                  </code>
                </CopyBlock>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-[#2A2A44] text-white/70 px-3 py-1.5 border-[3px] border-[#2A2A44]">
                    ChatGPT Custom GPT → OpenAPI Action
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-[#2A2A44] text-white/70 px-3 py-1.5 border-[3px] border-[#2A2A44]">
                    OpenWebUI → OpenAPI Tool
          </span>
                </div>
                <a
                  href="https://www.npmjs.com/package/slideshot-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-6 py-3 border-[3px] border-[#FFD233] hover:bg-white transition-colors duration-150 text-sm mt-4"
                >
                  View on npm <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </ScrollReveal>
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
              <div className="bg-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[8px_8px_0px_0px_#0A0A0A] ">
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
                  <div className="text-white/40 mt-3 mb-1"># Or install globally for speed & reusability</div>
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
                className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
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
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-6 py-3 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
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
                className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-6 py-3 border-[3px] border-[#FFD233] shadow-[3px_3px_0px_0px_#FFD233] hover:shadow-[5px_5px_0px_0px_#FFD233] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150 text-sm shrink-0"
              >
                Get Prompts <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PROMPT SECTIONS */}
      <PromptBlocks />

      {/* FAQ SECTION */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-3">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </ScrollReveal>

          <div className="space-y-4">
            {[
              {
                q: "What is slideshot?",
                a: "Slideshot is a free, open-source tool that converts HTML+CSS into high-resolution PNG, WebP, and PDF carousel slides. It works via a web editor, CLI (npx slideshot), or MCP server for AI tool integration with Claude, Cursor, and ChatGPT.",
              },
              {
                q: "How do I convert HTML to slides?",
                a: "Use the web editor at slideshot.chavan.in/editor to paste your HTML and export instantly. Or run 'npx slideshot ./slides.html --scale 4' in your terminal. Each element with the .slide class becomes one image in the output.",
              },
              {
                q: "Is slideshot free to use?",
                a: "Yes. Slideshot is 100% free and open source under the MIT license. No account required, no data stored, no usage limits on the CLI.",
              },
              {
                q: "What export formats does slideshot support?",
                a: "Slideshot exports to PNG, WebP, and PDF at up to 6x scale resolution (giving you images up to 3240x4050px from a 540x675 slide). All formats are bundled into a single ZIP file.",
              },
              {
                q: "Can I use slideshot with AI tools like Claude or ChatGPT?",
                a: "Yes. Install the MCP server (npx slideshot-mcp) to integrate with Claude Desktop, Cursor IDE, Windsurf, or any MCP client. For ChatGPT, create a Custom GPT using the OpenAPI spec at slideshot.chavan.in/api/openapi.json.",
              },
              {
                q: "How is slideshot different from Canva or screenshot tools?",
                a: "Slideshot is code-first: you write or generate HTML, and it renders pixel-perfect slides at up to 6x resolution. Unlike Canva, it's fully automatable via CLI and API. Unlike browser screenshots, it produces print-quality output without quality loss.",
              },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <details className="group border-[3px] border-[#0A0A0A] bg-white shadow-[3px_3px_0px_0px_#0A0A0A]">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-[#0A0A0A] text-sm select-none">
                    <span className="flex items-center gap-3">
                      <HelpCircle size={16} className="text-[#FFD233] shrink-0" />
                      {faq.q}
                    </span>
                    <span className="font-[var(--font-bebas-neue)] text-xl text-[#FFD233] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-[#666] leading-relaxed border-t-2 border-[#E5E3DE] pt-4">
                    {faq.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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
                className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
              >
                Open Editor <ArrowRight size={16} />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
              >
                Browse Gallery
              </Link>
          </div>
            <div className="mt-8 inline-block max-w-full">
              <CopyBlock text="npx slideshot ./slides.html" dark>
                <code className="text-sm font-mono bg-[#0A0A0A] border-[3px] border-[#0A0A0A] px-4 py-2 pr-10 text-[#FFD233] block whitespace-nowrap overflow-x-auto hide-scrollbar">
                  npx slideshot ./slides.html
                </code>
              </CopyBlock>
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
