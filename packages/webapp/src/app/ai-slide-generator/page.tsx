import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { HowToSchema, FAQSchema } from "@/components/JsonLd";
import {
  ArrowRight,
  Palette,
  Zap,
  Terminal,
  Server,
  Sparkles,
  Bot,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import CopyBlock from "@/components/CopyBlock";

export const metadata: Metadata = {
  title: "AI Slide Generator — Create Slides from Text with AI + slideshot",
  description:
    "Generate presentation slides from text using AI. Slideshot's MCP server and prompt templates let ChatGPT, Claude, or Cursor create and render slides automatically. Free and open source.",
  alternates: {
    canonical: "/ai-slide-generator",
  },
  openGraph: {
    title: "AI Slide Generator — slideshot",
    description:
      "Generate slides from text using AI. ChatGPT, Claude, or Cursor create HTML slides, slideshot renders them to PNG/WebP/PDF.",
    url: "https://slideshot.chavan.in/ai-slide-generator",
  },
};

export default function AiSlideGeneratorPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <HowToSchema
        name="How to Generate Slides with AI"
        description="Use AI tools like ChatGPT, Claude, or Cursor with slideshot to generate presentation slides from a text description."
        steps={[
          {
            name: "Get a prompt template",
            text: "Visit the slideshot gallery and copy an AI prompt template for your desired slide style (minimal, corporate, bold social, etc.).",
          },
          {
            name: "Generate HTML with AI",
            text: "Paste the prompt into ChatGPT, Claude, or any AI tool along with your topic. The AI generates slideshot-compatible HTML with .slide elements.",
          },
          {
            name: "Render the slides",
            text: "Paste the HTML into the slideshot web editor or run 'npx slideshot ./slides.html'. Or use the MCP server to let the AI render automatically.",
          },
          {
            name: "Export and share",
            text: "Download high-res PNG, WebP, or PDF slides. Upload to LinkedIn, use in presentations, or share anywhere.",
          },
        ]}
      />
      <FAQSchema
        faqs={[
          {
            question: "How does the AI slide generator work?",
            answer:
              "Slideshot provides AI prompt templates that instruct ChatGPT, Claude, or other AI tools to generate HTML with .slide elements. Slideshot then renders each slide as a high-res PNG, WebP, or PDF image.",
          },
          {
            question: "Which AI tools work with slideshot?",
            answer:
              "Any AI that generates HTML works. Slideshot has direct integration via MCP server with Claude Desktop, Cursor IDE, and Windsurf. ChatGPT works via Custom GPTs with the OpenAPI spec, or by copy-pasting HTML output.",
          },
          {
            question: "Can AI generate slides automatically without manual steps?",
            answer:
              "Yes. The slideshot MCP server (slideshot-mcp) lets Claude or Cursor generate HTML and render slides in a single conversation — no copy-paste needed.",
          },
          {
            question: "Is the AI slide generator free?",
            answer:
              "Slideshot is free and open source. You bring your own AI tool (ChatGPT, Claude, etc.) — slideshot handles the rendering.",
          },
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="mb-6">
            <Breadcrumb
              dark
              items={[
                { name: "Home", href: "/" },
                { name: "AI Slide Generator", href: "/ai-slide-generator" },
              ]}
            />
          </div>
          <div className="inline-flex items-center gap-2 bg-[#FFD233] border-[3px] border-[#FFD233] px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-[#0A0A0A]" />
            <span className="text-sm font-bold text-[#0A0A0A]">
              AI-Powered
            </span>
          </div>
          <h1 className="font-[var(--font-bebas-neue)] text-6xl md:text-8xl text-white leading-[0.85] mb-6">
            AI SLIDE
            <br />
            <span className="text-[#FFD233]">GENERATOR</span>
          </h1>
          <p className="text-lg font-medium text-white/60 max-w-2xl mb-8 leading-relaxed">
            Slideshot turns AI-generated HTML into high-resolution carousel
            slides. Describe your topic to ChatGPT, Claude, or any AI tool — get
            presentation-ready PNG, WebP, or PDF slides in seconds. 8 built-in
            prompt templates handle the formatting.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#FFD233] shadow-[3px_3px_0px_0px_#FFD233] hover:shadow-[5px_5px_0px_0px_#FFD233] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
            >
              Get AI Prompt Templates <ArrowRight size={16} />
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 border-[3px] border-[#FFD233] hover:bg-[#FFD233] hover:text-[#0A0A0A] transition-all duration-150 text-sm"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-12 text-center">
              HOW AI SLIDE GENERATION WORKS
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                n: "01",
                icon: <Palette size={24} />,
                title: "Choose a style template",
                desc: "Pick from 8 AI prompt templates: minimal, monospace, bold social, data cards, corporate, dark neon, editorial, or browser-shell. Each includes formatting instructions for the AI.",
              },
              {
                n: "02",
                icon: <Bot size={24} />,
                title: "AI generates the HTML",
                desc: "Paste the prompt + your topic into ChatGPT, Claude, or any AI. The AI outputs slideshot-compatible HTML with .slide elements, proper dimensions, and your chosen style.",
              },
              {
                n: "03",
                icon: <Zap size={24} />,
                title: "slideshot renders the slides",
                desc: "Paste the HTML into the web editor or run 'npx slideshot'. Each .slide becomes a high-res image at up to 6x scale. Or use the MCP server for zero-click rendering.",
              },
              {
                n: "04",
                icon: <ArrowRight size={24} />,
                title: "Export and share",
                desc: "Download PNG, WebP, or PDF. Use for LinkedIn carousels, Instagram posts, pitch decks, or presentations. All in a single ZIP file.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#FFD233] border-[3px] border-[#0A0A0A] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-[var(--font-bebas-neue)] text-3xl text-[#0A0A0A]">
                      {item.n}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0A0A0A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Server section */}
      <section className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FFD233] border-[3px] border-[#FFD233] flex items-center justify-center">
                <Server size={20} className="text-[#0A0A0A]" />
              </div>
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#FFD233]">
                Zero-Click Workflow
              </span>
            </div>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-white mb-4">
              MCP SERVER FOR FULLY
              <br />
              <span className="text-[#FFD233]">AUTOMATED SLIDES</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mb-8 leading-relaxed">
              Install the slideshot MCP server in Claude Desktop or Cursor. Just
              describe what you want — the AI writes the HTML and calls
              slideshot to render it. No copy-paste, no editor, no terminal.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <CopyBlock
                text={`{\n  "mcpServers": {\n    "slideshot": {\n      "command": "npx",\n      "args": ["-y", "slideshot-mcp"]\n    }\n  }\n}`}
                dark
                multiline
              >
                <div className="border-[3px] border-[#FFD233] p-6 overflow-x-auto hide-scrollbar">
                  <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] mb-3">
                    INSTALL MCP SERVER
                  </h3>
                  <pre className="text-xs font-mono bg-[#12122A] border-[3px] border-[#2A2A44] px-4 py-3 pr-10 text-[#FFD233] leading-relaxed whitespace-pre overflow-x-auto">
                    {`{
  "mcpServers": {
    "slideshot": {
      "command": "npx",
      "args": ["-y", "slideshot-mcp"]
    }
  }
}`}
                  </pre>
                </div>
              </CopyBlock>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="border-[3px] border-[#FFD233] p-6 h-full flex flex-col justify-center">
                <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] mb-4">
                  COMPATIBLE WITH
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Claude Desktop",
                    "Cursor IDE",
                    "Windsurf",
                    "ChatGPT (via API)",
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
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-4 text-center">
              8 AI PROMPT TEMPLATES
            </h2>
            <p className="text-[#0A0A0A]/70 text-lg text-center mb-12 max-w-xl mx-auto">
              Each template is a detailed AI prompt that generates
              slideshot-compatible HTML in a specific visual style.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Clean Minimal",
              "Monospace",
              "Bold Social",
              "Data Cards",
              "Corporate",
              "Dark Neon",
              "Editorial",
              "Browser Shell",
            ].map((name, i) => (
              <ScrollReveal key={i} delay={i * 0.03}>
                <div className="border-[3px] border-[#0A0A0A] bg-white p-4 shadow-[3px_3px_0px_0px_#0A0A0A] text-center">
                  <span className="font-bold text-sm text-[#0A0A0A]">
                    {name}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
            >
              View All Templates <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-8 text-center">
            AI SLIDE GENERATOR FAQ
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How does the AI slide generator work?",
                a: "Slideshot provides AI prompt templates that instruct ChatGPT, Claude, or other AI to generate HTML with .slide elements. Slideshot then renders each slide as a high-res image. The MCP server can automate the entire flow in a single conversation.",
              },
              {
                q: "Which AI tools work with slideshot?",
                a: "Any AI that generates HTML works with slideshot. Direct MCP integration is available for Claude Desktop, Cursor IDE, and Windsurf. ChatGPT works via Custom GPTs with the OpenAPI spec, or by pasting HTML output into the editor.",
              },
              {
                q: "Can AI generate slides without any manual steps?",
                a: "Yes. With the slideshot MCP server, you describe your slides to Claude or Cursor, and the AI generates HTML and renders it to files in one step. No copy-paste needed.",
              },
              {
                q: "What kind of slides can AI generate?",
                a: "Anything that can be expressed in HTML+CSS: LinkedIn carousels, pitch decks, educational content, data visualizations, social media posts, and more. The 8 built-in templates cover common styles from minimal to corporate.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group border-[3px] border-[#0A0A0A] bg-white shadow-[3px_3px_0px_0px_#0A0A0A]"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-[#0A0A0A] text-sm select-none">
                  {faq.q}
                  <span className="font-[var(--font-bebas-neue)] text-xl text-[#FFD233] group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm text-[#666] leading-relaxed border-t-2 border-[#E5E3DE] pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFD233]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-4">
            GENERATE SLIDES WITH AI
          </h2>
          <p className="text-[#0A0A0A]/70 text-lg mb-8">
            Grab a prompt template and let AI do the work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
            >
              Get AI Prompt Templates <ArrowRight size={16} />
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
            >
              Try the Editor Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
