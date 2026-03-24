import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Gallery — 8 Slide Templates for LinkedIn, Instagram & More",
  description:
    "Browse 8 ready-made AI prompt templates for generating carousel slides. Styles include minimal, monospace, bold social, data cards, corporate, dark neon, editorial, and browser-shell.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "AI Prompt Gallery — slideshot Templates",
    description:
      "8 ready-made AI prompt templates for carousel slides. Copy-paste into ChatGPT, Claude, or the slideshot editor.",
    url: "https://slideshot.chavan.in/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
