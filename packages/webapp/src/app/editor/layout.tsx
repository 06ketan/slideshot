import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML to Slides Editor — Paste HTML, Export PNG, WebP & PDF",
  description:
    "Free online editor to convert HTML+CSS into high-resolution carousel slides. Paste your code, see a live preview, and export to PNG, WebP, or PDF with one click.",
  alternates: {
    canonical: "/editor",
  },
  openGraph: {
    title: "HTML to Slides Editor — slideshot",
    description:
      "Free online editor to convert HTML+CSS into high-res carousel slides. Live preview, one-click export.",
    url: "https://slideshot.chavan.in/editor",
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
