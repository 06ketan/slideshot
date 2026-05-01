import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import path from "node:path";
import fs from "node:fs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SAMPLE_HTML } from "@/lib/sample-html";
import {
  GALLERY_ITEMS,
  VARIANT_ORDER,
  type VariantKey,
} from "@/lib/gallery-themes";
import UseThemeButton from "./UseThemeButton";

type ThemeParams = { theme: string };

export async function generateStaticParams() {
  return VARIANT_ORDER.map((theme) => ({ theme }));
}

export async function generateMetadata(
  { params }: { params: Promise<ThemeParams> },
): Promise<Metadata> {
  const { theme } = await params;
  const item = GALLERY_ITEMS[theme as VariantKey];
  if (!item) return { title: "Theme not found — slideshot gallery" };

  const url = `https://slideshot.chavan.in/gallery/${theme}`;
  return {
    title: `${item.name} — slideshot AI prompt template`,
    description:
      item.description ??
      `Ready-made ${item.name} carousel template. ${item.style}.`,
    alternates: { canonical: `/gallery/${theme}` },
    openGraph: {
      title: `${item.name} — slideshot template`,
      description: item.description ?? item.style,
      url,
    },
  };
}

function loadPrompt(theme: VariantKey): string | null {
  // The prompts directory is shipped at the monorepo root. In dev it lives at
  // ../../prompts relative to this app; in vercel build it gets traced via
  // next.config.ts. Try both locations.
  const candidates = [
    path.resolve(process.cwd(), "..", "..", "prompts", `${theme}.md`),
    path.resolve(process.cwd(), "prompts", `${theme}.md`),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
    } catch {
      // continue
    }
  }
  return null;
}

export default async function ThemeDetailPage(
  { params }: { params: Promise<ThemeParams> },
) {
  const { theme } = await params;
  const item = GALLERY_ITEMS[theme as VariantKey];
  if (!item) notFound();

  const promptText = loadPrompt(theme as VariantKey);
  const sampleHtml = SAMPLE_HTML[theme as VariantKey] ?? "";
  const variantKey = theme as VariantKey;

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            <Link
              href="/gallery"
              className="inline-block mb-4 text-sm font-bold text-[#0A0A0A]/70 hover:text-[#0A0A0A]"
            >
              ← All themes
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="font-[var(--font-bebas-neue)] text-5xl md:text-7xl text-[#0A0A0A] leading-none">
                  {item.name.toUpperCase()}
                </h1>
                <p className="mt-3 text-base md:text-lg font-medium text-[#0A0A0A]/80 max-w-2xl">
                  {item.description ?? item.style}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {item.palette.map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="w-8 h-8 border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A]"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="bg-white border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] overflow-hidden">
              <div className="border-b-[3px] border-[#0A0A0A] bg-[#FFFDF5] px-4 py-2 flex justify-between items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-[#0A0A0A]/60">
                  Live preview · 540 × 675
                </span>
                <span className="text-xs font-mono text-[#0A0A0A]/50">
                  {variantKey}
                </span>
              </div>
              {sampleHtml ? (
                <iframe
                  title={`${item.name} sample`}
                  srcDoc={sampleHtml}
                  className="w-full h-[840px] block bg-white"
                  sandbox=""
                />
              ) : (
                <div className="p-12 text-center text-sm text-[#0A0A0A]/60">
                  Sample preview coming soon for this theme.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-6">
              <h2 className="font-[var(--font-bebas-neue)] text-3xl text-[#0A0A0A] mb-2">
                Prompt template
              </h2>
              <p className="text-sm text-[#0A0A0A]/70 mb-4">
                Paste this into ChatGPT, Claude, or the slideshot editor to get
                a {item.name.toLowerCase()} carousel.
              </p>
              {promptText ? (
                <UseThemeButton
                  theme={variantKey}
                  promptText={promptText}
                />
              ) : (
                <div className="text-sm text-[#0A0A0A]/60">
                  Prompt for this theme is not yet available.
                </div>
              )}
            </div>

            <div className="bg-[#0A0A0A] text-[#FFFDF5] border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#FFD233] p-6">
              <h2 className="font-[var(--font-bebas-neue)] text-3xl mb-2">
                Style brief
              </h2>
              <p className="text-sm opacity-90">{item.style}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono opacity-80">
                {item.palette.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 inline-block"
                      style={{ background: c, border: "1px solid #FFFDF5" }}
                    />
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {promptText && (
              <details className="bg-[#FFFDF5] border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] p-6">
                <summary className="cursor-pointer font-bold text-sm tracking-wide uppercase">
                  View raw prompt markdown
                </summary>
                <pre className="mt-4 text-xs font-mono whitespace-pre-wrap text-[#0A0A0A]/80 overflow-auto max-h-96">
{promptText}
                </pre>
              </details>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
