import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { BreadcrumbSchema, HowToSchema, FAQSchema } from "@/components/JsonLd";
import {
  ArrowRight,
  Terminal,
  Globe,
  Zap,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import CopyBlock from "@/components/CopyBlock";

export const metadata: Metadata = {
  title: "HTML to PNG — Convert HTML+CSS to High-Resolution PNG Images",
  description:
    "Convert any HTML+CSS to high-resolution PNG images at up to 6x scale. Free online tool and CLI. No signup required. Export pixel-perfect screenshots from code.",
  alternates: {
    canonical: "/html-to-png",
  },
  openGraph: {
    title: "HTML to PNG — Convert HTML to High-Res PNG Images | slideshot",
    description:
      "Free tool to convert HTML+CSS into high-resolution PNG images at up to 6x scale. Web editor and CLI available.",
    url: "https://slideshot.chavan.in/html-to-png",
  },
};

export default function HtmlToPngPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <HowToSchema
        name="How to Convert HTML to PNG"
        description="Convert HTML+CSS code into high-resolution PNG images using slideshot."
        steps={[
          {
            name: "Write or paste your HTML",
            text: "Create HTML with .slide class elements or paste existing HTML+CSS code.",
          },
          {
            name: "Open the slideshot editor or use the CLI",
            text: "Go to slideshot.chavan.in/editor and paste your HTML, or save it as a file and run 'npx slideshot ./file.html --formats png'.",
          },
          {
            name: "Set PNG as the export format",
            text: "Select PNG in the format options. Choose a scale factor (up to 6x) for higher resolution output.",
          },
          {
            name: "Export and download",
            text: "Click Export to download a ZIP file containing your high-resolution PNG images.",
          },
        ]}
      />
      <FAQSchema
        faqs={[
          {
            question: "How do I convert HTML to PNG?",
            answer:
              "Use slideshot's web editor at slideshot.chavan.in/editor to paste HTML and export to PNG, or run 'npx slideshot ./file.html --formats png' in your terminal.",
          },
          {
            question: "What resolution are the PNG exports?",
            answer:
              "Slideshot supports up to 6x scale. A 540x675 slide at 4x scale produces a 2160x2700 PNG image.",
          },
          {
            question: "Is the HTML to PNG converter free?",
            answer:
              "Yes. Slideshot is 100% free and open source. No account, no watermark, no limits on the CLI.",
          },
          {
            question: "Can I convert HTML to PNG programmatically?",
            answer:
              "Yes. Use the CLI (npx slideshot), the REST API, or the MCP server for automation in scripts, CI/CD, or AI workflows.",
          },
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { name: "Home", href: "/" },
                { name: "HTML to PNG", href: "/html-to-png" },
              ]}
            />
          </div>
          <h1 className="font-[var(--font-bebas-neue)] text-6xl md:text-8xl text-[#0A0A0A] leading-[0.85] mb-6">
            HTML TO PNG
          </h1>
          <p className="text-lg font-medium text-[#0A0A0A]/70 max-w-2xl mb-8 leading-relaxed">
            Convert any HTML+CSS into high-resolution PNG images at up to 6x
            scale. Slideshot renders each <code className="bg-[#0A0A0A] text-[#FFD233] px-1.5 py-0.5 text-sm font-mono">.slide</code> element
            as a separate PNG file, giving you pixel-perfect output from code.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
            >
              Try the Editor Free <ArrowRight size={16} />
            </Link>
            <CopyBlock
              text="npx slideshot ./file.html --formats png --scale 4"
              dark
            >
              <code className="inline-flex items-center text-xs font-mono bg-[#0A0A0A] text-[#FFD233] px-4 py-3.5 pr-10 border-[3px] border-[#0A0A0A] whitespace-nowrap">
                npx slideshot ./file.html --formats png --scale 4
              </code>
            </CopyBlock>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-12 text-center">
              HOW IT WORKS
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Write HTML with .slide elements",
                desc: "Each element with class .slide becomes one PNG image. Use any CSS styling you want — fonts, gradients, images, flexbox, grid.",
                icon: <Terminal size={24} />,
              },
              {
                step: "02",
                title: "Choose resolution and export",
                desc: "Set your scale factor from 1x to 6x. A 540x675 slide at 4x produces a 2160x2700px PNG — high enough for print.",
                icon: <ImageIcon size={24} />,
              },
              {
                step: "03",
                title: "Download your PNGs",
                desc: "Get a ZIP file with all your slides as individual PNG files. Ready for LinkedIn carousels, presentations, or social media.",
                icon: <Zap size={24} />,
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-8 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#FFD233] border-[3px] border-[#0A0A0A] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-[var(--font-bebas-neue)] text-3xl text-[#0A0A0A]">
                      {item.step}
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

      {/* Three methods */}
      <section className="bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-white mb-4">
              THREE WAYS TO CONVERT
            </h2>
            <p className="text-white/60 text-lg mb-12 max-w-2xl">
              Use whichever method fits your workflow — browser, terminal, or AI.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe size={20} className="text-[#0A0A0A]" />,
                title: "Web Editor",
                desc: "Paste HTML in the browser, preview live, and export PNG with one click. No install needed.",
                cta: "Open Editor",
                href: "/editor",
              },
              {
                icon: <Terminal size={20} className="text-[#0A0A0A]" />,
                title: "CLI Tool",
                desc: "Run npx slideshot in your terminal. Works in CI/CD, GitHub Actions, and shell scripts.",
                cta: "View on npm",
                href: "https://www.npmjs.com/package/slideshot",
              },
              {
                icon: <Zap size={20} className="text-[#0A0A0A]" />,
                title: "MCP Server",
                desc: "Let Claude or Cursor generate slides and export PNG automatically via the MCP protocol.",
                cta: "View MCP Server",
                href: "https://www.npmjs.com/package/slideshot-mcp",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="border-[3px] border-[#FFD233] p-6 h-full flex flex-col">
                  <div className="w-10 h-10 bg-[#FFD233] border-[3px] border-[#FFD233] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#FFD233] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">
                    {item.desc}
                  </p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#FFD233] hover:text-white transition-colors duration-150"
                  >
                    {item.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: slideshot vs alternatives */}
      <section className="border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-8 text-center">
              SLIDESHOT VS OTHER METHODS
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="border-[3px] border-[#0A0A0A] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0A0A0A] text-white">
                    <th className="text-left px-4 py-3 font-bold">Feature</th>
                    <th className="text-center px-4 py-3 font-bold text-[#FFD233]">
                      slideshot
                    </th>
                    <th className="text-center px-4 py-3 font-bold">
                      Browser Screenshot
                    </th>
                    <th className="text-center px-4 py-3 font-bold">Canva</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Max resolution", "6x (3240x4050)", "1x (screen DPI)", "Varies"],
                    ["Automation / CLI", "Yes (npx)", "No", "No"],
                    ["AI integration", "MCP + API", "No", "Limited"],
                    ["Code-first workflow", "Yes", "Manual", "Drag & drop"],
                    ["Batch processing", "Yes", "No", "Limited"],
                    ["Cost", "Free / open source", "Free", "Paid plans"],
                    ["Privacy", "No data stored", "Local", "Cloud-based"],
                  ].map(([feature, ss, screenshot, canva], i) => (
                    <tr
                      key={i}
                      className={
                        i % 2 === 0 ? "bg-white" : "bg-[#FFFDF5]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-[#0A0A0A] border-t-2 border-[#E5E3DE]">
                        {feature}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-[#0A0A0A] border-t-2 border-[#E5E3DE]">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle
                            size={14}
                            className="text-[#FFD233]"
                          />
                          {ss}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-[#666] border-t-2 border-[#E5E3DE]">
                        {screenshot}
                      </td>
                      <td className="px-4 py-3 text-center text-[#666] border-t-2 border-[#E5E3DE]">
                        {canva}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="font-[var(--font-bebas-neue)] text-5xl text-[#0A0A0A] mb-8 text-center">
            HTML TO PNG FAQ
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I convert HTML to PNG?",
                a: "Use slideshot's web editor at slideshot.chavan.in/editor to paste HTML and export to PNG, or run 'npx slideshot ./file.html --formats png' in your terminal.",
              },
              {
                q: "What resolution are the PNG exports?",
                a: "Slideshot supports up to 6x scale. A 540x675 slide at 4x scale produces a 2160x2700 PNG. At 6x, you get 3240x4050px — high enough for print.",
              },
              {
                q: "Is the HTML to PNG converter free?",
                a: "Yes. Slideshot is 100% free and open source under the MIT license. No account, no watermark, no limits on the CLI.",
              },
              {
                q: "Can I convert HTML to PNG in CI/CD?",
                a: "Yes. Run 'npx slideshot ./slides.html --formats png --scale 4' in any CI/CD pipeline, GitHub Actions workflow, or shell script. No browser installation needed — Puppeteer is bundled.",
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
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-4">
            CONVERT HTML TO PNG NOW
          </h2>
          <p className="text-[#666] text-lg mb-8">
            No signup. No install. Paste HTML and export high-res PNGs in
            seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-[#FFD233] text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
            >
              Try the Editor Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-8 py-3.5 border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 text-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
