import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "slideshot — Convert HTML to High-Res PNG, WebP & PDF Slides",
    template: "%s | slideshot",
  },
  description:
    "Slideshot is a free, open-source tool that converts HTML+CSS into high-resolution PNG, WebP, and PDF carousel slides. Use the web editor, CLI (npx slideshot), or MCP server for AI-powered slide generation.",
  metadataBase: new URL("https://slideshot.chavan.in"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "html to slides",
    "html to png",
    "html to webp",
    "html to pdf",
    "html to image",
    "carousel maker",
    "linkedin carousel maker",
    "AI slide generator",
    "html to carousel",
    "npx slideshot",
    "open source slide generator",
    "MCP server slides",
  ],
  authors: [{ name: "Ketan Chavan", url: "https://github.com/06ketan" }],
  creator: "Ketan Chavan",
  publisher: "slideshot",
  openGraph: {
    title: "slideshot — Convert HTML to High-Res PNG, WebP & PDF Slides",
    description:
      "Free, open-source tool to convert HTML+CSS into high-res carousel slides. Web editor, CLI, and MCP server included.",
    url: "https://slideshot.chavan.in",
    siteName: "slideshot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "slideshot — Convert HTML to High-Res Slides",
    description:
      "Free, open-source tool to convert HTML+CSS into PNG, WebP & PDF carousel slides.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
