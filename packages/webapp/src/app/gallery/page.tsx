"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryCard from "@/components/GalleryCard";
import CodePreviewModal from "@/components/CodePreviewModal";
import { SAMPLE_HTML } from "@/lib/sample-html";
import ScrollReveal from "@/components/ScrollReveal";
import { GALLERY_ITEMS, VARIANT_ORDER, type VariantKey } from "@/lib/gallery-themes";

export default function GalleryPage() {
  const [selectedVariant, setSelectedVariant] = useState<VariantKey | null>(null);
  const [promptData, setPromptData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const openModal = async (variant: VariantKey) => {
    if (!promptData[variant]) {
      setLoading(variant);
      try {
        const res = await fetch(`/api/prompt?variant=${variant}`);
        const data = await res.json();
        setPromptData((prev) => ({ ...prev, [variant]: data.prompt || "" }));
      } catch {
        setPromptData((prev) => ({
          ...prev,
          [variant]: "Failed to load prompt",
        }));
      }
      setLoading(null);
    }
    setSelectedVariant(variant);
  };

  useEffect(() => {
    const prefetch = async () => {
      try {
        const res = await fetch("/api/prompt?variant=browser-shell");
        const data = await res.json();
        setPromptData((prev) => ({
          ...prev,
          "browser-shell": data.prompt || "",
        }));
      } catch {}
    };
    prefetch();
  }, []);

  const selected = selectedVariant ? GALLERY_ITEMS[selectedVariant] : null;

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-[#FFD233] border-b-[3px] border-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
            <ScrollReveal animation="animate-slide-in-line">
              <h1 className="font-[var(--font-bebas-neue)] text-6xl md:text-8xl text-[#0A0A0A] mb-4">
                PROMPT GALLERY
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg font-medium text-[#0A0A0A]/70 max-w-2xl">
                Browse ready-made slide templates. Click any card to view the
                full HTML+CSS code and a live preview. Copy and paste into
                the editor or your AI tool.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {VARIANT_ORDER.map((key) => {
              const item = GALLERY_ITEMS[key];
              return (
                <GalleryCard
                  key={key}
                  name={item.name}
                  style={item.style}
                  palette={item.palette}
                  featured={item.featured}
                  sampleHtml={SAMPLE_HTML[key]}
                  onClick={() => openModal(key)}
                />
              );
            })}
          </div>

          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] px-8 py-6 text-center">
                <div className="w-8 h-8 border-[3px] border-[#FFD233] border-t-[#0A0A0A] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-[#666]">Loading template...</p>
              </div>
            </div>
          )}
        </section>
      </main>

      {selected && selectedVariant && (
        <CodePreviewModal
          isOpen={true}
          onClose={() => setSelectedVariant(null)}
          title={selected.name}
          code={promptData[selectedVariant] || "Loading prompt..."}
          sampleHtml={SAMPLE_HTML[selectedVariant] || ""}
          palette={selected.palette}
        />
      )}

      <Footer />
    </div>
  );
}
