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
  title: "slideshot — HTML to High-Res Slides, PNG, WebP & PDF",
  description:
    "Convert HTML+CSS into beautiful carousel slides. Export to high-res PNG, WebP, and PDF. AI prompt templates, CLI, and MCP server included.",
  metadataBase: new URL("https://slideshot.vercel.app"),
  openGraph: {
    title: "slideshot — HTML to High-Res Slides",
    description:
      "Convert HTML+CSS into carousel slides. Export PNG, WebP, PDF. AI prompts, CLI & MCP.",
    url: "https://slideshot.vercel.app",
    siteName: "slideshot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "slideshot — HTML to High-Res Slides",
    description:
      "Convert HTML+CSS into carousel slides. Export PNG, WebP, PDF.",
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
