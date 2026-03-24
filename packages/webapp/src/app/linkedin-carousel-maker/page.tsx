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
  CheckCircle,
  Users,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import CopyBlock from "@/components/CopyBlock";

export const metadata: Metadata = {
  title:
    "LinkedIn Carousel Maker — Create Carousel Posts from HTML or AI Prompts",
  description:
    "Create LinkedIn carousel posts from HTML+CSS or AI-generated content. Export high-res PNG slides sized for LinkedIn. Free, open-source, no signup required.",
  alternates: {
    canonical: "/linkedin-carousel-maker",
  },
  openGraph: {
    title: "LinkedIn Carousel Maker — slideshot",
    description:
      "Create LinkedIn carousel posts from HTML or AI prompts. Export high-res PNG slides. Free and open source.",
    url: "https://slideshot.chavan.in/linkedin-carousel-maker",
  },
};

export default function LinkedInCarouselMakerPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <HowToSchema
        name="How to Create LinkedIn Carousel Posts"
        description="Create LinkedIn carousel posts using slideshot's HTML-to-slides converter and AI prompt templates."
        steps={[
          {
            name: "Choose a template or write HTML",
            text: "Pick a carousel template from the gallery, or use an AI tool (ChatGPT, Claude) with slideshot's prompt templates to generate slide HTML for your topic.",
          },
          {
            name: "Customize your content",
            text: "Edit the HTML in slideshot's web editor. Adjust text, colors, fonts, and layout. The default 540x675 size is optimized for LinkedIn carousels.",
          },
          {
            name: "Export as PNG",
            text: "Select PNG format at 4x scale for crisp LinkedIn display. Click Export to download a ZIP with all slides.",
          },
          {
            name: "Upload to LinkedIn",
            text: "Create a new LinkedIn post, select 'Document', and upload your PNG slides as a carousel.",
          },
        ]}
      />
      <FAQSchema
        faqs={[
          {
            question: "What size should LinkedIn carousel slides be?",
            answer:
              "LinkedIn recommends 1080x1350 pixels (4:5 ratio) for carousel posts. Slideshot's default 540x675 at 2x-4x scale gives you 1080x1350 to 2160x2700 — ideal for LinkedIn.",
          },
          {
            question: "How many slides can a LinkedIn carousel have?",
            answer:
              "LinkedIn allows up to 300 pages in a carousel document post. Most effective carousels use 5-15 slides.",
          },
          {
            question: "Can I use AI to generate LinkedIn carousel content?",
            answer:
              "Yes. Use slideshot's AI prompt templates with ChatGPT or Claude to generate HTML carousel content. The MCP server can automate the entire flow — AI writes HTML, slideshot renders slides.",
          },
          {
            question: "Is the LinkedIn carousel maker free?",
            answer:
              "Yes. Slideshot is 100% free and open source. No account, no watermark, no limits.",
          },
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { name: "Home", href: "/" },
                { name: "LinkedIn Carousel Maker", href: "/linkedin-carousel-maker" },
              ]}
            />
          </div>
          <h1 className="font-[var(--font-bebas-neue)] text-6xl md:text-8xl text-[#0A0A0A] leading-[0.85] mb-6">
            LINKEDIN
            <br />
            CAROUSEL MAKER
          </h1>
          <p className="text-lg font-medium text-[#0A0A0A]/70 max-w-2xl mb-8 leading-relaxed">
            Create LinkedIn carousel posts from HTML+CSS or AI-generated content.
            Slideshot renders your slides at the ideal 4:5 ratio and up to 6x
            resolution, giving you high-quality carousels without Canva or design
            tools.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all text-sm"
            >
              Create Your Carousel <ArrowRight size={16} />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all text-sm"
            >
              Browse Templates <Palette size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why use slideshot for LinkedIn */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-12 text-center">
              WHY USE SLIDESHOT FOR LINKEDIN
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp size={24} />,
                title: "LinkedIn-Optimized",
                desc: "Default 540x675 (4:5 ratio) matches LinkedIn's recommended carousel dimensions. Export at 2x-4x for retina-quality slides.",
              },
              {
                icon: <Zap size={24} />,
                title: "AI-Powered Creation",
                desc: "Use built-in AI prompt templates with ChatGPT or Claude. Describe your topic, get carousel HTML. Render with one click or command.",
              },
              {
                icon: <Users size={24} />,
                title: "Consistent Branding",
                desc: "HTML+CSS gives you full control over fonts, colors, and layout. Build a brand template once, reuse it for every post.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white">
                  <div className="w-12 h-12 bg-[#FFD233] border-[3px] border-[#0A0A0A] flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] mb-2 tracking-wide">
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

      {/* How to create */}
      <section className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-white mb-12">
              HOW TO CREATE A LINKEDIN CAROUSEL
            </h2>
          </ScrollReveal>
          <div className="space-y-6">
            {[
              {
                n: "01",
                title: "Pick a template or use AI",
                desc: "Browse the template gallery for ready-made styles. Or paste a slideshot prompt into ChatGPT/Claude with your topic — it generates the HTML for you.",
              },
              {
                n: "02",
                title: "Edit in the web editor",
                desc: "Paste the HTML into the slideshot editor. See a live preview as you customize text, colors, and layout. The default 540x675 is already LinkedIn-optimized.",
              },
              {
                n: "03",
                title: "Export at high resolution",
                desc: "Select PNG format and 4x scale. Click Export to download a ZIP with all slides as individual PNG files.",
              },
              {
                n: "04",
                title: "Upload to LinkedIn",
                desc: "Create a new LinkedIn post, click the document icon, and upload your PNG files. LinkedIn will display them as a swipeable carousel.",
              },
            ].map((step) => (
              <ScrollReveal key={step.n} delay={Number(step.n) * 0.05}>
                <div className="flex gap-6 items-start border-[3px] border-[#FFD233] p-6">
                  <span className="font-[var(--font-bebas-neue)] text-4xl text-[#FFD233] shrink-0 w-12">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLI option */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-[var(--font-bebas-neue)] text-4xl text-[#0A0A0A] mb-4">
                  BATCH CREATE CAROUSELS WITH THE CLI
                </h2>
                <p className="text-[#666] text-sm leading-relaxed mb-6">
                  Automate carousel creation for content at scale. Run{" "}
                  <code className="bg-[#0A0A0A] text-[#FFD233] px-1.5 py-0.5 text-xs font-mono">
                    npx slideshot
                  </code>{" "}
                  in scripts, CI/CD pipelines, or GitHub Actions. Generate
                  LinkedIn carousels programmatically from data, templates, or AI
                  output.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FFD233] text-[#0A0A0A] px-3 py-1.5 border-[3px] border-[#0A0A0A]">
                    CI/CD Ready
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FFD233] text-[#0A0A0A] px-3 py-1.5 border-[3px] border-[#0A0A0A]">
                    GitHub Actions
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FFD233] text-[#0A0A0A] px-3 py-1.5 border-[3px] border-[#0A0A0A]">
                    Shell Scripts
                  </span>
                </div>
              </div>
              <CopyBlock
                text="npx slideshot ./carousel.html --formats png --scale 4"
                dark
              >
                <div className="bg-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-6 font-mono text-sm">
                  <div className="text-white/40 mb-2"># LinkedIn carousel</div>
                  <div className="text-white pr-10">
                    <span className="text-[#FFD233]">$</span> npx slideshot
                    ./carousel.html --formats png --scale 4
                  </div>
                  <div className="text-[#FFD233] mt-3">
                    Done — slides.zip (8 slides, PNG)
                  </div>
                </div>
              </CopyBlock>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-8 text-center">
            LINKEDIN CAROUSEL FAQ
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What size should LinkedIn carousel slides be?",
                a: "LinkedIn recommends 1080x1350 pixels (4:5 ratio). Slideshot's default 540x675 at 2x gives you exactly 1080x1350. At 4x, you get 2160x2700 for extra clarity on high-DPI screens.",
              },
              {
                q: "How many slides can a LinkedIn carousel have?",
                a: "LinkedIn allows up to 300 pages, but most effective carousels use 5-15 slides. Slideshot can render up to 20 slides per export.",
              },
              {
                q: "Can I use AI to generate LinkedIn carousel content?",
                a: "Yes. Slideshot includes 8 AI prompt templates. Paste a prompt into ChatGPT or Claude with your topic, and it generates LinkedIn-ready carousel HTML. The MCP server can automate the entire flow.",
              },
              {
                q: "How do I upload a carousel to LinkedIn?",
                a: "Create a new post on LinkedIn, click the document icon (not photo), and upload your PNG or PDF file. LinkedIn displays the pages as a swipeable carousel.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group border-[3px] border-[#0A0A0A] bg-white shadow-[3px_3px_0px_0px_#0A0A0A]"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-[#0A0A0A] text-sm select-none">
                  {faq.q}
                  <span className="font-[var(--font-bebas-neue)] text-xl text-[#0A0A0A] group-open:rotate-45 transition-transform">
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
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-4">
            CREATE YOUR LINKEDIN CAROUSEL
          </h2>
          <p className="text-[#666] text-lg mb-8">
            No signup. No design skills needed. Code or AI does the work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all text-sm"
            >
              Try the Editor Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all text-sm"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
